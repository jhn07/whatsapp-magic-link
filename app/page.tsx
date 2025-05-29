import React, { Suspense } from 'react';
import { SpaceBackground } from '@/components/space-background';
import { MagicLinkForm } from '@/components/magic-link-form';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* For mobile: vertical layout, for desktop: horizontal layout */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Space background - full size on desktop */}
        <div className="hidden md:block md:flex-1 relative">
          <SpaceBackground />

          {/* Title on the space background */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-light leading-tight mb-4">
                Book Your Future
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">
                  Appointment
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 font-light">
                Schedule beyond the stars • Instant access • No waiting
              </p>
            </div>
          </div>
        </div>

        {/* Заголовок только для мобильных */}
        <div className="block md:hidden bg-gradient-to-b from-indigo-900 to-blue-800 p-6 text-center text-white">
          <h1 className="text-3xl font-light mb-2">
            Book Your
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">
              {" "}Appointment
            </span>
          </h1>
          <p className="text-sm text-gray-300">
            Instant access • No waiting
          </p>
        </div>

        {/* Form Magic Link - выровнен по центру на десктопе */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-50">
          <Suspense fallback={<div>Loading...</div>}>
            <MagicLinkForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};