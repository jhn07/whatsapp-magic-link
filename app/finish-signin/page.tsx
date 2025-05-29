"use client";

import Link from "next/link";
import { SpaceBackground } from "@/components/space-background";
import { CheckCircle, Loader2, Mail, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinishSignin } from '@/hooks/useFinishSignin';
import { Suspense } from "react";

function FinishSignInContent() {
  const { status, message } = useFinishSignin();

  const renderContent = () => {
    switch (status) {
      case "pending":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Checking your access</h2>
            <p className="text-blue-200 text-lg">
              Processing your magic link...
            </p>
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Welcome back!</h2>
            <p className="text-green-200 text-lg mb-6">
              {message}
            </p>
            <div className="w-full bg-green-200 rounded-full h-2 mb-4">
              <div className="bg-green-600 h-2 rounded-full animate-[loading_2s_ease-in-out] w-full"></div>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-red-200 text-lg mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer border-0"
                asChild
              >
                <Link href="/" className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Try again
                </Link>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <SpaceBackground />

      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {renderContent()}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Secure authentication • Future ready • Instant access
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FinishSignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-indigo-900">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    }>
      <FinishSignInContent />
    </Suspense>
  )
}
