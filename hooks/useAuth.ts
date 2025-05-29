
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

interface UseAuthOptions {
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { redirectIfAuthenticated = true, redirectTo = "/dashboard" } = options;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setLoading(false);

        if (redirectIfAuthenticated && authUser) {
          router.push(redirectTo);
        }
      }
    })

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [redirectIfAuthenticated, redirectTo, router]);

  return { user, loading };
}