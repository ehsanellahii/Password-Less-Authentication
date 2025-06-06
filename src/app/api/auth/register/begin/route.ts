import dbConnect from '@/connnectDb';
import { getRpConfig } from '@/rpConfig';
import User from '@/schemas/user.model';
import { sessionOptions } from '@/sessionOptions';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { isoUint8Array } from '@simplewebauthn/server/helpers';
import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
  dbConnect();
  const { rpID } = getRpConfig(req);
  const rpName = process.env.WEBAUTHN_RP_NAME || 'Your App';
  const res = new Response(); // Use plain Response object
  const session: any = await getIronSession(req, res, sessionOptions);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 401 });
  }
  try {
    const { username } = await req.json();
    // const { username } = req.body;
    if (!username) {
      return NextResponse.json(
        {
          error: 'Username is required for registration',
        },
        { status: 400 }
      );
    }

    // Generate a unique user ID (in production, get from your user database)
    const user = await User.findOne({
      email: username,
    }).lean();

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: isoUint8Array.fromUTF8String(user?._id?.toString() || ''),
      userName: username,
      userDisplayName: username,
      timeout: 60000,
      attestationType: 'none',
      excludeCredentials: [], // Add existing credentials to prevent re-registration
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform', // Remove for cross-platform support
      },
      supportedAlgorithmIDs: [-7, -257], // ES256 and RS256
    });

    // Store challenge temporarily (use Redis/DB in production)
    // challenges.set(username, options.challenge);
    session.challenge = options.challenge; // ✅ important
    session.passkey_user_id = user?._id ?? '';
    await session.save();
    console.log('Session saved:', session);
    // console.log('Registration challenge generated:', options);
    return new Response(JSON.stringify(options), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': res.headers.get('Set-Cookie') || '',
      },
    });
  } catch (error) {
    console.error('Registration challenge error:', error);
    return NextResponse.json({ error: 'Failed to generate registration options' }, { status: 500 });
  }
}
