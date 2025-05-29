
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";

interface UseMagicLinkOptions {
  redirectUrl?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useMagicLink = (options: UseMagicLinkOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    redirectUrl = typeof window !== "undefined" ? `${window.location.href}/finish-signin` : "",
    onSuccess,
    onError
  } = options;

  const actionCodeSettings = {
    url: redirectUrl,
    handleCodeInApp: true,
  }

  const sendMagicLink = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send magic link. Please try again.";
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const reset = () => {
    setLoading(false);
    setError(null);
  }

  return {
    sendMagicLink,
    loading,
    success,
    error,
    reset,
  }
}