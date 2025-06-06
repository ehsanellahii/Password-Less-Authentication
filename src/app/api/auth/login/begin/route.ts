import dbConnect from '@/connnectDb';
import { getRpConfig } from '@/rpConfig';
import PasskeyCredentialList from '@/schemas/passKey.model';
import User from '@/schemas/user.model';
import { sessionOptions } from '@/sessionOptions';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
  dbConnect();
  const { rpID } = getRpConfig(req);
  const res = new Response();
  const session: any = await getIronSession(req, res, sessionOptions);

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 401 });
  }

  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json(
        {
          error: 'Username is required for authentication',
        },
        { status: 400 }
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

    // Get user's credentials from database
    const passkeys = await PasskeyCredentialList.find({
      userId: user._id,
      status: 'active',
    });
    console.log('Active passkeys:', passkeys);
    if (!passkeys.length) {
      return NextResponse.json({ error: 'No active passkeys found for this user' }, { status: 404 });
    }

    // Create allowCredentials array properly
    const allowCredentials = passkeys.map((key) => {
      return {
        id: key.credentialID,
        type: 'public-key' as const,
        transports: ['internal', 'hybrid'], // Use stored transports or defaults
      };
    });

    console.log(
      'Allow credentials:',
      allowCredentials.map((c) => ({
        id: c.id,
        type: c.type,
        transports: c.transports,
      }))
    );

    const options = await generateAuthenticationOptions({
      timeout: 60000,
      allowCredentials: allowCredentials.map((cre) => ({
        id: cre.id as any,
        transports: ['internal', 'hybrid'], // Use stored transports or defaults
        type: 'public-key',
      })), // Use the properly formatted array directly
      userVerification: 'preferred',
      rpID: rpID,
    });

    // Store challenge and user info in session
    session.challenge = options.challenge;
    session.passkey_user_id = user._id;
    await session.save();

    console.log('Session saved with challenge:', session.challenge);

    return NextResponse.json(options, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': res.headers.get('Set-Cookie') || '',
      },
    });
  } catch (error) {
    console.error('Authentication challenge error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
