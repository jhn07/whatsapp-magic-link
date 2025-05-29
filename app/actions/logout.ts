"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Type configuration for cookie
interface CookieConfig {
  name: string;
  path: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
}

// Get cookie configuration
const getCookieConfig = (): CookieConfig => ({
  name: process.env.SESSION_COOKIE_NAME || "session",
  path: process.env.COOKIE_PATH || "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.COOKIE_SAME_SITE || "lax") as 'lax' | 'strict' | 'none',
});

/**
 * Server action for logout
 * @throws {Error} If there is an error deleting the cookie
 */

export async function logout() {
  const cookieStore = await cookies();
  const config = getCookieConfig();

  // Delete cookie
  await cookieStore.delete(config)

  if (process.env.NODE_ENV === "development") {
    console.log('Session cookie deleted successfully', {
      cookieName: config.name,
      path: config.path,
    });
  }

  redirect('/');
}