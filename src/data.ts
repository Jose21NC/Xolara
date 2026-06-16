import { Experience } from './types';

export const EXPERIENCES_DATA: Experience[] = [
  {
    id: 'coffee-journey',
    title: 'Ruta del Café Orgánico en Matagalpa',
    location: 'Matagalpa, Selva Negra',
    country: 'Nicaragua',
    category: 'Agriculture',
    duration: '5 Horas',
    durationHours: 5,
    groupSize: 'Máx 6 personas',
    rating: 4.95,
    reviewsCount: 142,
    pricePerPerson: 55,
    lat: 12.9224,
    lng: -85.9160,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    aboutCommunity: 'Ubicada en las neblinosas montañas del norte de Nicaragua, la cooperativa local de caficultores de Matagalpa ha implementado técnicas agroecológicas que protegen la biodiversidad. Esta inmersión te conecta directamente con las familias cosechadoras, permitiéndote recorrer senderos boscosos, recolectar granos maduros bajo sombra de árboles nativos y aprender de sus esfuerzos de conservación.',
    whatYouWillDo: [
      {
        title: 'Recolección Sostenible',
        desc: 'Aprende a identificar y recolectar manualmente solo las cerezas rojas maduras de café Arábica bajo la guía de un productor local.'
      },
      {
        title: 'Despulpe y Secado al Sol',
        desc: 'Ayuda en el beneficio húmedo artesanal y extiende los granos húmedos en los patios tradicionales para su deshidratación natural.'
      },
      {
        title: 'Tueste sobre Fogón de Leña',
        desc: 'Descubre el legendario secreto de tostado nicaragüense usando comales de barro y disfruta de una taza fresca con rosquillas de la zona.'
      }
    ],
    authenticityScore: 99,
    communityImpactText: 'Tu visita apoya financieramente a 6 familias caficultoras organizadas, financiando directamente la transición a abonos ecológicos y la protección del hábitat de aves migratorias.',
    communityImpactBullets: [
      'El 20% de los fondos se destina al vivero comunitario de reforestación.',
      'Genera ingresos directos a las cooperativas lideradas por mujeres.',
      'Financia kits de paneles solares para hogares rurales sin conexión eléctrica.'
    ],
    howToGetThere: {
      title: 'Finca Ecológica La Hermandad',
      description: 'Km 142, Carretera Matagalpa - El Tuma La Dalia, Nicaragua.',
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDjeJGKemRBFLeeV0zn9kCGtAX902VHlFnQ5WtyEEK6-IbcoOxf3KwMmHNPowhAVv7CRDwcAUuA7uPqc_F3xDMHhTmRbD3TRl9EdVN9cE5lTAU_Ec8_QJ7vurEpSPv81z9_MO80OO2Q7g5yZBdiOINJghCzAet1jRb3ez2FCBLxLZg54UqpfwTxU8oMqgHnTqH9cXaH-L-5ElQVwdcs6fUE5T6RABtQJythUUp4f5IXiNHcZbujsAIW_2he3Rs73x5v6KWplENqad'
    },
    tags: ['Matagalpa', 'Café', 'Sostenibilidad'],
    galleryImages: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'weaving-workshop',
    title: 'Cerámica Ancestral de San Juan de Oriente',
    location: 'San Juan de Oriente, Masaya',
    country: 'Nicaragua',
    category: 'Crafts',
    duration: '4 Horas',
    durationHours: 4,
    groupSize: 'Máx 5 personas',
    rating: 4.88,
    reviewsCount: 96,
    pricePerPerson: 35,
    lat: 11.9056,
    lng: -86.0743,
    image: 'https://images.unsplash.com/photo-1565192647048-f997ded879ab?auto=format&fit=crop&q=80&w=600',
    aboutCommunity: 'San Juan de Oriente es un pintoresco pueblo con profundas raíces chorotegas donde casi cada hogar alberga un taller de alfarería. El maestro artesano Néstor te abrirá las puertas de su taller familiar para enseñarte a moldear y pulir el barro empleando pulidores de piedra de río y pigmentos minerales derivados de arcillas volcánicas de la laguna de Apoyo.',
    whatYouWillDo: [
      {
        title: 'Modelado en Torno de Pie',
        desc: 'Siente la elasticidad y textura del barro local mientras utilizas el torno impulsado con el pie para crear tu propia vasija.'
      },
      {
        title: 'Decorado Precolombino con Bruñidor',
        desc: 'Aprende a plasmar grecas decorativas y figuras sagradas imitando antiguos grabados prehispánicos con punta de bambú.'
      },
      {
        title: 'Pulido con Piedras de Río',
        desc: 'Frota repetidamente la pieza con óxidos naturales de hierro para lograr ese brillo satinado idéntico a las reliquias de museo.'
      }
    ],
    authenticityScore: 98,
    communityImpactText: 'Esta experiencia combate la migración rural aportando salarios dignos a creadores locales y financiando talleres gratuitos que traspasan el oficio tradicional a los niños de la comunidad.',
    communityImpactBullets: [
      'Sustenta directamente el taller familiar de Néstor y 4 decoradores independientes.',
      'Preserva iconografía ancestral nicaragüense frente al turismo industrializado.',
      'Folleto explicativo interactivo de regalo del herbario local usado en tintes.'
    ],
    howToGetThere: {
      title: 'Taller de Barro Néstor Guerrero',
      description: 'Detrás de la Iglesia de San Juan de Oriente, Masaya, Nicaragua.',
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDjeJGKemRBFLeeV0zn9kCGtAX902VHlFnQ5WtyEEK6-IbcoOxf3KwMmHNPowhAVv7CRDwcAUuA7uPqc_F3xDMHhTmRbD3TRl9EdVN9cE5lTAU_Ec8_QJ7vurEpSPv81z9_MO80OO2Q7g5yZBdiOINJghCzAet1jRb3ez2FCBLxLZg54UqpfwTxU8oMqgHnTqH9cXaH-L-5ElQVwdcs6fUE5T6RABtQJythUUp4f5IXiNHcZbujsAIW_2he3Rs73x5v6KWplENqad'
    },
    tags: ['Masaya', 'Alfarería', 'Chorotega'],
    galleryImages: [
      'https://images.unsplash.com/photo-1565192647048-f997ded879ab?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'cooking-masterclass',
    title: 'Cocina Colonial y Taller del Vigorón',
    location: 'Granada, El Recreo',
    country: 'Nicaragua',
    category: 'Culinary',
    duration: '3.5 Horas',
    durationHours: 3.5,
    groupSize: 'Máx 8 personas',
    rating: 4.90,
    reviewsCount: 112,
    pricePerPerson: 40,
    lat: 11.9300,
    lng: -85.9560,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    aboutCommunity: 'A orillas del Gran Lago de Nicaragua, la ciudad colonial de Granada alberga grandes secretos gastronómicos. En el patio interior de la Sra. Auxiliadora, aprenderás a preparar el vigorón granadino, el plato estrella nicaragüense envuelto tradicionalmente en hoja de chagüite (plátano), con ingredientes frescos comprados esa mañana de agricultores ecológicos locales.',
    whatYouWillDo: [
      {
        title: 'Selección de Ingredientes',
        desc: 'Descubre los mercados locales y aprende a elegir la mejor yuca nicaragüense, repollo fresco y miltomate maduro.'
      },
      {
        title: 'Preparación de Ensalada con Chicharrón',
        desc: 'Pica los ingredientes con precisión criolla, marina la ensalada usando vinagre casero y cocina chicharrón crujiente.'
      },
      {
        title: 'Ancestral Cacao en Jícara',
        desc: 'Muele granos de cacao fresco tostado con arroz y canela para batir un tradicional "Fresco de Cacao" artesanal.'
      }
    ],
    authenticityScore: 97,
    communityImpactText: 'Sustenta la red de pequeños agricultores agrícolas de Granada y Carazo, disminuyendo intermediarios de mercado e inyectando un 70% del costo del pasaje al equipo de Sra. Auxiliadora.',
    communityImpactBullets: [
      'Ayuda a 3 distribuidoras rurales de tubérculos y hojas de chagüite.',
      'Financia la compra de fogones eficientes de baja emisión de humo en la comunidad.',
      'Recetas impresas en papel reciclado ecológico para los viajeros.'
    ],
    howToGetThere: {
      title: 'La Cocina de Doña Auxiliadora',
      description: 'Calle La Calzada, esquina opuesta al convento San Francisco, Granada, Nicaragua.',
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDjeJGKemRBFLeeV0zn9kCGtAX902VHlFnQ5WtyEEK6-IbcoOxf3KwMmHNPowhAVv7CRDwcAUuA7uPqc_F3xDMHhTmRbD3TRl9EdVN9cE5lTAU_Ec8_QJ7vurEpSPv81z9_MO80OO2Q7g5yZBdiOINJghCzAet1jRb3ez2FCBLxLZg54UqpfwTxU8oMqgHnTqH9cXaH-L-5ElQVwdcs6fUE5T6RABtQJythUUp4f5IXiNHcZbujsAIW_2he3Rs73x5v6KWplENqad'
    },
    tags: ['Granada', 'Gastronomía', 'Tradición'],
    galleryImages: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'market-walk',
    title: 'Senderismo Eco-Volcánico y Reforestación',
    location: 'Volcán Masaya',
    country: 'Nicaragua',
    category: 'Nature',
    duration: '4.5 Horas',
    durationHours: 4.5,
    groupSize: 'Máx 12 personas',
    rating: 4.85,
    reviewsCount: 89,
    pricePerPerson: 48,
    lat: 11.9839,
    lng: -86.1608,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
    aboutCommunity: 'El Volcán Masaya es una de las grandes maravillas geológicas de Centroamérica, conocido históricamente como "La Boca del Infierno". Junto a guardabosques de las comunidades aledañas, explorarás los campos de lava petrificada y aportarás tu grano de arena plantando un árbol forestal nativo para mitigar las emisiones de gases de azufre e impulsar el microclima regional.',
    whatYouWillDo: [
      {
        title: 'Trek de los Senderos de Lava',
        desc: 'Camina entre formaciones volcánicas milenarias explicadas por guardabosques certificados del parque nacional.'
      },
      {
        title: 'Reforestación Voluntaria',
        desc: 'Planta brotes de madero negro o guayacán en las faldas fértiles protegidas para mitigar el desgaste de suelos.'
      },
      {
        title: 'Cráter Santiago de Noche o Día',
        desc: 'Observa la fumarola constante del cráter activo, examinando minerales de azufre expelidos de la tierra.'
      }
    ],
    authenticityScore: 96,
    communityImpactText: 'Sustenta la labor de la Asociación de Guardaparques Locales y apoya financieramente los viveros municipales de conservación del departamento de Masaya.',
    communityImpactBullets: [
      'Impulsa empleos de conservación ambiental alternativa para juventud local.',
      'Sponsoriza la reforestación activa de 10 árboles nativos por cada viajero.',
      'Contribuya al equipamiento de medición sísmico-gaseoso escolar regional.'
    ],
    howToGetThere: {
      title: 'Vivero Guardas Volcán Masaya',
      description: 'Km 23, Carretera Masaya, Nicaragua.',
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDjeJGKemRBFLeeV0zn9kCGtAX902VHlFnQ5WtyEEK6-IbcoOxf3KwMmHNPowhAVv7CRDwcAUuA7uPqc_F3xDMHhTmRbD3TRl9EdVN9cE5lTAU_Ec8_QJ7vurEpSPv81z9_MO80OO2Q7g5yZBdiOINJghCzAet1jRb3ez2FCBLxLZg54UqpfwTxU8oMqgHnTqH9cXaH-L-5ElQVwdcs6fUE5T6RABtQJythUUp4f5IXiNHcZbujsAIW_2he3Rs73x5v6KWplENqad'
    },
    tags: ['Masaya', 'Aventura', 'Conservación'],
    galleryImages: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600'
    ]
  }
];

export const MAP_PINS = [
  {
    id: 'weaving-workshop',
    top: '52%',
    left: '42%',
    icon: 'palette',
    color: '#a03f28',
    title: 'Cerámica Masaya'
  },
  {
    id: 'coffee-journey',
    top: '25%',
    left: '52%',
    icon: 'park',
    color: '#3a674f',
    title: 'Café Matagalpa'
  },
  {
    id: 'cooking-masterclass',
    top: '65%',
    left: '55%',
    icon: 'restaurant',
    color: '#805600',
    title: 'Vigorón Granada'
  },
  {
    id: 'market-walk',
    top: '42%',
    left: '35%',
    icon: 'mountain',
    color: '#1a4e7a',
    title: 'Volcán Masaya Trek'
  }
];

export const RECENT_PASSPORT_STAMPS = [
  {
    id: 'p1',
    title: 'Volcán Mombacho',
    category: 'Nature',
    date: 'Mayo 2026',
    iconType: 'mountain',
    color: '#3a674f'
  },
  {
    id: 'p2',
    title: 'Granada Gastronómico',
    category: 'Culinary',
    date: 'Abril 2026',
    iconType: 'utensils',
    color: '#805600'
  },
  {
    id: 'p3',
    title: 'Cerámica Masaya',
    category: 'Crafts',
    date: 'Marzo 2026',
    iconType: 'palette',
    color: '#a03f28'
  }
];
