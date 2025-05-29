"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, Calendar } from 'lucide-react';
import { useMagicLink } from '@/hooks/useMagicLink';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';

export const MagicLinkForm = () => {

  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('from') || '/dashboard';


  const [email, setEmail] = useState<string>('');
  const { user, loading: authLoading } = useAuth({ redirectIfAuthenticated: true });

  const { sendMagicLink, loading, success, error, reset } = useMagicLink({
    redirectUrl: typeof window !== 'undefined'
      ? `${window.location.origin}/finish-signin?redirect=${encodeURIComponent(redirectPath)}`
      : "",
    onSuccess: () => {
      console.log('Magic link sent successfully');
    },
    onError: (error) => {
      console.error('Error sending magic link:', error);
    }
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMagicLink(email)
  };

  if (authLoading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="mt-4 text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    )
  }

  if (success) {
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
            reset();
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
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          disabled={!email || loading}
        >
          {loading ? (
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

