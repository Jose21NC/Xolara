import React, { useState, useRef } from 'react';
import { 
  Award, Fingerprint, Calendar, ArrowRight, ArrowLeft, CheckCircle2, Sliders 
} from 'lucide-react';
import { Booking, AppConfig } from '../types';
import CulturalTipsPopup from '../components/CulturalTipsPopup';

interface PassportScreenProps {
  bookings: Booking[];
  config: AppConfig;
  onOpenConfig: () => void;
}

// Inline custom CSS for paper textures, realistic distressed stamps, and cohesive 3D book curl
const passportStyles = `
  @keyframes page-turn-next {
    0% {
      transform: rotateY(0deg) scale(1);
      filter: brightness(1);
    }
    45% {
      transform: rotateY(-90deg) scale(0.93) skewY(-2.5deg);
      filter: brightness(0.7);
    }
    55% {
      transform: rotateY(90deg) scale(0.93) skewY(2.5deg);
      filter: brightness(0.7);
    }
    100% {
      transform: rotateY(0deg) scale(1);
      filter: brightness(1);
    }
  }

  @keyframes page-turn-prev {
    0% {
      transform: rotateY(0deg) scale(1);
      filter: brightness(1);
    }
    45% {
      transform: rotateY(90deg) scale(0.93) skewY(2.5deg);
      filter: brightness(0.7);
    }
    55% {
      transform: rotateY(-90deg) scale(0.93) skewY(-2.5deg);
      filter: brightness(0.7);
    }
    100% {
      transform: rotateY(0deg) scale(1);
      filter: brightness(1);
    }
  }

  @keyframes shadow-sweep {
    0% { transform: translateX(100%); opacity: 0; }
    50% { transform: translateX(0%); opacity: 0.25; }
    100% { transform: translateX(-100%); opacity: 0; }
  }

  .animate-page-turn-next {
    transform-origin: left center;
    animation: page-turn-next 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .animate-page-turn-prev {
    transform-origin: left center;
    animation: page-turn-prev 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .animate-shadow-sweep {
    animation: shadow-sweep 0.55s ease-in-out forwards;
  }

  /* Fine linen security paper and grid watermarks */
  .passport-paper {
    background-color: #fcf9f2;
    background-image: 
      radial-gradient(#ebdcb9 1px, transparent 1px), 
      radial-gradient(#ebdcb9 1px, #fcf9f2 1px);
    background-size: 10px 10px;
    background-position: 0 0, 5px 5px;
    box-shadow: inset 0 0 45px rgba(140, 110, 80, 0.12), 3px 0 10px rgba(0,0,0,0.04);
  }

  .font-stamp {
    font-family: 'Courier New', Courier, monospace;
    font-weight: 900;
  }

  .distressed-stamp {
    filter: url(#distressed-ink);
  }
`;

// SVG turbulence filter which deforms vector borders and makes them grainy/bleeded like true rubber ink stamps on cotton paper
const StampFilter = () => (
  <svg className="absolute w-0 h-0 pointer-events-none" style={{ position: 'absolute' }}>
    <defs>
      <filter id="distressed-ink">
        <feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feBlend mode="multiply" in="SourceGraphic" in2="noise" result="blend" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0" />
      </filter>
    </defs>
  </svg>
);

// Guilloché pattern generator used in state backgrounds to certify original documents
const SecurityPattern = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.06] select-none overflow-hidden mix-blend-multiply">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="guilloche" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0,10 Q10,20 20,10 T40,10" fill="none" stroke="#a03f28" strokeWidth="0.6" />
          <path d="M0,20 Q10,30 20,20 T40,20" fill="none" stroke="#3a674f" strokeWidth="0.6" />
          <path d="M0,30 Q10,40 20,30 T40,30" fill="none" stroke="#805600" strokeWidth="0.6" />
          <path d="M0,40 Q10,50 20,40 T40,40" fill="none" stroke="#a03f28" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#guilloche)" />
    </svg>
  </div>
);

// High-fidelity vector layout stamp simulating rubber stamp textures and ink pressures
const RealisticStamp = ({
  id,
  title,
  category,
  date,
  color,
  isDynamic,
  rotate = 0,
  onClick
}: {
  id: string;
  title: string;
  category: string;
  date: string;
  color: string;
  isDynamic?: boolean;
  rotate?: number;
  onClick: () => void;
  key?: string | number;
}) => {
  const isMombacho = id === 'p1';
  const isGranada = id === 'p2';
  const isCeramica = id === 'p3';
  const isMasaya = id === 'p4';

  return (
    <div 
      onClick={onClick}
      className={`relative p-2.5 rounded-2xl flex flex-col items-center justify-center text-center select-none transition-all hover:scale-[1.06] active:scale-95 cursor-pointer`}
      style={{ 
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div 
        className="distressed-stamp flex flex-col items-center justify-center font-stamp relative group"
        style={{ color }}
      >
        {/* Render beautiful bespoke high-contrast passport stamp geometries based on item */}
        {isMombacho && (
          <div className="w-20 h-20 relative flex flex-col items-center justify-center">
            {/* Concentric Double Circle layout with arched texts */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="46" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="41" strokeWidth="0.7" strokeDasharray="3 2" />
              <circle cx="50" cy="50" r="28" strokeWidth="1" />
              <path id="mombacho-text-top" d="m 16 50 a 34 34 0 0 1 68 0" fill="none" stroke="none" />
              <path id="mombacho-text-bot" d="m 84 50 a 34 34 0 0 1 -68 0" fill="none" stroke="none" />
              <text fontSize="7.5" fontWeight="950" fill="currentColor" letterSpacing="0.08em" className="uppercase font-mono">
                <textPath href="#mombacho-text-top" startOffset="50%" textAnchor="middle">Nicaragua</textPath>
              </text>
              <text fontSize="5.5" fontWeight="950" fill="currentColor" letterSpacing="0.05em" className="uppercase font-mono">
                <textPath href="#mombacho-text-bot" startOffset="50%" textAnchor="middle">★ ECO-RESERVA ★</textPath>
              </text>
            </svg>
            <div className="z-10 flex flex-col items-center mt-1">
              <span className="text-xl leading-none">🌋</span>
              <span className="text-[5.5px] font-black tracking-widest mt-0.5 leading-none">MOMBACHO</span>
              <span className="text-[7.5px] font-black mt-1 bg-white/40 px-1 leading-none">{date}</span>
            </div>
          </div>
        )}

        {isGranada && (
          <div className="w-20 h-20 relative flex flex-col items-center justify-center">
            {/* Arched custom postal stamp outline */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <path d="M 10 12 Q 50 20 90 12 L 90 88 Q 50 80 10 88 Z" strokeWidth="2.2" />
              <path d="M 14 16 L 14 84 M 86 16 L 86 84" strokeWidth="0.8" strokeDasharray="2.5 2.5" />
              <line x1="14" y1="31" x2="86" y2="31" strokeWidth="1" />
              <line x1="14" y1="69" x2="86" y2="69" strokeWidth="1" />
            </svg>
            <div className="z-10 flex flex-col items-center px-1 justify-center mt-0.5">
              <span className="text-[6px] font-extrabold uppercase tracking-widest leading-none">GRANADA</span>
              <span className="text-lg my-1">🍽️</span>
              <span className="text-[8px] font-black uppercase tracking-widest leading-none bg-white/50 px-1">{date}</span>
              <span className="text-[5px] font-bold mt-1 text-center truncate leading-none uppercase">SABORES REGIONALES</span>
            </div>
          </div>
        )}

        {isCeramica && (
          <div className="w-20 h-20 relative flex flex-col items-center justify-center">
            {/* Beautiful octagonal design */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <polygon points="30,8 70,8 92,30 92,70 70,92 30,92 8,70 8,30" strokeWidth="2.2" />
              <polygon points="32,12 68,12 88,32 88,68 68,88 32,88 12,68 12,32" strokeWidth="0.8" strokeDasharray="2 2" />
            </svg>
            <div className="z-10 flex flex-col items-center justify-center text-center px-1">
              <span className="text-[5px] font-extrabold uppercase tracking-widest leading-none">ALFARERO</span>
              <span className="text-xl my-0.5">🎨</span>
              <span className="text-[8.5px] font-black tracking-tight leading-none px-1 bg-white/60 mb-0.5">{date}</span>
              <span className="text-[4.5px] font-bold uppercase leading-none">CHOROTEGA</span>
            </div>
          </div>
        )}

        {isMasaya && (
          <div className="w-20 h-20 relative flex flex-col items-center justify-center">
            {/* Rounded double border rectangular stamp with stars */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <rect x="8" y="10" width="84" height="80" rx="14" strokeWidth="2.2" />
              <rect x="12" y="14" width="76" height="72" rx="10" strokeWidth="0.8" strokeDasharray="4 2" />
              <text x="18" y="24" fontSize="6">★</text>
              <text x="82" y="24" fontSize="6" textAnchor="end">★</text>
              <text x="18" y="82" fontSize="6">★</text>
              <text x="82" y="82" fontSize="6" textAnchor="end">★</text>
            </svg>
            <div className="z-10 flex flex-col items-center justify-center px-2">
              <span className="text-[5.5px] font-black uppercase tracking-widest leading-none">PARQUE NACIONAL</span>
              <span className="text-lg my-0.5">🌋</span>
              <span className="text-[8px] font-black uppercase tracking-widest leading-none bg-white/60 px-1 py-0.5 my-0.5">MASAYA</span>
              <span className="text-[6.5px] font-bold uppercase leading-none">{date}</span>
            </div>
          </div>
        )}

        {/* Dynamic / Live booking stamp (violet official postal overlay) */}
        {!isMombacho && !isGranada && !isCeramica && !isMasaya && (
          <div className="w-20 h-20 relative flex flex-col items-center justify-center">
            {/* Elegant oval custom cartouche with star outlines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <ellipse cx="50" cy="50" rx="47" ry="35" strokeWidth="2.4" />
              <ellipse cx="50" cy="50" rx="42" ry="30" strokeWidth="0.8" strokeDasharray="3 2" />
              <path id="live-text-top" d="m 10 50 a 40 24 0 0 1 80 0" fill="none" stroke="none" />
              <path id="live-text-bot" d="m 90 50 a 40 24 0 0 1 -80 0" fill="none" stroke="none" />
              <text fontSize="5.5" fontWeight="950" fill="currentColor" letterSpacing="0.12em" className="uppercase font-mono">
                <textPath href="#live-text-top" startOffset="50%" textAnchor="middle">TURISMO ECO</textPath>
              </text>
              <text fontSize="5" fontWeight="950" fill="currentColor" letterSpacing="0.08em" className="uppercase font-mono">
                <textPath href="#live-text-bot" startOffset="50%" textAnchor="middle">★ SOBERANO NICA ★</textPath>
              </text>
            </svg>
            <div className="z-10 flex flex-col items-center justify-center px-1">
              <span className="text-base leading-none">☕</span>
              <span className="text-[5.5px] font-black uppercase text-center tracking-tight leading-none max-w-[55px] truncate mt-0.5 bg-white/30 px-0.5">
                {title.split(' en ')[0].split(' de ')[0]}
              </span>
              <span className="text-[7.5px] font-black uppercase bg-white/60 px-1.5 py-0.5 rounded border border-dashed border-current mt-1 leading-none">{date}</span>
            </div>
          </div>
        )}
      </div>
      {/* Visual textured subtitle label */}
      <span className="text-[8.5px] font-black text-brand-text-dark mt-3 leading-tight truncate w-full group-hover:text-brand-primary">{title}</span>
    </div>
  );
};

export default function PassportScreen({ bookings, config, onOpenConfig }: PassportScreenProps) {
  const [selectedStamp, setSelectedStamp] = useState<any | null>(null);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  
  // Single Pages: 0: Cover, 1: ID Bio, 2: Nature, 3: Culture, 4: Live Bookings, 5: Impact Ledger
  const [bookPage, setBookPage] = useState<number>(0);
  const [tiltAmount, setTiltAmount] = useState<{ x: number; y: number }>({ x: -4, y: 8 });
  
  // Gesture states
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | 'none'>('none');
  const bookRef = useRef<HTMLDivElement>(null);

  // Dynamic stamps mapped from bookings
  const dynamicStamps = bookings.map(b => ({
    id: `dynamic-${b.id}`,
    title: b.experienceTitle,
    category: 'Sello de Sesión',
    date: b.date.split(',')[0] || 'Junio 2026',
    iconType: 'coffee',
    color: '#4a154b', // Custom intense purple ink
    isDynamic: true,
    desc: `Este sello oficial nicaragüense certifica tu participación directa en "${b.experienceTitle}". Tu inversión de $${b.totalPrice} USD financió directamente salarios de artesanos locales y microproyectos de mitigación ambiental en la comunidad.`
  }));

  const allStamps = [
    {
      id: 'p1',
      title: 'Volcán Mombacho',
      category: 'Conservación',
      date: 'Mayo 2026',
      iconType: 'mountain',
      color: '#214e34', // Forest dry ink
      isDynamic: false,
      desc: 'Sello ecológico de senderismo certificado de la reserva biológica nebliselva del Volcán Mombacho. Tus aportes financiaron el mantenimiento de viveros de orquídeas nativas y salarios de guardaparques rurales.'
    },
    {
      id: 'p2',
      title: 'Plato Tradicional Granada',
      category: 'Gastronómico',
      date: 'Abril 2026',
      iconType: 'utensils',
      color: '#7b4c06', // Burnt ochre ink
      isDynamic: false,
      desc: 'Sello del rescate culinario nicaragüense. Certifica el taller tradicional de Vigorón y batido de Cacao orgánico molido en piedra con la familia de Doña Auxiliadora en su patio granadino.'
    },
    {
      id: 'p3',
      title: 'Cerámica Ancestral',
      category: 'Patrimonial',
      date: 'Marzo 2026',
      iconType: 'palette',
      color: '#922718', // Terra reddish ink
      isDynamic: false,
      desc: 'Sello de preservación indígena chorotega. Otorgado por modelar barro autóctono pulido a mano con piedras de río en los históricos hornos de leña en San Juan de Oriente.'
    },
    ...dynamicStamps
  ];

  const totalStamps = allStamps.length;
  const milestonePercent = Math.min(100, Math.round((totalStamps / 8) * 100));

  // Turn page logic syncing component update at peak 3D perpendicular angle
  const triggerNextPage = () => {
    if (bookPage < 5 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setBookPage(prev => prev + 1);
      }, 260); // Exact visual peak of rotating page
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection('none');
      }, 550);
    }
  };

  const triggerPrevPage = () => {
    if (bookPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setBookPage(prev => prev - 1);
      }, 260);
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection('none');
      }, 550);
    }
  };

  // Draggestures across mobile / desktops
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isFlipping) return;
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null || isFlipping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - dragStartX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (dragStartX === null || isFlipping) return;
    const threshold = 60;
    if (dragOffset > threshold) {
      triggerPrevPage();
    } else if (dragOffset < -threshold) {
      triggerNextPage();
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFlipping) return;
    setDragStartX(e.clientX);
  };

  const handleMouseMoveCombined = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltAmount({
      x: -y / 15,
      y: x / 15
    });

    if (dragStartX === null || isFlipping) return;
    const currentX = e.clientX;
    const diff = currentX - dragStartX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (dragStartX === null || isFlipping) return;
    const threshold = 60;
    if (dragOffset > threshold) {
      triggerPrevPage();
    } else if (dragOffset < -threshold) {
      triggerNextPage();
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  const resetTilt = () => {
    setTiltAmount({ x: -4, y: 8 });
  };

  const handleMouseLeaveCombined = () => {
    handleMouseUp();
    resetTilt();
  };

  return (
    <div className="flex flex-col gap-5 pb-24 font-sans select-none overflow-x-hidden bg-[#fcf9f3] min-h-screen">
      
      {/* Inject custom inline styles for physical transitions & gritty elements */}
      <style dangerouslySetInnerHTML={{ __html: passportStyles }} />

      {/* SVG Distress Filters */}
      <StampFilter />

      {/* Immersive Passport Header */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-brand-primary animate-pulse" />
            <h2 className="font-serif text-2xl font-black text-brand-primary">Tu Pasaporte Autónomo</h2>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={onOpenConfig}
              className="p-1.5 bg-white border border-brand-primary/10 rounded-full hover:bg-neutral-50 active:scale-90 transition-all text-brand-primary cursor-pointer"
              title="Configuración de Preferencias"
            >
              <Sliders className="w-3.5 h-3.5" strokeWidth={2.4} />
            </button>
            <span className="text-[9px] font-black text-brand-secondary bg-brand-secondary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Socio Sostenible
            </span>
          </div>
        </div>
        <p className="text-xs text-brand-text-muted leading-relaxed font-bold">
          Desliza horizontalmente la libreta o presiona las flechas para abrir sus páginas y certificar tus sellos de impacto real.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3D BOOK ENGINE BOX - HERO EN EL CENTRO DE LA PANTALLA */}
      {/* ========================================================================= */}
      <div className="my-3 flex items-center justify-center relative touch-none">
        
        {/* Subtle spine binding rings shadow on underlying canvas */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-[300px] bg-black/5 blur-md rounded-full pointer-events-none" />

        {/* The leather background portfolio representation framing the notebook */}
        <div className="absolute w-[334px] sm:w-[354px] h-[466px] bg-gradient-to-br from-[#4e150b] to-[#1e0704] rounded-[24px] pointer-events-none shadow-2xl z-0 transition-transform duration-200"
          style={{
            transform: `rotateX(${tiltAmount.x}deg) rotateY(${tiltAmount.y + (dragOffset / 5)}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Copper hardware binder rings looking stitched */}
          <div className="absolute left-1 top-0 bottom-0 w-3 bg-neutral-900/30 rounded-l-3xl border-r border-[#691f11]/15" />
          
          {/* Metallic golden corner protections for high luxury feeling */}
          <div className="absolute top-0 right-0 w-7 h-7 border-t-[3.5px] border-r-[3.5px] border-amber-400/30 rounded-tr-[24px]" />
          <div className="absolute bottom-0 right-0 w-7 h-7 border-b-[3.5px] border-r-[3.5px] border-amber-400/30 rounded-br-[24px]" />
          <div className="absolute top-0 left-0 w-7 h-7 border-t-[3.5px] border-l-[3.5px] border-amber-400/30 rounded-tl-[24px]" />
          <div className="absolute bottom-0 left-0 w-7 h-7 border-b-[3.5px] border-l-[3.5px] border-amber-400/30 rounded-bl-[24px]" />
        </div>

        {/* Outer Perspective frame */}
        <div 
          ref={bookRef}
          className="relative w-[320px] sm:w-[340px] h-[450px] transition-transform duration-200 cursor-grab active:cursor-grabbing origin-center z-10"
          style={{
            perspective: '1400px',
            transform: `rotateX(${tiltAmount.x}deg) rotateY(${tiltAmount.y + (dragOffset / 5)}deg)`,
            transformStyle: 'preserve-3d'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMoveCombined}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeaveCombined}
        >

          {/* Spine representation for page hinges (Left margins anchor binder look) */}
          <div className="absolute left-0 top-0 bottom-0 w-[14px] bg-gradient-to-r from-[#2c0b05] via-[#7c2616] to-[#3a0d05] rounded-l-2xl z-40 border-r border-[#963725]/30 shadow-2xl flex flex-col justify-around py-6 items-center">
            {/* Tiny golden metallic binding rivets */}
            <div className="w-1.5 h-1.5 bg-amber-400/50 rounded-full shadow-xs" />
            <div className="w-1.5 h-1.5 bg-amber-400/50 rounded-full shadow-xs" />
            <div className="w-1.5 h-1.5 bg-amber-400/50 rounded-full shadow-xs" />
            <div className="w-1.5 h-1.5 bg-amber-400/50 rounded-full shadow-xs" />
            <div className="w-1.5 h-1.5 bg-amber-400/50 rounded-full shadow-xs" />
          </div>

          {/* Realistic background stack pages depth effect (Gives weight to the booklet) */}
          <div className="absolute inset-y-1.5 right-1 w-[314px] bg-neutral-200/95 rounded-r-2xl shadow-md z-10 pointer-events-none border-y border-neutral-300" />
          <div className="absolute inset-y-2.5 right-2 w-[308px] bg-[#fdfaf3] rounded-r-2xl shadow-sm z-15 pointer-events-none border-y border-neutral-300" />

          {/* ========================================================================= */}
          {/* THE PAGE CONTAINER & TRANSITIONS */}
          {/* ========================================================================= */}
          <div 
            className={`w-full h-full relative rounded-2xl overflow-hidden z-20 shadow-[10px_14px_30px_rgba(0,0,0,0.15)] ${
              isFlipping 
                ? flipDirection === 'next' 
                  ? 'animate-page-turn-next' 
                  : 'animate-page-turn-prev'
                : ''
            }`}
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Live light shadow sweep animation during transitions */}
            {isFlipping && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/25 to-transparent pointer-events-none z-50 animate-shadow-sweep" />
            )}

            {/* PAGE 0: FRONT COVER (PORTADA DE CUERO ROJO CON GRABADOS DE ORO) */}
            {bookPage === 0 && (
              <div 
                onClick={triggerNextPage}
                className="absolute inset-0 bg-gradient-to-br from-[#7c2616] to-[#511309] rounded-2xl p-6 pl-10 text-white flex flex-col justify-between items-center text-center select-none cursor-pointer"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Gold foil detailed border framing */}
                <div className="absolute top-2.5 left-6 right-2.5 bottom-2.5 border border-amber-300/30 rounded-xl pointer-events-none" />
                <div className="absolute top-3.5 left-7 right-3.5 bottom-3.5 border-4 border-double border-amber-300/20 rounded-lg pointer-events-none" />

                {/* Cover Emblem Header */}
                <div className="flex flex-col items-center gap-1.5 pt-4 z-10 pointer-events-none">
                  <span className="font-sans text-[8.5px] tracking-[0.32em] text-amber-200/90 uppercase font-extrabold">República de Nicaragua</span>
                  <div className="h-[1.5px] w-14 bg-amber-300/40 my-1" />
                  <h3 className="font-serif text-[17px] font-black tracking-widest text-amber-100 uppercase">Pasaporte Sostenible</h3>
                </div>

                {/* Nicaraguan Volcanic Golden Emblem design details */}
                <div className="relative w-32 h-32 my-2 flex items-center justify-center border-4 border-double border-amber-300/25 rounded-full bg-[#5f1c10]/70 shadow-2xl z-10">
                  <Fingerprint className="w-16 h-16 text-amber-100/90 animate-pulse" strokeWidth={1} />
                  
                  {/* Miniature decorative elements */}
                  <span className="absolute text-xs text-amber-200 top-3">🌋</span>
                  <span className="absolute text-[8px] text-amber-200 left-4 top-1/2 -translate-y-1/2">★</span>
                  <span className="absolute text-[8px] text-amber-200 right-4 top-1/2 -translate-y-1/2">★</span>
                  <span className="absolute text-[8px] text-amber-200/95 bottom-3 tracking-[0.2em] font-serif leading-none uppercase">Xolara</span>
                </div>

                {/* Bottom details of Closed Passport */}
                <div className="flex flex-col items-center gap-1.5 pb-4 z-10 pointer-events-none">
                  <span className="text-[10px] text-amber-200/70 font-mono tracking-widest">Nº NICA-7703-CO2</span>
                  
                  <button 
                    className="bg-[#faf5e5] text-[#7c2616] hover:bg-neutral-50 text-[10px] px-6 py-2 rounded-full font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerNextPage();
                    }}
                  >
                    Abrir Libreta
                    <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
                  </button>
                </div>
              </div>
            )}

            {/* PAGE 1: TRAVELER BIOMETRIC IDENTITY */}
            {bookPage === 1 && (
              <div 
                className="absolute inset-0 passport-paper rounded-2xl p-6 pl-10 text-brand-text-dark flex flex-col justify-between relative overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Guilloché pattern background layer */}
                <SecurityPattern />
                
                {/* Thin border */}
                <div className="absolute top-2.5 left-6 right-2.5 bottom-2.5 border border-brand-primary/10 rounded-xl pointer-events-none" />

                {/* Identification Header */}
                <div className="border-b border-brand-primary/15 pb-2 border-dashed z-10 pointer-events-none">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[7.5px] font-black text-brand-primary/70 tracking-widest uppercase">REGISTRO DE INYECCIÓN DIRECTA</span>
                    <span className="text-[7px] font-mono font-bold text-brand-primary">COD: XLR-19</span>
                  </div>
                  <span className="text-sm font-serif font-black text-brand-primary uppercase leading-tight block mt-1">Identidad de Viajero Autónomo</span>
                </div>

                {/* Photo Grid & Fields */}
                <div className="grid grid-cols-5 gap-3.5 mt-2 flex-grow z-10">
                  {/* Portrait photo frame */}
                  <div className="col-span-2 flex flex-col items-center">
                    <div className="w-full aspect-[4/5] bg-stone-200 rounded border border-brand-primary/20 overflow-hidden relative shadow-md">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
                        alt="Elena Santos" 
                        className="w-full h-full object-cover grayscale contrast-115 sepia-[40%]" 
                      />
                      {/* Biometric circle seal stamp overlap */}
                      <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full border border-dashed border-[#922718]/40 bg-transparent flex items-center justify-center text-[#922718]/30 font-serif text-[4px] font-black scale-120 rotate-12">
                        SELLO OFICIAL
                      </div>
                    </div>
                    <span className="text-[7.5px] font-black text-[#8c7457] mt-1.5 uppercase tracking-wide">Elena Santos</span>
                  </div>

                  {/* Fields lists */}
                  <div className="col-span-3 flex flex-col gap-2.5 text-[8px] text-[#6b563f] pt-1">
                    <div>
                      <span className="block text-[6px] text-brand-text-muted font-black uppercase leading-none">Viajero / Nombres:</span>
                      <span className="font-black text-[9.5px] text-brand-text-dark font-mono mt-0.5 block">Elena M. Santos</span>
                    </div>
                    <div>
                      <span className="block text-[6px] text-brand-text-muted font-black uppercase leading-none">País de Procedencia:</span>
                      <span className="font-bold text-[9px] text-brand-text-dark font-mono mt-0.5 block">España (Madrid)</span>
                    </div>
                    <div>
                      <span className="block text-[6px] text-brand-text-muted font-black uppercase leading-none">Estado de Rol:</span>
                      <span className="font-black text-[8px] text-brand-secondary uppercase font-mono mt-0.5 block tracking-tighter bg-brand-secondary/15 px-1.5 py-0.5 rounded w-max">
                        Exploradora Activa nica
                      </span>
                    </div>
                    <div>
                      <span className="block text-[6px] text-brand-text-muted font-black uppercase leading-none">Huella Escáner:</span>
                      <span className="font-sans font-bold text-[7px] text-[#214e34] mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#214e34]" />
                        Verificada Comunal
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hand Signature Box */}
                <div className="border-t border-dashed border-[#8c7457]/30 pt-2 pb-1 z-10">
                  <span className="block text-[6px] text-[#9c8468] uppercase font-bold leading-none mb-1">Firma de Registro Soberano:</span>
                  <span className="font-serif italic font-extrabold text-sm text-brand-primary block tracking-wider leading-none select-none pl-1 py-1 transform -rotate-1">
                    ElenaSantos_Nica
                  </span>
                </div>

                {/* Pagination tracker */}
                <div className="flex justify-between text-[7px] text-brand-text-muted font-mono pt-1 pointer-events-none border-t border-brand-primary/5">
                  <span>Pág 1</span>
                  <span>« Tierra de Lagos y Cooperativas »</span>
                </div>
              </div>
            )}

            {/* PAGE 2: NATURE AND VOLCANOES STAMPS */}
            {bookPage === 2 && (
              <div 
                className="absolute inset-0 passport-paper rounded-2xl p-6 pl-10 text-brand-text-dark flex flex-col justify-between relative overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <SecurityPattern />
                
                {/* Frame border */}
                <div className="absolute top-2.5 left-6 right-2.5 bottom-2.5 border border-brand-primary/10 rounded-xl pointer-events-none" />

                <div className="z-10">
                  <div className="border-b border-brand-primary/15 pb-2 flex justify-between items-baseline">
                    <span className="text-[8px] font-black text-brand-primary uppercase tracking-wider">Conservación de Naturaleza</span>
                    <span className="text-[7.5px] font-mono text-brand-text-muted">Pág 2</span>
                  </div>

                  <p className="text-[8.5px] text-[#9c8468] leading-normal font-bold my-2 pb-1">
                    Registros oficiales de preservación ecológica nicaragüense. Presiona el sello para evaluar las hectáreas protegidas de la biósfera.
                  </p>

                  {/* Large visual stamps grid utilizing realistic textures */}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {/* Stamp 1: Mombacho */}
                    {allStamps[0] && (
                      <RealisticStamp
                        id={allStamps[0].id}
                        title={allStamps[0].title}
                        category={allStamps[0].category}
                        date={allStamps[0].date}
                        color={allStamps[0].color}
                        isDynamic={allStamps[0].isDynamic}
                        rotate={-4.5}
                        onClick={() => setSelectedStamp(allStamps[0])}
                      />
                    )}

                    {/* Stamp 2: Volcan Masaya */}
                    <RealisticStamp
                      id="p4"
                      title="Volcán Masaya Trek"
                      category="Naturaleza"
                      date="OCT 2023"
                      color="#1b4570" // Dusty indigo
                      rotate={5.2}
                      onClick={() => setSelectedStamp({
                        id: 'p4',
                        title: 'Volcán Masaya Trek',
                        category: 'Naturaleza',
                        date: 'Octubre 2023',
                        iconType: 'mountain',
                        color: '#1b4570',
                        desc: 'Sello de participación activa en el ecotrekking del Volcán Masaya. Financia la reforestación de laderas áridas con madero negro y cactus tradicionales.'
                      })}
                    />
                  </div>
                </div>

                {/* Page footnote */}
                <div className="flex justify-between text-[7px] text-[#9c8468] font-semibold border-t border-[#a89c7d]/15 pt-2 z-10">
                  <span>Inyección Directa Conservación</span>
                  <span>« Orquídeas y Volcanes »</span>
                </div>
              </div>
            )}

            {/* PAGE 3: CULTURE & HERITAGE STAMPS */}
            {bookPage === 3 && (
              <div 
                className="absolute inset-0 passport-paper rounded-2xl p-6 pl-10 text-brand-text-dark flex flex-col justify-between relative overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <SecurityPattern />
                
                {/* Frame border */}
                <div className="absolute top-2.5 left-6 right-2.5 bottom-2.5 border border-brand-primary/10 rounded-xl pointer-events-none" />

                <div className="z-10">
                  <div className="border-b border-brand-primary/15 pb-2 flex justify-between items-baseline">
                    <span className="text-[8px] font-black text-brand-primary uppercase tracking-wider">Saberes Culturales e Identidad</span>
                    <span className="text-[7.5px] font-mono text-brand-text-muted">Pág 3</span>
                  </div>

                  <p className="text-[8.5px] text-[#9c8468] leading-normal font-bold my-2 pb-1">
                    Comprobantes húmedos artesanales otorgados en talleres comunales de alfarería e ingredientes nativos precolombinos.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {/* Ceramic Stamp */}
                    {allStamps[2] && (
                      <RealisticStamp
                        id={allStamps[2].id}
                        title={allStamps[2].title}
                        category={allStamps[2].category}
                        date={allStamps[2].date}
                        color={allStamps[2].color}
                        isDynamic={allStamps[2].isDynamic}
                        rotate={-3.5}
                        onClick={() => setSelectedStamp(allStamps[2])}
                      />
                    )}

                    {/* Gastronomy Stamp */}
                    {allStamps[1] && (
                      <RealisticStamp
                        id={allStamps[1].id}
                        title={allStamps[1].title}
                        category={allStamps[1].category}
                        date={allStamps[1].date}
                        color={allStamps[1].color}
                        isDynamic={allStamps[1].isDynamic}
                        rotate={4}
                        onClick={() => setSelectedStamp(allStamps[1])}
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-between text-[7px] text-[#9c8468] font-semibold border-t border-[#a89c7d]/15 pt-2 z-10">
                  <span>Patrimonio Vivo Chorotega</span>
                  <span>« Oficios Singulares »</span>
                </div>
              </div>
            )}

            {/* PAGE 4: LIVE RECENT RESERVATION STAMPS (NICA LIVE) */}
            {bookPage === 4 && (
              <div 
                className="absolute inset-0 passport-paper rounded-2xl p-6 pl-10 text-brand-text-dark flex flex-col justify-between relative overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <SecurityPattern />
                
                {/* Frame border */}
                <div className="absolute top-2.5 left-6 right-2.5 bottom-2.5 border border-brand-primary/10 rounded-xl pointer-events-none" />

                <div className="z-10">
                  <div className="border-b border-brand-primary/15 pb-2 flex justify-between items-baseline">
                    <span className="text-[8px] font-black text-brand-primary uppercase tracking-wider">Sellos de Sesiones en Vivo</span>
                    <span className="text-[7.5px] font-mono text-brand-text-muted">Pág 4</span>
                  </div>

                  <p className="text-[8.5px] text-[#9c8468] leading-normal font-bold my-2 pb-1">
                    Estos sellos se depositan en tinta violeta en tiempo real cuando reservas experiencias durante tu estadía soberana.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {allStamps.filter(s => s.isDynamic).length > 0 ? (
                      allStamps.filter(s => s.isDynamic).map((ds, index) => (
                        <RealisticStamp
                          key={ds.id}
                          id={ds.id}
                          title={ds.title}
                          category={ds.category}
                          date={ds.date}
                          color={ds.color}
                          isDynamic={ds.isDynamic}
                          rotate={index % 2 === 0 ? -2.5 : 3}
                          onClick={() => setSelectedStamp(ds)}
                        />
                      ))
                    ) : (
                      /* Empty stamps container */
                      <div className="col-span-2 border border-dashed border-[#a89c7d]/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-brand-text-muted my-2 bg-stone-50/50">
                        <span className="text-2xl mb-1 block">🔒</span>
                        <span className="text-[9px] font-bold mt-1 max-w-[180px] leading-relaxed">
                          Tus reservas activas se estamparán aquí como comprobante húmedo nicaragüense tan pronto hagas check-in.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between text-[7px] text-[#9c8468] font-semibold border-t border-[#a89c7d]/15 pt-2 z-10 font-mono">
                  <span>Ref: {bookings.length > 0 ? 'Conectando...' : 'Esperando Sello...'}</span>
                  <span>{bookings.length > 0 ? `¡${bookings.length} Activo!` : 'Sello Libre'}</span>
                </div>
              </div>
            )}

            {/* PAGE 5: BACK COVER / SOVEREIGN IMPACT LEDGER */}
            {bookPage === 5 && (
              <div 
                onClick={() => setBookPage(0)}
                className="absolute inset-0 bg-gradient-to-br from-[#6a1f11] to-[#3f0f07] rounded-2xl p-6 pl-10 text-white flex flex-col justify-between items-center text-center select-none cursor-pointer"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Golden foil */}
                <div className="absolute top-2.5 left-6 right-2.5 bottom-2.5 border border-amber-300/10 rounded-xl pointer-events-none" />

                <div className="flex flex-col items-center gap-1 mt-2 pointer-events-none z-10">
                  <span className="text-[8px] font-black text-amber-200/80 tracking-widest uppercase">REGISTRO SOBERANO</span>
                  <h3 className="font-serif text-[16px] font-black tracking-wide text-amber-100">Xolara Ledger de Impacto</h3>
                  <div className="h-[1px] w-12 bg-amber-200/35 my-1" />
                  <p className="text-[10px] text-amber-100/70 max-w-[220px] leading-relaxed font-semibold">
                    Territorio libre de especulación. Tu aporte de viaje inyectó valor real y ético directo a cooperativas campesinas.
                  </p>
                </div>

                {/* Impact metrics ledger display */}
                <div className="w-[180px] py-3.5 px-4 bg-[#4e140b]/90 rounded-2xl border border-amber-300/10 flex flex-col gap-2 z-10 shadow-inner">
                  <div className="flex items-center justify-between text-[9px] text-amber-200/80">
                    <span className="font-mono">Mitigación CO2:</span>
                    <span className="font-black text-amber-300">{45 + bookings.length * 15}kg CO2</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-amber-200/805">
                    <span className="font-mono">Familias socias:</span>
                    <span className="font-black text-amber-300">{12 + bookings.length * 4} Unidades</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-amber-200/80">
                    <span className="font-mono">Sueldos Directos:</span>
                    <span className="font-black text-amber-300">${320 + bookings.reduce((s, b) => s + b.totalPrice, 0)} USD</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 pb-2 z-10 pointer-events-none">
                  <span className="text-[7.5px] font-sans font-black text-amber-200/40 uppercase tracking-widest">MINISTRO DEL TURISMO COMUNITARIO</span>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-amber-300/80">
                    <span>⭐⭐⭐⭐★</span>
                  </div>
                  <span className="text-[8.5px] text-amber-200/60 mt-1 font-black underline decoration-dashed col-span-2">¡Pulsa para cerrar el Pasaporte!</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Tactile indicator circles below book with swiping guide arrow helpers */}
      <div className="flex justify-center items-center gap-3.5 px-5 z-20">
        <button 
          onClick={triggerPrevPage} 
          disabled={bookPage === 0}
          className="p-2 bg-white rounded-full border border-brand-primary/10 shadow-xs text-brand-primary disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-50"
          title="Página Anterior"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4, 5].map(pIdx => (
            <button
              key={pIdx}
              onClick={() => {
                if (pIdx === bookPage) return;
                setIsFlipping(true);
                setFlipDirection(pIdx > bookPage ? 'next' : 'prev');
                setTimeout(() => {
                  setBookPage(pIdx);
                }, 260);
                setTimeout(() => {
                  setIsFlipping(false);
                  setFlipDirection('none');
                }, 550);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                bookPage === pIdx 
                  ? 'bg-brand-primary w-6 shadow-xs' 
                  : 'bg-brand-primary/20 w-2 hover:bg-brand-primary/40'
              }`}
              title={`Ver página ${pIdx + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={triggerNextPage} 
          disabled={bookPage === 5}
          className="p-2 bg-white rounded-full border border-brand-primary/10 shadow-xs text-brand-primary disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-50"
          title="Siguiente Página"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time slider progress to next destination accolade */}
      <div className="px-5">
        <div className="p-4 bg-white border border-brand-primary/5 rounded-2xl shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-baseline text-xs font-bold text-brand-text-dark">
            <span className="flex items-center gap-1.5 text-brand text-dark font-sans font-black">
              <Award className="w-4 h-4 text-brand-secondary animate-bounce" />
              Categoría Honorífica en Nicaragua
            </span>
            <span className="text-brand-secondary font-mono font-black">{milestonePercent}%</span>
          </div>
          
          <div className="w-full bg-brand-bg rounded-full h-2 overflow-hidden shadow-inner border border-stone-200">
            <div 
              className="bg-brand-secondary h-full rounded-full transition-all duration-1000"
              style={{ width: `${milestonePercent}%` }}
            />
          </div>
          
          <p className="text-[10px] text-brand-text-muted leading-tight font-bold mt-0.5">
            ¡Tienes {totalStamps} de 8 sellos recomendados! Completa {Math.max(1, 8 - totalStamps)} experiencias más para desbloquear la insignia de <span className="text-brand-secondary font-black">"Guardián de Tradiciones Chorotegas"</span>.
          </p>
        </div>
      </div>

      {/* Interactive Cultural Tips Access banner */}
      <div className="px-5">
        <button
          onClick={() => setIsTipsOpen(true)}
          className="w-full bg-[#3a674f] hover:bg-[#325843] text-stone-100 p-4 rounded-2xl shadow-sm text-left flex items-center justify-between transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group cursor-pointer"
        >
          {/* Subtle watermark background decorative stamp design */}
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none select-none text-white text-9xl">
            ★
          </div>

          <div className="flex items-center gap-3 z-10">
            <div className="p-2 border border-white/20 bg-white/10 rounded-xl text-lg group-hover:scale-110 transition-transform">
              💡
            </div>
            <div>
              <span className="block font-serif text-sm font-black text-white">Consejos Culturales de Nicaragua</span>
              <span className="block text-[10px] text-amber-200 font-semibold mt-0.5 uppercase tracking-wide">
                {bookings.length > 0 ? `✓ Adaptado a tus ${bookings.length} reservas` : 'Explorar modismos y etiqueta local'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 group-hover:bg-white/20 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-white z-10">
            Ver Consejos
          </div>
        </button>
      </div>

      {/* Selected Stamp detail drawer panel with authentic stamp overlay look */}
      {selectedStamp ? (
        <div className="px-5 animate-fade-in mb-6">
          <div className="p-4 bg-[#fffdfa] border-2 border-brand-primary/15 rounded-2xl flex flex-col gap-2.5 shadow-md relative overflow-hidden">
            
            {/* Ink Stamp watermark overlay representation */}
            <div className="absolute right-4 top-4 opacity-5 pointer-events-none select-none">
              <Fingerprint className="text-9xl text-brand-primary" />
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-brand-primary/10">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full border border-dashed flex items-center justify-center text-sm font-bold bg-neutral-50"
                  style={{ borderColor: selectedStamp.color, color: selectedStamp.color }}
                >
                  ★
                </div>
                <div>
                  <h4 className="text-xs font-serif font-black text-brand-text-dark leading-none">{selectedStamp.title}</h4>
                  <span className="text-[9px] text-[#917d66] font-bold uppercase mt-1 block">{selectedStamp.category} • {selectedStamp.date}</span>
                </div>
              </div>

              <span className="text-[8px] bg-brand-secondary/15 text-brand-secondary font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider">
                Blockchain Co2 nica
              </span>
            </div>

            <p className="text-[11px] text-[#55423c] leading-relaxed font-semibold">
              {selectedStamp.desc}
            </p>

            <div className="bg-[#ede7d9]/40 rounded-xl p-2.5 mt-1 border border-brand-primary/5">
              <span className="block text-[8px] uppercase tracking-wider text-[#917d66] font-extrabold mb-1.5">Impacto verificado y auditado:</span>
              <ul className="text-[9.5px] text-brand-text-dark font-extrabold list-disc pl-3.5 space-y-1">
                <li>Sustento neto digno, sin intermediaros.</li>
                <li>Porcentaje del ticket revertido a la reforestación de la biósfera.</li>
                <li>Hospedaje cooperativo guiado por líderes comunales locales.</li>
              </ul>
            </div>

            <button 
              onClick={() => setSelectedStamp(null)}
              className="text-[10px] font-bold text-center bg-brand-primary text-white py-2 px-5 rounded-full mt-2 self-center hover:bg-brand-primary/95 transition-all active:scale-95 shadow-sm"
            >
              Completar Inspección
            </button>
          </div>
        </div>
      ) : (
        /* Prompt user to explore */
        <div className="px-5 text-center py-2 mb-6">
          <p className="text-[11px] text-[#8c7457] italic font-semibold leading-relaxed">
            💡 Consejo: Presiona cualquiera de los sellos diplomáticos ilustrados en tu pasaporte para inspeccionar el impacto ambiental y social de tus viajes.
          </p>
        </div>
      )}

      {/* Nicaraguan Cultural Tips Overlay Pop-up Modal */}
      <CulturalTipsPopup
        isOpen={isTipsOpen}
        onClose={() => setIsTipsOpen(false)}
        bookings={bookings}
        config={config}
      />

    </div>
  );
}
