import dbConnect from '@/connnectDb';
import { getRpConfig } from '@/rpConfig';
import PasskeyCredentialList from '@/schemas/passKey.model';
import User from '@/schemas/user.model';
import { sessionOptions } from '@/sessionOptions';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
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
  try {
    const { username, credential } = await req.json();
    console.log('Received username:', username);
    console.log('Received credential:', credential);
    // Get stored challenge
    const expectedChallenge = session.challenge;
    console.log('Expected Challenge:', expectedChallenge);
    if (!expectedChallenge) {
      return NextResponse.json(
        { error: 'No challenge found' },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      email: username,
    }).lean();
    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
        },
        { status: 404 }
      );
    }
    if (user._id.toString() !== session.passkey_user_id.toString()) {
      return NextResponse.json(
        {
          error: 'User ID mismatch',
        },
        { status: 403 }
      );
    }
    const storedCredential = await PasskeyCredentialList.findOne({
      userId: user._id,
      credentialID: credential.id,
      status: 'active',
    });
    if (!storedCredential) {
      return NextResponse.json(
        {
          error: 'Credential not found or inactive',
        },
        { status: 404 }
      );
    }
    console.log('Stored Credential:', storedCredential);

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      credential: {
        id: storedCredential.credentialID,
        publicKey: Buffer.from(storedCredential.publicKey, 'base64url'),
        counter: storedCredential.counter,
      },
    });

    if (verification.verified) {
      await PasskeyCredentialList.updateOne({ _id: storedCredential._id }, { counter: verification.authenticationInfo.newCounter });
      return NextResponse.json(
        {
          verified: true,
          user: {
            userId: user._id.toString(),
            email: user.email,
            // displayName: username,
            isAuthenticated: true,
            loginTime: new Date().toISOString(),
            name: user.full_name || '',
            // format it to human-readable format
            joinedAt: user.createdAt.toDateString(),
          },
          message: 'Authentication successful',
        },
        {
          status: 200,
          headers: {
            'Set-Cookie': res.headers.get('Set-Cookie') || '',
          },
        }
      );
    } else {
      return NextResponse.json(
        {
          verified: false,
          error: 'Authentication verification failed',
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error('Authentication verification error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred during authentication verification',
      },
      {
        status: 500,
      }
    );
  }
}
