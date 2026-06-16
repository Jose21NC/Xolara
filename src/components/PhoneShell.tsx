import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, Battery, ShieldAlert, MonitorCheck, Sparkles } from 'lucide-react';

interface PhoneShellProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function PhoneShell({ children, activeTab }: PhoneShellProps) {
  const [time, setTime] = useState('11:30 AM');
  const [showBezel, setShowBezel] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#ecd9c6] bg-opacity-30 flex flex-col items-center justify-start py-4 px-2 md:py-8 font-sans transition-colors relative overflow-x-hidden antialiased">
      {/* Absolute background patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#a03f28" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Top Banner & Control Board */}
      <div className="w-full max-w-lg mb-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-brand-primary/10 z-10 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-primary/10 text-brand-primary rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-brand-primary leading-none">Xolara Studio</h1>
            <p className="text-xs text-brand-text-muted mt-0.5">Android Experience Simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBezel(!showBezel)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              showBezel
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-brand-surface-low text-brand-text-muted border border-brand-primary/10 hover:bg-brand-primary/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{showBezel ? 'Ocultar Marco Móvil' : 'Ver Marco Móvil'}</span>
          </button>
        </div>
      </div>

      {/* Phone container */}
      <div className="relative transition-all duration-300 z-10">
        {showBezel ? (
          /* Phone Bezel Frame */
          <div className="relative mx-auto w-[380px] h-[812px] bg-neutral-900 rounded-[50px] p-3 shadow-2xl border-4 border-neutral-800 flex flex-col ring-12 ring-neutral-950/80">
            {/* Top Ear Piece Speaker & Camera Hole Notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-950 rounded-b-2xl z-50 flex items-center justify-center gap-4">
              <div className="w-12 h-1 bg-neutral-800 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-radial from-neutral-900 to-neutral-800 rounded-full border border-neutral-700"></div>
            </div>

            {/* Left Button Slits */}
            <div className="absolute -left-1 w-1 h-12 top-28 bg-neutral-700 rounded-r-md"></div>
            <div className="absolute -left-1 w-1 h-10 top-44 bg-neutral-700 rounded-r-md"></div>
            <div className="absolute -left-1 w-1 h-10 top-56 bg-neutral-700 rounded-r-md"></div>
            
            {/* Right Button Slit */}
            <div className="absolute -right-1 w-1 h-16 top-36 bg-neutral-700 rounded-l-md"></div>

            {/* Android Screen Area */}
            <div className="relative w-full h-full bg-[#fcf9f3] rounded-[38px] overflow-hidden flex flex-col select-none">
              
              {/* Android Custom Status Bar */}
              <div className="h-10 bg-brand-bg md:bg-transparent px-6 pt-2 flex justify-between items-center text-brand-text-dark text-xs font-medium z-40">
                <span>{time}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-brand-secondary/10 px-1 py-0.5 rounded text-brand-secondary tracking-wide uppercase font-bold font-mono">LTE</span>
                  <Wifi className="w-3.5 h-3.5 text-brand-text-dark" strokeWidth={2.5} />
                  <Battery className="w-4 h-4 text-brand-text-dark" strokeWidth={2.5} />
                </div>
              </div>

              {/* Sub-application Screens Display */}
              <div className="flex-1 w-full relative overflow-y-auto overflow-x-hidden hide-scrollbar bg-[#fcf9f3]">
                {children}
              </div>

              {/* Bottom Android Gesture Pill Bar */}
              <div className="h-6 pb-2 w-full flex items-center justify-center z-40 bg-[#f9f6f0]/80 backdrop-blur-md">
                <div className="w-28 h-1 bg-brand-text-dark/40 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Frameless Full Aspect */
          <div className="relative w-full max-w-md h-[780px] bg-[#fcf9f3] rounded-3xl overflow-hidden shadow-xl border border-brand-primary/10 flex flex-col">
            {/* Status bar */}
            <div className="h-8 px-6 pt-2 flex justify-between items-center text-brand-text-dark text-xs font-medium z-40">
              <span>{time}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-brand-secondary/10 px-1 py-0.5 rounded text-brand-secondary font-bold font-mono">LTE</span>
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 relative overflow-y-auto hide-scrollbar bg-[#fcf9f3]">
              {children}
            </div>

            {/* System navigation line */}
            <div className="h-4 pb-1.5 flex justify-center items-center bg-[#f9f6f0]">
              <div className="w-24 h-1 bg-brand-text-dark/20 rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center max-w-md px-4">
        <p className="text-xs text-brand-text-muted leading-relaxed">
          Diseño moderno y artesanal. Toca las tarjetas, selecciona fechas, añade personas para simular un flujo de reserva real de punta a punta.
        </p>
      </div>
    </div>
  );
}
