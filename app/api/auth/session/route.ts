import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface SessionConfig {
  expiryDays: number;
  cookieName: string;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
}

// Validation and retrieval of configuration
const getSessionConfig = (): SessionConfig => {
  const expiryDays = parseInt(process.env.SESSION_EXPIRY_DAYS || '5', 10);

  if (isNaN(expiryDays) || expiryDays <= 0) {
    throw new Error("SESSION_EXPIRY_DAYS must be a positive number");
  }

  return {
    expiryDays,
    cookieName: process.env.SESSION_COOKIE_NAME || 'session',
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none',
    path: process.env.COOKIE_PATH || '/',
  };
};

interface SessionRequest {
  idToken: string;
}

interface SessionResponse {
  status: 'success' | 'error';
  message?: string;
}


export async function POST(req: Request): Promise<NextResponse<SessionResponse>> {
  try {

    const { idToken } = await req.json() as SessionRequest;

    if (!idToken) {
      return NextResponse.json({
        status: "error",
        message: "ID token is required"
      }, { status: 400 });
    }

    const config = getSessionConfig();

    // Create and configure session cookie
    const expiresIn = config.expiryDays * 24 * 60 * 60 * 1000;

    try {
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

      const cookieStore = await cookies();

      cookieStore.set(config.cookieName, sessionCookie, {
        maxAge: expiresIn / 1000,
        httpOnly: true,
        secure: config.secure,
        sameSite: config.sameSite,
        path: config.path,
      });

      // Logging only in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Session created successfully', {
          cookieName: config.cookieName,
          secure: config.secure,
          sameSite: config.sameSite,
          path: config.path,
          expiresIn: `${config.expiryDays} days`,
        })
      }

      return NextResponse.json({ status: 'success' });
    } catch (error) {
      // Firebase error handling
      console.log("Firebase session creation error: ", error);
      return NextResponse.json({
        status: 'error',
        message: 'Invalid or expired ID token'
      }, { status: 401 });

    }
  } catch (error) {
    // General error handling
    console.error('Session creation error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS if needed
export async function OPTIONS(req: Request) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  )
}





// // Get environment variables
// const SESSION_EXPIRY_DAYS = parseInt(process.env.SESSION_EXPIRY_DAYS || '5');
// const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'session';
// const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';
// const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || 'lax';
// const COOKIE_PATH = process.env.COOKIE_PATH || '/';

// export async function POST(req: Request) {
//   try {
//     const { idToken } = await req.json();

//     // Create a session cookie
//     const expiresIn = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 5 days
//     const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

//     (await cookies()).set(SESSION_COOKIE_NAME, sessionCookie, {
//       maxAge: expiresIn / 1000, // Convert to seconds
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax" as "lax" | "strict" | "none", // Prevent CSRF attacks
//       path: "/",
//     })


//     console.log({
//       idToken,
//       expiresIn,
//       sessionCookie,
//       SESSION_COOKIE_NAME,
//       COOKIE_SECURE,
//       COOKIE_SAME_SITE,
//       COOKIE_PATH,
//     })

//     return NextResponse.json({ status: "success" });
//   } catch (error) {
//     console.error("Error creating session cookie:", error);
//     return NextResponse.json({ status: "error" }, { status: 500 });
//   }
// }