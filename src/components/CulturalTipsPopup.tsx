import React, { useState } from 'react';
import { X, Sparkles, BookOpen, AlertCircle, Compass, CheckCircle2, MessageSquare, Search, Languages } from 'lucide-react';
import { Booking, AppConfig } from '../types';

interface CulturalTipsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  config: AppConfig;
}

export default function CulturalTipsPopup({ isOpen, onClose, bookings, config }: CulturalTipsPopupProps) {
  const [activeSubTab, setActiveSubTab] = useState<'etiquette' | 'context' | 'glossary'>('etiquette');
  const [searchWord, setSearchWord] = useState('');

  if (!isOpen) return null;

  // 1. Analyze Booked Locations to build Context-Aware state flags
  const hasGranada = bookings.some(b => b.experienceId === 'cooking-masterclass') || bookings.some(b => b.experienceTitle.toLowerCase().includes('granada'));
  const hasMasayaCeramics = bookings.some(b => b.experienceId === 'weaving-workshop' || b.experienceTitle.toLowerCase().includes('cerámica') || b.experienceTitle.toLowerCase().includes('juan de oriente'));
  const hasMasayaVolcano = bookings.some(b => b.experienceId === 'market-walk' || b.experienceTitle.toLowerCase().includes('masaya') || b.experienceTitle.toLowerCase().includes('volcán masaya'));
  const hasMatagalpaCoffee = bookings.some(b => b.experienceId === 'coffee-journey' || b.experienceTitle.toLowerCase().includes('café') || b.experienceTitle.toLowerCase().includes('matagalpa'));

  // Calculate total customized regions
  const totalCustomizedRegions = [hasGranada, hasMasayaCeramics, hasMasayaVolcano, hasMatagalpaCoffee].filter(Boolean).length;

  // 2. Dialect translation engine based on config
  const getGreetingText = () => {
    if (config.greetingTone === 'slang') {
      return {
        title: '¡Ideay salvaje! ¿Qué onda?',
        intro: '¡Ponete cómodo pinolero! Aquí tenés la mejor guía comunitaria para que andés al cien por cien y no andés perdido con los chunches.',
        badge: 'Habla Nica Barrio'
      };
    } else if (config.greetingTone === 'formal') {
      return {
        title: 'Estimado Viajero, un Placer',
        intro: 'Le damos la más cordial bienvenida a las directrices de etiqueta soberana de Nicaragua. Confiamos en que estas normas bilaterales guiarán su diplomacia cultural.',
        badge: 'Cortesía Sostenible'
      };
    } else {
      return {
        title: 'Bienvenidos a Tierra de Lagos',
        intro: 'Bienvenidos, exploradores autónomos de la tierra de Rubén Darío. Que las brisas de la nebliselva y los cantos alfareros inspiren su respeto comunal.',
        badge: 'Tono Costumbrista'
      };
    }
  };

  const greetings = getGreetingText();

  // 3. Slang glossary database
  const slangDatabase = [
    { word: 'Deacachimba', definition: 'Extremadamente excelente, genial o súper bueno.', example: '¡El taller de barro precolombino está deacachimba!' },
    { word: '¡Ideay!', definition: 'Expresión de asombro o exclamación similar a "¿Cómo es posible?" o "¿Y entonces?".', example: '¿Ideay, chavalo? ¡No te olvidés de regar el comal de leña!' },
    { word: 'Chunche', definition: 'Cualquier objeto, artefacto o herramienta de nombre desconocido.', example: 'Pasame ese chunche de madera para bruñir la vasija.' },
    { word: 'Pinolero', definition: 'Apodo patriótico y de orgullo para el nicaragüense, derivado del Pinol (bebida de maíz tostado).', example: 'Trabajamos con orgullo pinolero en las colinas de Selva Negra.' },
    { word: 'Salvaje', definition: 'Excelente, magnífico, indómito.', example: 'El atardecer en el cráter de Masaya estuvo salvaje.' },
    { word: 'Chavalo / Chavala', definition: 'Niño, adolescente o persona joven.', example: 'La cooperativa financia la educación artesanal de los chavalos del pueblo.' },
    { word: 'Chele / Chela', definition: 'Persona de piel clara, extranjeros en general, dicho con profundo cariño.', example: 'Pase adelante, chele, tómese un fresco de cacao helado.' },
    { word: 'Gato / Gata', definition: 'Algo muy bonito o estéticamente llamativo. En el campo, también inteligente y ágil.', example: 'Esa vasija chorotega te quedó bien gata.' },
    { word: 'Rosquillas', definition: 'Galleta de maíz horneada en horno de barro tradicional de Somoto o Sebaco.', example: 'Mojá la rosquilla de maíz en la taza de café caliente.' },
  ];

  const filteredSlang = slangDatabase.filter(item => 
    item.word.toLowerCase().includes(searchWord.toLowerCase()) || 
    item.definition.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="glass-chrome w-full max-w-sm rounded-[var(--radius-sheet)] flex flex-col max-h-[85vh] relative overflow-hidden animate-scale-in text-brand-text-dark font-sans">

        {/* Clay header banner */}
        <div className="bg-brand-primary text-stone-100 p-5 relative flex-shrink-0">
          <div className="absolute top-2.5 right-6 text-[8px] tracking-[0.25em] font-mono opacity-50 uppercase">CONSEJERO SOBERANO</div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-90"
            title="Cerrar"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-center gap-2 mt-1">
            <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
            <h3 className="font-serif text-lg font-black tracking-tight text-white leading-none">Consejos Culturales Nicas</h3>
          </div>
          
          <p className="text-[10px] text-amber-100/80 mt-1 leading-relaxed font-semibold">
            Consejos de cortesía, respeto indígena y etiqueta comunal recomendados para tu estadía activa.
          </p>
        </div>

        {/* Dynamic sub tab bar selector */}
        <div className="flex border-b border-black/5 bg-surface/70 select-none text-[11px] font-semibold uppercase text-brand-text-muted flex-shrink-0">
          <button 
            onClick={() => setActiveSubTab('etiquette')} 
            className={`flex-1 py-3 text-center border-b-2 transition-all ${activeSubTab === 'etiquette' ? 'border-brand-primary text-brand-primary font-black bg-stone-50/50' : 'border-transparent hover:text-brand-text-dark'}`}
          >
            Pautas Oro
          </button>
          <button 
            onClick={() => setActiveSubTab('context')} 
            className={`flex-1 py-3 text-center border-b-2 transition-all relative ${activeSubTab === 'context' ? 'border-brand-primary text-brand-primary font-black bg-stone-50/50' : 'border-transparent hover:text-brand-text-dark'}`}
          >
            Tus Consejos
            {totalCustomizedRegions > 0 && (
              <span className="absolute top-1/2 -translate-y-1/2 right-1 lg:right-2.5 w-2 h-2 rounded-full bg-brand-secondary" />
            )}
          </button>
          <button 
            onClick={() => setActiveSubTab('glossary')} 
            className={`flex-1 py-3 text-center border-b-2 transition-all ${activeSubTab === 'glossary' ? 'border-brand-primary text-brand-primary font-black bg-stone-50/50' : 'border-transparent hover:text-brand-text-dark'}`}
          >
            Glosario Nica
          </button>
        </div>

        {/* POPUP VIEWPORT SCROLLER */}
        <div className="overflow-y-auto p-5 space-y-4 flex-grow hide-scrollbar">

          {/* TAB 1: PAUTAS DE ORO (GENERAL ETIQUETTE) */}
          {activeSubTab === 'etiquette' && (
            <div className="space-y-4 animate-fade-in text-[11px]">
              
              {/* Dialect translation hello banner */}
              <div className="bg-surface-2 rounded-[var(--radius-card)] p-4 border border-black/5">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-serif text-sm font-semibold text-brand-primary">{greetings.title}</span>
                  <span className="text-[7px] font-mono bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold">{greetings.badge}</span>
                </div>
                <p className="text-[#654e46] leading-relaxed font-bold italic">
                  {greetings.intro}
                </p>
              </div>

              {/* General Tips focus cards */}
              <div className="space-y-3">
                {/* Rule 1: Greetings */}
                {config.tipFocus.includes('language') && (
                  <div className="p-3 bg-surface border border-black/5 rounded-xl flex gap-2.5">
                    <span className="text-lg">👋</span>
                    <div>
                      <span className="block font-black text-brand-text-dark text-xs mb-0.5">El Saludo es Sagrado</span>
                      <span className="text-[#55423d] leading-relaxed block font-semibold text-[10px]">
                        Siempre salude al entrar a un hogar rural, tienda o taller con un cálido *¡Buenos días!* o *¡Buenas tardes!*. La amabilidad es el pasaporte más valioso de Nicaragua.
                      </span>
                    </div>
                  </div>
                )}

                {/* Rule 2: Photography / Permissions */}
                <div className="p-3 bg-[#fff] border border-brand-primary/5 rounded-xl flex gap-2.5">
                  <span className="text-lg">📸</span>
                  <div>
                    <span className="block font-black text-brand-text-dark text-xs mb-0.5">Preguntar Antes de Fotografiar</span>
                    <span className="text-[#55423d] leading-relaxed block font-semibold text-[10px]">
                      Las comunidades indígenas chorotegas son herederas de tradiciones centenarias. Pida permiso cortésmente antes de tomar fotos de niños o de sus altares familiares de barro.
                    </span>
                  </div>
                </div>

                {/* Rule 3: Economic sovereignty */}
                {config.tipFocus.includes('crafts') && (
                  <div className="p-3 bg-surface border border-black/5 rounded-xl flex gap-2.5">
                    <span className="text-lg">🤝</span>
                    <div>
                      <span className="block font-black text-brand-text-dark text-xs mb-0.5">Comercio Justo y No Regateo Drástico</span>
                      <span className="text-[#55423d] leading-relaxed block font-semibold text-[10px]">
                        Nuestros artesanos reciben el 100% del pago por sus talleres. Evite regatear excesivamente sobre precios fijos del turismo solidario, pues representa su sustento familiar directo.
                      </span>
                    </div>
                  </div>
                )}

                {/* Rule 4: Ecology in nature */}
                {config.tipFocus.includes('nature') && (
                  <div className="p-3 bg-surface border border-black/5 rounded-xl flex gap-2.5">
                    <span className="text-lg">🍃</span>
                    <div>
                      <span className="block font-black text-brand-text-dark text-xs mb-0.5">Soberanía de los Bosques</span>
                      <span className="text-[#55423d] leading-relaxed block font-semibold text-[10px]">
                        No retire piedras volcánicas, orquídeas nativas ni semillas forestales en reservas biológicas. Se considera una desconsideración hacia los guardabosques y espíritus protectores rurales.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONTEXT-AWARE ADVICE BASED ON ACTIVE RESERVATIONS */}
          {activeSubTab === 'context' && (
            <div className="space-y-4 animate-fade-in text-[11.5px]">
              
              {/* Context Summary Banner */}
              <div className="p-3 bg-brand-secondary/5 rounded-2xl border border-brand-secondary/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-brand-secondary" />
                  <div>
                    <span className="text-xs font-black text-brand-text-dark block">Análisis de Ubicación</span>
                    <span className="text-[9px] text-[#4a5840] font-bold block mt-0.5">
                      {totalCustomizedRegions > 0 
                        ? `✓ Personalizado para tus ${totalCustomizedRegions} zonas reservadas` 
                        : 'Mostrando consejos generales (sin reservas registradas)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC CARDS CONDITIONAL TO USERS BOOKINGS */}
              <div className="space-y-3">
                
                {/* 2.1 GRANADA REGION ADVICE */}
                {hasGranada ? (
                  <div className="p-3.5 bg-white border-l-4 border-amber-600 rounded-r-2xl shadow-xs flex flex-col gap-1">
                    <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🍽️</span> GRANADA (Cocina Colonial)
                    </span>
                    <span className="font-bold text-xs text-brand-text-dark mt-1">
                      El Vigorón sobre Hojas de Chagüite y el Respeto Histórico
                    </span>
                    <p className="text-[#55423c] leading-relaxed text-[10px] mt-1 font-semibold">
                      • **Etiqueta:** El Vigorón tradicional se sirve exclusivamente sobre hojas de *chagüite* (plátano silvestre). Es de cortesía comerlo directamente con las manos o un madero rústico.
                      <br />• **Cuidado Culinario:** Nunca revuelvas groseramente el repollo en la ensalada; Doña Auxiliadora lo adereza con mimosa naranja agria para que mantenga un frescor crujiente impecable.
                      <br />• **Conservación:** Granada es una de las urbes coloniales vivas más antiguas. Escucha con atención respetuosa los mitos locales sobre coches de caballos.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-100 border border-dashed border-stone-300 rounded-2xl opacity-50 flex items-center gap-2">
                    <span className="text-sm">🔒</span>
                    <span className="text-[9px] font-bold text-stone-500">
                      Reserva el taller culinario en Granada para desbloquear consejos gastronómicos exclusivos.
                    </span>
                  </div>
                )}

                {/* 2.2 MASAYA CLAY CERAMICS ADVICE */}
                {hasMasayaCeramics ? (
                  <div className="p-3.5 bg-white border-l-4 border-brand-primary rounded-r-2xl shadow-xs flex flex-col gap-1">
                    <span className="text-[11px] font-black text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎨</span> SAN JUAN DE ORIENTE (Alfarería)
                    </span>
                    <span className="font-bold text-xs text-brand-text-dark mt-1">
                      El Pulido Sagrado Chorotega y Barro Volcánico
                    </span>
                    <p className="text-[#55423c] leading-relaxed text-[10px] mt-1 font-semibold">
                      • **Etiqueta:** El modelado de vasijas es un oficio espiritual heredado por pintores chorotegas. Si el maestro Néstor te invita a presionar el barro en el torno de pie, hazlo sin prisa, reconociendo el peso de la arcilla.
                      <br />• **Esfuerzo de Pulido:** Para lograr un brillo satinado se utilizan piedras redondas pulidas de río. El frotado paciente es un arte de meditación rural.
                      <br />• **Lodo y Suciedad:** ¡No temas mancharte! En el pueblo de barro, tener las manos manchadas de óxido mineral natural es considerado un galardón de honor.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-100 border border-dashed border-stone-300 rounded-2xl opacity-50 flex items-center gap-2">
                    <span className="text-sm">🔒</span>
                    <span className="text-[9px] font-bold text-stone-500">
                      Reserva cerámica ancestral en Masaya para desbloquear consejos de herencia precolombina.
                    </span>
                  </div>
                )}

                {/* 2.3 VOLCANO MASAYA TREK ADVICE */}
                {hasMasayaVolcano ? (
                  <div className="p-3.5 bg-white border-l-4 border-blue-600 rounded-r-2xl shadow-xs flex flex-col gap-1">
                    <span className="text-[11px] font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🌋</span> VOLCÁN MASAYA (Geología)
                    </span>
                    <span className="font-bold text-xs text-brand-text-dark mt-1">
                      El Cráter Santiago, Leyendas de Azufre y Reforestación
                    </span>
                    <p className="text-[#55423c] leading-relaxed text-[10px] mt-1 font-semibold">
                      • **Etiqueta Forestal:** Al plantar tu brote protector de madero negro con los guardabosques de Masaya, colócale tierra húmeda de forma firme y despídete con un deseo de conservación.
                      <br />• **Mitos Antiguos:** La etnia náhuatl creía que una anciana hechicera vivía en el cráter de fuego. No hagas bromas ruidosas o gritos en el mirador; respeta la solemnidad de la "Boca del Infierno".
                      <br />• **Medición de Gases:** Si el viento cambia arrastrando gases de azufre, coléctate pacientemente tu mascarilla sin entrar en pánico. El bosque se renueva de forma natural.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-100 border border-dashed border-stone-300 rounded-2xl opacity-50 flex items-center gap-2">
                    <span className="text-sm">🔒</span>
                    <span className="text-[9px] font-bold text-stone-500">
                      Reserva senderismo en Volcán Masaya para ver leyendas del guardabosques y reforestación.
                    </span>
                  </div>
                )}

                {/* 2.4 MATAGALPA COFFEE RURAL REGION ADVICE */}
                {hasMatagalpaCoffee ? (
                  <div className="p-3.5 bg-white border-l-4 border-brand-secondary rounded-r-2xl shadow-xs flex flex-col gap-1">
                    <span className="text-[11px] font-black text-brand-secondary uppercase tracking-wider flex items-center gap-1.5">
                      <span>☕</span> MATAGALPA (Camino del Café)
                    </span>
                    <span className="font-bold text-xs text-brand-text-dark mt-1">
                      Ruralidad, Café de Sombra y la Hospitalidad del Norte
                    </span>
                    <p className="text-[#55423c] leading-relaxed text-[10px] mt-1 font-semibold">
                      • **Etiqueta del Pocillo:** Si una familia campesina caficultora te ofrece café colado en un comal o pocillo, **acéptalo siempre**. Aún a mediodía, un pocillo caliente simboliza confianza familiar inestimable. Rechazarlo puede herir el orgullo local.
                      <br />• **Cosecha de Cerezas:** Recolecta solo las cerezas rojas maduras ("sangre de toro"). Desprender granos verdes debilita la rama para futuras cosechas comunales de café de altura.
                      <br />• **Conversación Justa:** Preguntar por sus proyectos cooperativos comunitarios (viveros, escuelas campesinas) promueve la hermandad auténtica.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-100 border border-dashed border-stone-300 rounded-2xl opacity-50 flex items-center gap-2">
                    <span className="text-sm">🔒</span>
                    <span className="text-[9px] font-bold text-stone-500">
                      Reserva la ruta del café en Matagalpa para ver la cortesía agraria de montaña.
                    </span>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 3: DICTIONARY / GLOSSARY OF POPULAR WORDS */}
          {activeSubTab === 'glossary' && (
            <div className="space-y-3 animate-fade-in text-[10.5px]">
              
              {/* Search filter input */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  placeholder="Buscar modismos nicaragüenses..." 
                  className="w-full bg-surface border border-black/8 rounded-xl py-2 pl-9 pr-3 text-[11px] focus:outline-none focus:border-brand-primary"
                  autoComplete="off"
                />
              </div>

              {/* Glossary List */}
              <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                {filteredSlang.length > 0 ? (
                  filteredSlang.map((item, index) => (
                    <div key={index} className="p-3 bg-surface border border-black/5 rounded-xl shadow-ios">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-brand-primary font-mono text-[11px] font-black">{item.word}</span>
                        <span className="text-[7.5px] text-[#805600] font-black tracking-wider uppercase bg-[#805600]/10 px-1.5 py-0.5 rounded">Voz Popular</span>
                      </div>
                      <p className="text-[#3c3533] leading-relaxed font-semibold">
                        {item.definition}
                      </p>
                      <p className="text-[9px] text-[#5c7567] bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100/50 italic mt-1.5 font-bold">
                        Ejemplo: "{item.example}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-brand-text-muted">
                    <Languages className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <span>No se encontraron expresiones con "{searchWord}"</span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footnote stamp verification */}
        <div className="p-3 bg-surface-2/60 border-t border-black/5 flex items-center justify-between text-[8px] text-brand-text-muted font-semibold flex-shrink-0">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary" />
            Auditado por Cooperativa Agrícola
          </span>
          <span className="font-mono text-stone-400">Ver: XLR-COOP-26</span>
        </div>

      </div>
    </div>
  );
}
