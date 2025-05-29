"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, Calendar } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export const MagicLinkForm = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const router = useRouter()


  useEffect(() => {
    const unsubscrine = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard')
      } else {
        setIsChecking(false)
      }
    })

    // cleanup function
    return () => unsubscrine()
  }, [])

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const actionCodeSettings = {
    url: `${origin}/finish-signin`,
    handleCodeInApp: true,
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setIsEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="mt-4 text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    )
  }

  if (isEmailSent) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-600">
            We've sent your appointment access link to <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <Button
          onClick={() => {
            setIsEmailSent(false);
            setEmail('');
          }}
          variant="outline"
          className="w-full"
        >
          Send another link
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Future</h1>
        <p className="text-gray-600">Enter your email to access appointment booking</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          disabled={!email || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending access link...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Get appointment access
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          New to our platform?{' '}
          <a href="#" className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
            Learn more
          </a>
        </p>
      </div>

      <div className="mt-8 flex justify-center space-x-6 opacity-60">
        <span className="text-xs text-gray-500">Instant access</span>
        <span className="text-xs text-gray-500">•</span>
        <span className="text-xs text-gray-500">No password required</span>
        <span className="text-xs text-gray-500">•</span>
        <span className="text-xs text-gray-500">Future ready</span>
      </div>
    </div>
  );
};

