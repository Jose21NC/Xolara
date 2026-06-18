import React from 'react';

interface PhoneShellProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-dark flex flex-col items-center justify-start antialiased w-full">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-brand-bg relative shadow-ios-lg border-x border-black/5 overflow-hidden">
        {/* Ambient depth layer - gives glass surfaces something to refract */}
        <div className="ambient-bg" aria-hidden="true" />

        {/* App content sits above the ambient layer */}
        <div className="relative z-10 flex flex-col flex-1 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
