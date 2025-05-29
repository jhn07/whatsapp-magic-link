import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailLink } from 'firebase/auth';
import { useRouter, useSearchParams } from "next/navigation";

interface UseFinishSigninOptions {
  redirectTo?: string;
  shouldRemoveEmail?: boolean;
}

export const useFinishSignin = (options: UseFinishSigninOptions = {}) => {
  const [status, setStatus] = useState<"pending" | "success" | "error">('pending');
  const [message, setMessage] = useState<string>("");
  const searchParams = useSearchParams();

  const redirectTo = searchParams?.get("redirect") || "/dashboard"

  const {
    shouldRemoveEmail = true
  } = options;

  useEffect(() => {
    const processSignIn = async () => {
      try {
        console.log("Processing sign in, redirect to: ", redirectTo);
        // Add delay to ensure redirect works on mobile devices
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const email = window.localStorage.getItem("emailForSignIn");

        if (!email) {
          setStatus("error");
          setMessage("No email found. Please try again.");
          return;
        }

        const result = await signInWithEmailLink(auth, email, window.location.href);
        const idToken = await result.user.getIdToken();

        console.log("Successfully authenticated with Firebase");

        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
          credentials: "include", // Include cookies in the request
        });

        // Log response headers
        console.log("Response status:", res.status);
        console.log("Response headers:", {
          'set-cookie': res.headers.get('set-cookie'),
          'content-type': res.headers.get('content-type')
        });

        const data = await res.json();
        console.log("Response data:", data);

        if (!res.ok) throw new Error("Failed to create session");

        console.log("Session created successfully");


        setStatus("success");
        setMessage("You are successfully logged in!");

        if (shouldRemoveEmail) {
          window.localStorage.removeItem("emailForSignIn");
        }

        // Log cookies before redirect
        console.log("Document cookies before redirect:", document.cookie);


        await delay(1500);

        // Use window.location.href instead of router.push to ensure it works on mobile devices
        window.location.href = redirectTo;
      } catch (err: any) {
        console.error("Error in processSignIn:", err);
        setStatus("error");
        setMessage(err.message || "Failed to sign in. Please try again.");
      }
    }

    processSignIn();
  }, [redirectTo, shouldRemoveEmail]);

  return { status, message };
}