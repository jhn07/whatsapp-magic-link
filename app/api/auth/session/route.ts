


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

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { idToken } = await req.json();
    if (!idToken) throw new Error("ID token is required");

    const config = getSessionConfig();
    const expiresIn = config.expiryDays * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    console.log("Creating session cookie", {
      name: config.cookieName,
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: config.secure,
      sameSite: config.sameSite,
      path: config.path,
    })

    const response = NextResponse.json(
      { status: 'success' },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    );

    response.cookies.set({
      name: config.cookieName,
      value: sessionCookie,
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: config.secure,
      sameSite: config.sameSite,
      path: config.path,
    });

    const cookies = response.cookies.getAll();
    console.log("Cookies set in response:", cookies.map((c) => ({
      name: c.name,
      value: c.value ? `${c.value.substring(0, 10)}...` : null,
      options: {
        ...c,
      }
    })));

    if (process.env.NODE_ENV === 'development') {
      console.log('Session cookie set:', {
        name: config.cookieName,
        path: config.path,
        secure: config.secure,
        sameSite: config.sameSite
      });
    }

    return response;

  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Internal error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    }
  );
}




// import { adminAuth } from "@/lib/firebase-admin";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// interface SessionConfig {
//   expiryDays: number;
//   cookieName: string;
//   secure: boolean;
//   sameSite: 'lax' | 'strict' | 'none';
//   path: string;
// }

// // Validation and retrieval of configuration
// const getSessionConfig = (): SessionConfig => {
//   const expiryDays = parseInt(process.env.SESSION_EXPIRY_DAYS || '5', 10);

//   if (isNaN(expiryDays) || expiryDays <= 0) {
//     throw new Error("SESSION_EXPIRY_DAYS must be a positive number");
//   }

//   return {
//     expiryDays,
//     cookieName: process.env.SESSION_COOKIE_NAME || 'session',
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: (process.env.COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none',
//     path: process.env.COOKIE_PATH || '/',
//   };
// };

// interface SessionRequest {
//   idToken: string;
// }

// interface SessionResponse {
//   status: 'success' | 'error';
//   message?: string;
// }


// export async function POST(req: Request): Promise<NextResponse<SessionResponse>> {
//   try {

//     const { idToken } = await req.json() as SessionRequest;

//     if (!idToken) {
//       return NextResponse.json({
//         status: "error",
//         message: "ID token is required"
//       }, { status: 400 });
//     }

//     const config = getSessionConfig();

//     // Create and configure session cookie
//     const expiresIn = config.expiryDays * 24 * 60 * 60 * 1000;

//     try {
//       const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

//       const cookieStore = await cookies();

//       cookieStore.set(config.cookieName, sessionCookie, {
//         maxAge: expiresIn / 1000,
//         httpOnly: true,
//         secure: config.secure,
//         sameSite: config.sameSite,
//         path: config.path,
//       });

//       // Logging only in development mode
//       if (process.env.NODE_ENV === 'development') {
//         console.log('Session created successfully', {
//           cookieName: config.cookieName,
//           secure: config.secure,
//           sameSite: config.sameSite,
//           path: config.path,
//           expiresIn: `${config.expiryDays} days`,
//         })
//       }

//       return NextResponse.json({ status: 'success' });
//     } catch (error) {
//       // Firebase error handling
//       console.log("Firebase session creation error: ", error);
//       return NextResponse.json({
//         status: 'error',
//         message: 'Invalid or expired ID token'
//       }, { status: 401 });

//     }
//   } catch (error) {
//     // General error handling
//     console.error('Session creation error:', error);
//     return NextResponse.json(
//       {
//         status: 'error',
//         message: 'Internal server error'
//       },
//       { status: 500 }
//     );
//   }
// }

// // Add OPTIONS handler for CORS if needed
// export async function OPTIONS(req: Request) {
//   return NextResponse.json(
//     {},
//     {
//       headers: {
//         'Access-Control-Allow-Methods': 'POST',
//         'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//       }
//     }
//   )
// }

