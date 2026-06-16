import React from 'react';

interface PhoneShellProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div className="min-h-screen bg-[#fcf9f3] text-brand-text-dark flex flex-col items-center justify-start antialiased w-full">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#fcf9f3] relative overflow-x-hidden shadow-2xl border-x border-brand-primary/10">
        {children}
      </div>
    </div>
  );
}
