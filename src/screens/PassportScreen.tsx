import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  Award, Fingerprint, ArrowRight, CheckCircle2,
  Mountain, Utensils, Palette, Coffee, Flame, Lock
} from 'lucide-react';
import { Booking, AppConfig } from '../types';
import CulturalTipsPopup from '../components/CulturalTipsPopup';
import { useFirebase } from '../contexts/FirebaseContext';

interface PassportScreenProps {
  bookings: Booking[];
  config: AppConfig;
  onOpenConfig: () => void;
}

// SVG turbulence filter
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

// Guilloché pattern
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

// Realistic Stamp Component
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
}) => {
  const isMombacho = id === 'p1';
  const isGranada = id === 'p2';
  const isCeramica = id === 'p3';
  const isMasaya = id === 'p4';

  return (
    <div 
      onClick={onClick}
      className="relative p-2.5 rounded-2xl flex flex-col items-center justify-center text-center select-none transition-all hover:scale-[1.06] active:scale-95 cursor-pointer"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div 
        className="flex flex-col items-center justify-center font-mono relative group"
        style={{ color, filter: 'url(#distressed-ink)' }}
      >
        {isMombacho && (
          <div className="w-20 h-20 relative flex flex-col items-center justify-center">
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
              <Mountain className="w-5 h-5 text-current" strokeWidth={2.5} />
              <span className="text-[5.5px] font-black tracking-widest mt-0.5 leading-none">MOMBACHO</span>
              <span className="text-[7.5px] font-black mt-1 bg-white/40 px-1 leading-none">{date}</span>
            </div>
          </div>
        )}

        {isGranada && (
          <div className="w-20 h-20 relative flex flex-col items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <path d="M 10 12 Q 50 20 90 12 L 90 88 Q 50 80 10 88 Z" strokeWidth="2.2" />
              <path d="M 14 16 L 14 84 M 86 16 L 86 84" strokeWidth="0.8" strokeDasharray="2.5 2.5" />
              <line x1="14" y1="31" x2="86" y2="31" strokeWidth="1" />
              <line x1="14" y1="69" x2="86" y2="69" strokeWidth="1" />
            </svg>
            <div className="z-10 flex flex-col items-center px-1 justify-center mt-0.5">
              <span className="text-[6px] font-extrabold uppercase tracking-widest leading-none">GRANADA</span>
              <Utensils className="w-5 h-5 text-current my-1" strokeWidth={2.5} />
              <span className="text-[8px] font-black uppercase tracking-widest leading-none bg-white/50 px-1">{date}</span>
              <span className="text-[5px] font-bold mt-1 text-center truncate leading-none uppercase">SABORES REGIONALES</span>
            </div>
          </div>
        )}

        {isCeramica && (
          <div className="w-20 h-20 relative flex flex-col items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <polygon points="30,8 70,8 92,30 92,70 70,92 30,92 8,70 8,30" strokeWidth="2.2" />
              <polygon points="32,12 68,12 88,32 88,68 68,88 32,88 12,68 12,32" strokeWidth="0.8" strokeDasharray="2 2" />
            </svg>
            <div className="z-10 flex flex-col items-center justify-center text-center px-1">
              <span className="text-[5px] font-extrabold uppercase tracking-widest leading-none">ALFARERO</span>
              <Palette className="w-5 h-5 text-current my-0.5" strokeWidth={2.5} />
              <span className="text-[8.5px] font-black tracking-tight leading-none px-1 bg-white/60 mb-0.5">{date}</span>
              <span className="text-[4.5px] font-bold uppercase leading-none">CHOROTEGA</span>
            </div>
          </div>
        )}

        {isMasaya && (
          <div className="w-20 h-20 relative flex flex-col items-center justify-center">
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
              <Flame className="w-5 h-5 text-current my-0.5" strokeWidth={2.5} />
              <span className="text-[8px] font-black uppercase tracking-widest leading-none bg-white/60 px-1 py-0.5 my-0.5">MASAYA</span>
              <span className="text-[6.5px] font-bold uppercase leading-none">{date}</span>
            </div>
          </div>
        )}

        {!isMombacho && !isGranada && !isCeramica && !isMasaya && (
          <div className="w-20 h-20 relative flex flex-col items-center justify-center">
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
              <Coffee className="w-5 h-5 text-current mb-0.5 mt-1" strokeWidth={2.5} />
              <span className="text-[5.5px] font-black uppercase text-center tracking-tight leading-none max-w-[55px] truncate mt-0.5 bg-white/30 px-0.5">
                {title.split(' en ')[0].split(' de ')[0]}
              </span>
              <span className="text-[7.5px] font-black uppercase bg-white/60 px-1.5 py-0.5 rounded border border-dashed border-current mt-1 leading-none">{date}</span>
            </div>
          </div>
        )}
      </div>
      <span className="text-[8.5px] font-black text-brand-text-dark mt-3 leading-tight truncate w-full group-hover:text-brand-primary">{title}</span>
    </div>
  );
};

export default function PassportScreen({ bookings, config, onOpenConfig }: PassportScreenProps) {
  const { user } = useFirebase();
  const prefersReducedMotion = useReducedMotion();
  const [selectedStamp, setSelectedStamp] = useState<any | null>(null);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [bookPage, setBookPage] = useState<number>(0);
  const [[page, direction], setPage] = useState([0, 0]);

  // Dynamic stamps
  const dynamicStamps = bookings.map(b => ({
    id: `dynamic-${b.id}`,
    title: b.experienceTitle,
    category: 'Sello de Sesión',
    date: b.date.split(',')[0] || 'Junio 2026',
    iconType: 'coffee',
    color: '#4a154b',
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
      color: '#214e34',
      isDynamic: false,
      desc: 'Sello ecológico de senderismo certificado de la reserva biológica nebliselva del Volcán Mombacho.'
    },
    {
      id: 'p2',
      title: 'Plato Tradicional Granada',
      category: 'Gastronómico',
      date: 'Abril 2026',
      iconType: 'utensils',
      color: '#7b4c06',
      isDynamic: false,
      desc: 'Sello del rescate culinario nicaragüense.'
    },
    {
      id: 'p3',
      title: 'Cerámica Ancestral',
      category: 'Patrimonial',
      date: 'Marzo 2026',
      iconType: 'palette',
      color: '#922718',
      isDynamic: false,
      desc: 'Sello de preservación indígena chorotega.'
    },
    ...dynamicStamps
  ];

  const totalStamps = allStamps.length;
  const milestonePercent = Math.min(100, Math.round((totalStamps / 8) * 100));

  // Framer Motion variants - giro de hoja física anclada al lomo (transformOrigin left).
  // Página entra desde rotateY ±90 hasta 0; saliente rota de 0 a ∓90 (efecto pasar página).
  // zIndex: entrante encima (2), saliente debajo (0). Reduced-motion → fade.
  const variants = prefersReducedMotion
    ? {
        enter: { opacity: 0, zIndex: 1 },
        center: { rotateY: 0, opacity: 1, zIndex: 1 },
        exit: { opacity: 0, zIndex: 0 }
      }
    : {
        enter: (direction: number) => ({
          rotateY: direction > 0 ? -90 : 90,
          opacity: 0.4,
          zIndex: 2
        }),
        center: {
          rotateY: 0,
          opacity: 1,
          zIndex: 1
        },
        exit: (direction: number) => ({
          rotateY: direction > 0 ? 90 : -90,
          opacity: 0.4,
          zIndex: 0
        })
      };

  const paginate = (newDirection: number) => {
    const newPage = bookPage + newDirection;
    if (newPage >= 0 && newPage <= 5) {
      setPage([newPage, newDirection]);
      setBookPage(newPage);
    }
  };

  // Páginas del pasaporte
  const pages = [
    // PAGE 0: COVER
    <div 
      key="cover"
      onClick={() => paginate(1)}
      className="absolute inset-0 bg-gradient-to-br from-[#7c2616] to-[#511309] rounded-2xl p-6 text-white flex flex-col justify-between items-center text-center select-none cursor-pointer"
      style={{ backfaceVisibility: 'hidden' }}
    >
      <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 border border-amber-300/30 rounded-xl pointer-events-none" />
      <div className="absolute top-3.5 left-3.5 right-3.5 bottom-3.5 border-4 border-double border-amber-300/20 rounded-lg pointer-events-none" />

      <div className="flex flex-col items-center gap-1.5 pt-4 z-10 pointer-events-none">
        <span className="font-sans text-[8.5px] tracking-[0.32em] text-amber-200/90 uppercase font-extrabold">República de Nicaragua</span>
        <div className="h-[1.5px] w-14 bg-amber-300/40 my-1" />
        <h3 className="font-serif text-[17px] font-black tracking-widest text-amber-100 uppercase">Pasaporte</h3>
      </div>

      <div className="relative w-32 h-32 my-2 flex items-center justify-center border-4 border-double border-amber-300/25 rounded-full bg-[#5f1c10]/70 shadow-2xl z-10">
        <Fingerprint className="w-16 h-16 text-amber-100/90 animate-pulse" strokeWidth={1} />
        <span className="absolute text-amber-200 top-3"><Mountain className="w-4 h-4" strokeWidth={2.5}/></span>
        <span className="absolute text-[8px] text-amber-200 left-4 top-1/2 -translate-y-1/2">★</span>
        <span className="absolute text-[8px] text-amber-200 right-4 top-1/2 -translate-y-1/2">★</span>
        <span className="absolute text-[8px] text-amber-200/95 bottom-3 tracking-[0.2em] font-serif leading-none uppercase">Xolara</span>
      </div>

      <div className="flex flex-col items-center gap-1.5 pb-4 z-10 pointer-events-none">
        <span className="text-[10px] text-amber-200/70 font-mono tracking-widest">Nº NICA-7703-CO2</span>
        <button 
          className="bg-[#faf5e5] text-[#7c2616] hover:bg-neutral-50 text-[10px] px-6 py-2 rounded-full font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            paginate(1);
          }}
        >
          Abrir
          <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
        </button>
      </div>
    </div>,

    // PAGE 1: IDENTITY
    <div 
      key="identity"
      className="absolute inset-0 h-full w-full rounded-2xl p-6 text-brand-text-dark flex flex-col justify-between overflow-hidden bg-[#fcf9f2] bg-cover bg-center"
      style={{
        backfaceVisibility: 'hidden',
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/paper-fibers.png)',
        backgroundColor: '#fcf9f2'
      }}
    >
      <SecurityPattern />
      <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 border border-brand-primary/10 rounded-xl pointer-events-none" />

      <div className="border-b border-brand-primary/15 pb-2 border-dashed z-10 pointer-events-none">
        <div className="flex justify-between items-baseline">
          <span className="text-[7.5px] font-black text-brand-primary/70 tracking-widest uppercase">RDATOS PERSONALES</span>
          <span className="text-[7px] font-mono font-bold text-brand-primary">COD: XLR-19</span>
        </div>
        <span className="text-sm font-serif font-black text-brand-primary uppercase leading-tight block mt-1">Identidad de Viajero</span>
      </div>

      <div className="grid grid-cols-5 gap-3.5 mt-2 flex-grow z-10">
        <div className="col-span-2 flex flex-col items-center">
          <div className="w-full aspect-[4/5] bg-[#efebe1] rounded border border-brand-primary/20 overflow-hidden relative shadow-md flex items-center justify-center">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || "User"} 
                className="w-full h-full object-cover grayscale contrast-115 sepia-[40%]" 
              />
            ) : (
              <span className="text-[7.5px] font-black uppercase text-brand-primary/40 tracking-widest leading-none rotate-[-90deg]">FOTO</span>
            )}
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full border border-dashed border-[#922718]/40 bg-transparent flex items-center justify-center text-[#922718]/30 font-serif text-[4px] font-black scale-120 rotate-12">
              SELLO OFICIAL
            </div>
          </div>
          <span className="text-[7.5px] font-black text-[#8c7457] mt-1.5 uppercase tracking-wide">{user ? user.displayName : 'Explorador Anónimo'}</span>
        </div>

        <div className="col-span-3 flex flex-col gap-2.5 text-[8px] text-[#6b563f] pt-1">
          <div>
            <span className="block text-[6px] text-brand-text-muted font-black uppercase leading-none">Viajero / Nombres:</span>
            <span className="font-black text-[9.5px] text-brand-text-dark font-mono mt-0.5 block">{user ? user.displayName : 'Nombre de Prueba'}</span>
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
            <span className="block text-[6px] text-brand-text-muted font-black uppercase leading-none">IDENTIDAD</span>
            <span className="font-sans font-bold text-[7px] text-[#214e34] mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#214e34]" />
              Verificada
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-[#8c7457]/30 pt-2 pb-1 z-10">
        <span className="block text-[6px] text-[#9c8468] uppercase font-bold leading-none mb-1">Presentación:</span>
        <span className="font-serif italic font-extrabold text-sm text-brand-primary block tracking-wider leading-none select-none pl-1 py-1 transform -rotate-1">
          Texto de presentacion de prueba.
        </span>
      </div>

      <div className="flex justify-between text-[7px] text-brand-text-muted font-mono pt-1 pointer-events-none border-t border-brand-primary/5">
        <span>Pág 1</span>
        <span>« Xolara »</span>
      </div>
    </div>,

    // PAGE 2: NATURE STAMPS
    <div 
      key="nature"
      className="absolute inset-0 h-full w-full rounded-2xl p-6 text-brand-text-dark flex flex-col justify-between overflow-hidden bg-[#fcf9f2] bg-cover bg-center"
      style={{
        backfaceVisibility: 'hidden',
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/paper-fibers.png)',
        backgroundColor: '#fcf9f2'
      }}
    >
      <SecurityPattern />
      <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 border border-brand-primary/10 rounded-xl pointer-events-none" />

      <div className="z-10">
        <div className="border-b border-brand-primary/15 pb-2 flex justify-between items-baseline">
          <span className="text-[8px] font-black text-brand-primary uppercase tracking-wider">Conservación de Naturaleza</span>
          <span className="text-[7.5px] font-mono text-brand-text-muted">Pág 2</span>
        </div>

        <p className="text-[8.5px] text-[#9c8468] leading-normal font-bold my-2 pb-1">
          Registros oficiales de preservación ecológica nicaragüense. Presiona el sello para evaluar las hectáreas protegidas de la biósfera.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-2">
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

          <RealisticStamp
            id="p4"
            title="Volcán Masaya Trek"
            category="Naturaleza"
            date="OCT 2023"
            color="#1b4570"
            rotate={5.2}
            onClick={() => setSelectedStamp({
              id: 'p4',
              title: 'Volcán Masaya Trek',
              category: 'Naturaleza',
              date: 'Octubre 2023',
              iconType: 'mountain',
              color: '#1b4570',
              desc: 'Sello de participación activa en el ecotrekking del Volcán Masaya.'
            })}
          />
        </div>
      </div>

      <div className="flex justify-between text-[7px] text-[#9c8468] font-semibold border-t border-[#a89c7d]/15 pt-2 z-10">
        <span>Inyección Directa Conservación</span>
        <span>« Orquídeas y Volcanes »</span>
      </div>
    </div>,

    // PAGE 3: CULTURE STAMPS
    <div 
      key="culture"
      className="absolute inset-0 h-full w-full rounded-2xl p-6 text-brand-text-dark flex flex-col justify-between overflow-hidden bg-[#fcf9f2] bg-cover bg-center"
      style={{
        backfaceVisibility: 'hidden',
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/paper-fibers.png)',
        backgroundColor: '#fcf9f2'
      }}
    >
      <SecurityPattern />
      <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 border border-brand-primary/10 rounded-xl pointer-events-none" />

      <div className="z-10">
        <div className="border-b border-brand-primary/15 pb-2 flex justify-between items-baseline">
          <span className="text-[8px] font-black text-brand-primary uppercase tracking-wider">Saberes Culturales e Identidad</span>
          <span className="text-[7.5px] font-mono text-brand-text-muted">Pág 3</span>
        </div>

        <p className="text-[8.5px] text-[#9c8468] leading-normal font-bold my-2 pb-1">
          Comprobantes húmedos artesanales otorgados en talleres comunales de alfarería e ingredientes nativos precolombinos.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-2">
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
    </div>,

    // PAGE 4: LIVE BOOKINGS
    <div 
      key="bookings"
      className="absolute inset-0 h-full w-full rounded-2xl p-6 text-brand-text-dark flex flex-col justify-between overflow-hidden bg-[#fcf9f2] bg-cover bg-center"
      style={{
        backfaceVisibility: 'hidden',
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/paper-fibers.png)',
        backgroundColor: '#fcf9f2'
      }}
    >
      <SecurityPattern />
      <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 border border-brand-primary/10 rounded-xl pointer-events-none" />

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
            <div className="col-span-2 border border-dashed border-[#a89c7d]/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-brand-text-muted my-2 bg-stone-50/50">
              <Lock className="w-6 h-6 mb-1" strokeWidth={2} />
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
    </div>,

    // PAGE 5: BACK COVER
    <div 
      key="back"
      onClick={() => {
        setPage([0, -1]);
        setBookPage(0);
      }}
      className="absolute inset-0 bg-gradient-to-br from-[#6a1f11] to-[#3f0f07] rounded-2xl p-6 text-white flex flex-col justify-between items-center text-center select-none cursor-pointer"
      style={{ backfaceVisibility: 'hidden' }}
    >
      <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 border border-amber-300/10 rounded-xl pointer-events-none" />

      <div className="flex flex-col items-center gap-1 mt-2 pointer-events-none z-10">
        <span className="text-[8px] font-black text-amber-200/80 tracking-widest uppercase">REGISTRO</span>
        <h3 className="font-serif text-[16px] font-black tracking-wide text-amber-100">Metricas de Impacto</h3>
        <div className="h-[1px] w-12 bg-amber-200/35 my-1" />
        <p className="text-[10px] text-amber-100/70 max-w-[220px] leading-relaxed font-semibold">
          Tus viajes aportaron valor real y directo a familias Nicaraguenses.
        </p>
      </div>

      <div className="w-[180px] py-3.5 px-4 bg-[#4e140b]/90 rounded-2xl border border-amber-300/10 flex flex-col gap-2 z-10 shadow-inner">
        <div className="flex items-center justify-between text-[9px] text-amber-200/80">
          <span className="font-mono">Mitigación CO2:</span>
          <span className="font-black text-amber-300">{45 + bookings.length * 15}kg CO2</span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-amber-200/80">
          <span className="font-mono">Familias impactadas:</span>
          <span className="font-black text-amber-300">{12 + bookings.length * 4} F.</span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-amber-200/80">
          <span className="font-mono">Sueldos Directos:</span>
          <span className="font-black text-amber-300">${320 + bookings.reduce((s, b) => s + b.totalPrice, 0)} USD</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 pb-2 z-10 pointer-events-none">
        <span className="text-[7.5px] font-sans font-black text-amber-200/40 uppercase tracking-widest">Xolara</span>
        <div className="flex items-center justify-center gap-1 text-[11px] text-amber-300/80">
          <span>⭐⭐⭐⭐★</span>
        </div>
        <span className="text-[8.5px] text-amber-200/60 mt-1 font-black underline decoration-dashed">¡Pulsa para cerrar el Pasaporte!</span>
      </div>
    </div>
  ];

  return (
    <div className="flex flex-col gap-5 pb-24 font-sans select-none overflow-x-hidden min-h-screen">
      
      <StampFilter />

      {/* Header */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-brand-primary" strokeWidth={1.8} />
            <h2 className="font-serif text-2xl font-semibold text-brand-text-dark">Tu Pasaporte</h2>
          </div>
        </div>
        <p className="text-xs text-brand-text-muted leading-relaxed font-bold">
          Desliza para pasar las páginas del pasaporte y certificar tus sellos de impacto real.
        </p>
      </div>

      {/* 3D CAROUSEL CONTAINER */}
      <div className="my-3 flex items-center justify-center relative">

        <div className="relative w-[320px] sm:w-[340px] aspect-[3/4] shadow-2xl rounded-2xl overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1400px',
            backgroundImage: 'url(https://www.transparenttextures.com/patterns/paper-fibers.png)',
            border: '1px solid rgba(160, 63, 40, 0.1)'
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                rotateY: { type: "spring", stiffness: 220, damping: 30 },
                opacity: { duration: 0.25 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_e, info) => {
                if (info.offset.x < -50) paginate(1);
                else if (info.offset.x > 50) paginate(-1);
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                backfaceVisibility: 'hidden'
              }}
            >
              {pages[bookPage]}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Navigation Controls - swipe para navegar; dots indican/saltan página */}
      <div className="flex justify-center items-center gap-3.5 px-5 z-20">
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4, 5].map(pIdx => (
            <button
              key={pIdx}
              onClick={() => {
                const newDirection = pIdx > bookPage ? 1 : -1;
                setPage([pIdx, newDirection]);
                setBookPage(pIdx);
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
      </div>

      {/* Progress Bar */}
      <div className="px-5">
        <div className="p-4 surface-card flex flex-col gap-2">
          <div className="flex justify-between items-baseline text-xs font-semibold text-brand-text-dark">
            <span className="flex items-center gap-1.5 font-sans font-semibold">
              <Award className="w-4 h-4 text-brand-primary" strokeWidth={1.8} />
              Categoría Honorífica en Nicaragua
            </span>
            <span className="text-brand-primary font-mono font-semibold tabular-nums">{milestonePercent}%</span>
          </div>

          <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-primary h-full rounded-full transition-all duration-1000"
              style={{ width: `${milestonePercent}%` }}
            />
          </div>
          
          <p className="text-[10px] text-brand-text-muted leading-tight font-bold mt-0.5">
            ¡Tienes {totalStamps} de 8 sellos recomendados! Completa {Math.max(1, 8 - totalStamps)} experiencias más para desbloquear la insignia de <span className="text-brand-secondary font-black">"Guardián de Tradiciones Chorotegas"</span>.
          </p>
        </div>
      </div>

      {/* Cultural Tips Button */}
      <div className="px-5">
        <button
          onClick={() => setIsTipsOpen(true)}
          className="w-full bg-[#3a674f] hover:bg-[#325843] text-stone-100 p-4 rounded-2xl shadow-sm text-left flex items-center justify-between transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group cursor-pointer"
        >
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
                Aprende modismos y etiqueta local
              </span>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform z-10" />
        </button>
      </div>

      {/* Cultural Tips Popup */}
      {isTipsOpen && (
        <CulturalTipsPopup 
          onClose={() => setIsTipsOpen(false)}
          config={config}
        />
      )}

      {/* Stamp Detail Modal */}
      {selectedStamp && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStamp(null)}
        >
          <div
            className="glass-chrome rounded-[var(--radius-sheet)] p-6 max-w-sm w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-lg font-semibold text-brand-primary">{selectedStamp.title}</h3>
              <button 
                onClick={() => setSelectedStamp(null)}
                className="text-brand-text-muted hover:text-brand-primary"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-brand-text-dark leading-relaxed">
              {selectedStamp.desc}
            </p>
            <div className="mt-4 pt-4 border-t border-black/8">
              <span className="text-xs font-semibold text-brand-text-muted uppercase tracking-wide">
                {selectedStamp.category} • {selectedStamp.date}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
