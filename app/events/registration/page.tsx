'use client';

import { useState } from 'react';

export default function RegistrationPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="relative w-full min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Event Registration
          </h1>
          <p className="text-muted-foreground mt-2">
            Fill the form below to secure your spot.
          </p>
        </header>

        <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
          {!loaded && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="animate-pulse flex space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          )}

          <iframe
            className="airtable-embed relative z-10 w-full min-h-[900px]"
            src="https://airtable.com/embed/appzd95k47AOWSMIp/pagsGVUKkXTMBWRaP/form"
            frameBorder="0"
            onLoad={() => setLoaded(true)}
            style={{ background: 'transparent' }}
            title="Event registration form"
          />
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Having trouble with the form?{' '}
          <a
            href="https://airtable.com/appzd95k47AOWSMIp/pagsGVUKkXTMBWRaP/form"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Open in a new tab
          </a>
        </p>
      </div>
    </section>
  );
}
