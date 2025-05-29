import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailLink } from 'firebase/auth';
import { useRouter } from "next/navigation";

interface UseFinishSigninOptions {
  redirectTo?: string;
  shouldRemoveEmail?: boolean;
}

export const useFinishSignin = (options: UseFinishSigninOptions = {}) => {
  const [status, setStatus] = useState<"pending" | "success" | "error">('pending');
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const {
    redirectTo = '/dashboard',
    shouldRemoveEmail = true
  } = options;

  useEffect(() => {
    const processSignIn = async () => {
      const email = window.localStorage.getItem("emailForSignIn");

      if (!email) {
        setStatus("error");
        setMessage("No email found. Please try again.");
        return;
      }

      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        const idToken = await result.user.getIdToken();
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (!res.ok) throw new Error("Failed to create session");
        setStatus("success");
        setMessage("You are successfully logged in!");

        if (shouldRemoveEmail) {
          window.localStorage.removeItem("emailForSignIn");
        }

        router.push(redirectTo);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Failed to sign in. Please try again.");
      }
    }

    processSignIn();
  }, [redirectTo, shouldRemoveEmail, router]);

  return { status, message };
}