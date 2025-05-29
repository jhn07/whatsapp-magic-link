"use client";

import { logout } from "@/app/actions/logout";
import { Button } from "./ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useTransition } from "react";

interface SignOutProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  children?: React.ReactNode;
}

export const SignOut = ({
  variant = "outline",
  className = "",
}: SignOutProps) => {

  const [isPending, startTransition] = useTransition();

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      e.currentTarget.submit();
    });
  }

  return (
    <form action={logout} onSubmit={handleSignOut}>
      <Button
        type="submit"
        variant={variant}
        className={className}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing out...
          </>
        ) : (
          <>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </>
        )}
      </Button>
    </form>
  );
};
