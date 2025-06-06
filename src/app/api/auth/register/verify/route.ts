import dbConnect from '@/connnectDb';
import { getRpConfig } from '@/rpConfig';
import PasskeyCredentialList from '@/schemas/passKey.model';
import User from '@/schemas/user.model';
import { sessionOptions } from '@/sessionOptions';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
  dbConnect();
  const { rpID, expectedOrigin } = getRpConfig(req);

  const res = new Response(); // Use plain Response object
  const session: any = await getIronSession(req, res, sessionOptions);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 401 });
  }
  console.log('Session retrieved:', session);

  try {
    const { username, fullName, credential } = await req.json();

    if (!username || !credential || !fullName) {
      return NextResponse.json(
        { error: 'Username and credential are required' },
        {
          status: 400,
        }
      );
    }
    const expectedChallenge = session.challenge;
    if (!expectedChallenge) {
      return NextResponse.json(
        { error: 'No registration challenge found in session' },
        {
          status: 400,
        }
      );
    }

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
    });
    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json(
        {
          verified: false,
          error: 'Registration verification failed',
        },
        {
          status: 400,
        }
      );
    }
    const {
      credential: { id: credentialID, publicKey: credentialPublicKey, counter, transports = [] },
    } = verification.registrationInfo;
    console.log('Credential ID:', credentialID);
    console.log('Public Key:', credentialPublicKey);
    console.log('Counter:', counter);
    console.log('Transports:', transports);

    console.log('Passkey stored successfully');
    if (!session.passkey_user_id) {
      const user = await User.create({
        full_name: fullName,
        email: username,
        primary_login_method: 'passkey',
      });
      const passkey = new PasskeyCredentialList({
        displayName: 'Passkey for ' + username,
        userId: user._id,
        credentialID: credentialID,
        publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
        counter,
        transports,
      });

      await passkey.save();
    } else {
      await User.updateOne(
        { _id: session.passkey_user_id },
        {
          full_name: fullName,
          email: username,
          primary_login_method: 'passkey',
        }
      );
      await PasskeyCredentialList.updateOne(
        { userId: session.passkey_user_id },
        {
          displayName: 'Passkey for ' + username,
          credentialID,
          publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
          counter,
          transports,
        }
      );
      console.log('User updated successfully');
    }
    session.challenge = null;
    session.passkey_user_id = null;
    await session.save();
    console.log('Session cleared after registration');
    return new Response(
      JSON.stringify({
        verified: true,
        message: 'Registration verification successful',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': res.headers.get('Set-Cookie') || '',
        },
      }
    );
  } catch (error) {
    console.error('Registration verification error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred during registration verification',
      },
      {
        status: 500,
      }
    );
  }
}
