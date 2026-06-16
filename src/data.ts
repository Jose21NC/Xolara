import { Experience } from './types';

export const EXPERIENCES_DATA: Experience[] = [
  {
    id: 'coffee-journey',
    title: 'Coffee Journey in the Sierra',
    location: 'Sierra Nevada Mountains',
    country: 'Colombia',
    category: 'Agriculture',
    duration: '6 Hours',
    durationHours: 6,
    groupSize: 'Max 6 people',
    rating: 4.9,
    reviewsCount: 120,
    pricePerPerson: 90,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtzU-FU9_WLXeFAP5hVNH54MFFrNi4YahAw6GzAc8VJqOYf1rGyTZQJpJCeoMCLEyoh7zKXV2Gz3pfev5G6nSkrQiECnZy0_gVEdl_yYgx0sumgxGQ5IDx5TU3HvKvuxUul3ASl9Pju2oMuUrI1WvVJjMo1flJh1JZhy3vwt8kJ5RhcBfuMBRTpjBWGhWHZxSymh40qe8UcI5sJdG4dFH1AOaoCBltsUcnpy9Bj4zbpHULnBwA0RxgEZnDti-OM5XmncihwIbp2sRU',
    aboutCommunity: 'Nestled in the misty highlands, the Arhuaco community has cultivated coffee for generations, blending traditional ecological knowledge with sustainable practices. This journey offers a rare window into their daily lives, where every bean is handpicked with reverence for the earth. You\'ll be welcomed by local farmers who will share their ancestral stories and deep-rooted connection to the land.',
    whatYouWillDo: [
      {
        title: 'Morning Harvesting',
        desc: 'Join families in the fields to learn the delicate art of selecting only the ripest red cherries.'
      },
      {
        title: 'Traditional Processing',
        desc: 'Help wash and sun-dry the beans on extensive wooden patios using centuries-old methods.'
      },
      {
        title: 'Roasting & Tasting',
        desc: 'Experience the roasting process over an open fire and enjoy a tasting session guided by a local expert.'
      }
    ],
    authenticityScore: 98,
    communityImpactText: 'Your visit directly supports 4 local families involved in artisanal coffee production, helping preserve their traditional harvesting methods.',
    communityImpactBullets: [
      '15% of fee supports local reforestation efforts.',
      'Directly employs 4 families in the Sierra region.',
      'Funds agricultural workshops for village youth.'
    ],
    howToGetThere: {
      title: 'Finca El Recuerdo',
      description: 'Km 12, Via Principal, Sierra Norte.',
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDjeJGKemRBFLeeV0zn9kCGtAX902VHlFnQ5WtyEEK6-IbcoOxf3KwMmHNPowhAVv7CRDwcAUuA7uPqc_F3xDMHhTmRbD3TRl9EdVN9cE5lTAU_Ec8_QJ7vurEpSPv81z9_MO80OO2Q7g5yZBdiOINJghCzAet1jRb3ez2FCBLxLZg54UqpfwTxU8oMqgHnTqH9cXaH-L-5ElQVwdcs6fUE5T6RABtQJythUUp4f5IXiNHcZbujsAIW_2he3Rs73x5v6KWplENqad'
    },
    tags: ['Agriculture', 'Hands-on'],
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtzU-FU9_WLXeFAP5hVNH54MFFrNi4YahAw6GzAc8VJqOYf1rGyTZQJpJCeoMCLEyoh7zKXV2Gz3pfev5G6nSkrQiECnZy0_gVEdl_yYgx0sumgxGQ5IDx5TU3HvKvuxUul3ASl9Pju2oMuUrI1WvVJjMo1flJh1JZhy3vwt8kJ5RhcBfuMBRTpjBWGhWHZxSymh40qe8UcI5sJdG4dFH1AOaoCBltsUcnpy9Bj4zbpHULnBwA0RxgEZnDti-OM5XmncihwIbp2sRU',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKqgWhFqV2nOFrRDu8meo2L0beLkNHFR4AO-3APdmSdd0GHLMekgOLR7rLciNKB3BXWUMPJUjWTamb-whldckmhIDYPUnfINQvnR8A_NMP5JEZrFXva1BckuOdJGNVsM9slzu3mflJolhxSsTkbFnNIu7uCp34JwbdJO4Tr6qKiEQu0R3G6P7JmkpjfFYrEU4us0MsUyuHhKAVdAaidhqbabbKMpWJ6QJxH-ZemDTWFZMPUZ7nwkM2qf104i8370dsEv7orxdlgOwP',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnKDWnnceBQJwxv9-ipXfWtXnL_2UkzXhpc7FwKNOHWCJ_dR6OuXiIIPs-E3bJLlIFaWgKUZ8l8vapcpA5RNqms3b4HaqTeYheBrlnWzjV6SDpd1dceee-wfrKYm3vA65wJZP2oOzeMim-yBo2WL76IF8r5ahATbLwmtF0qJsieikdFclDHx9Jj7Q7IyAWHdeJ8cV0tJUcpSDJxSPZCIRlt3I16DvVDhW8AQYf71IdGCKzRfxxBeQSdothkYyS36BHjapGK6bwr6be'
    ]
  },
  {
    id: 'weaving-workshop',
    title: 'Traditional Weaving Workshop',
    location: 'Oaxaca',
    country: 'Mexico',
    category: 'Crafts',
    duration: '4 Hours',
    durationHours: 4,
    groupSize: 'Max 4 people',
    rating: 4.9,
    reviewsCount: 88,
    pricePerPerson: 45,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnKDWnnceBQJwxv9-ipXfWtXnL_2UkzXhpc7FwKNOHWCJ_dR6OuXiIIPs-E3bJLlIFaWgKUZ8l8vapcpA5RNqms3b4HaqTeYheBrlnWzjV6SDpd1dceee-wfrKYm3vA65wJZP2oOzeMim-yBo2WL76IF8r5ahATbLwmtF0qJsieikdFclDHx9Jj7Q7IyAWHdeJ8cV0tJUcpSDJxSPZCIRlt3I16DvVDhW8AQYf71IdGCKzRfxxBeQSdothkYyS36BHjapGK6bwr6be',
    aboutCommunity: 'Join Master artisan Juana and her family in Teotitlán del Valle, a historical village famous for its hand-woven wool rugs. This region uses natural dyes sourced from local flora like cochineal, wild marigolds, and pecan leaves. Learn how traditional Zapotec patterns tell the mythological stories of solar cycles and seasonal rhythms.',
    whatYouWillDo: [
      {
        title: 'Natural Dye Extraction',
        desc: 'Grind insects and leaves on stone metates to brew dynamic dye colors including rich scarlet and gold.'
      },
      {
        title: 'Loom Setup',
        desc: 'Experience the tension-led backstrap loom alignment, passing raw carded wool through the warp.'
      },
      {
        title: 'Shuttle Weaving',
        desc: 'Learn standard counting geometries to weave your own mini-rug with traditional heritage motifs.'
      }
    ],
    authenticityScore: 99,
    communityImpactText: 'Juana\'s workshop directly sustains custom co-operative weaving techniques, empowering 6 Zapotec master artisans and their families with circular wage growth.',
    communityImpactBullets: [
      '20% goes directly to women-led weaver unions.',
      'Sustains cochineal production farms locally.',
      'Keeps pre-Hispanic Zapotec loom crafts alive with modern design.'
    ],
    howToGetThere: {
      title: 'Taller de Juana',
      description: 'Calle Hidalgo 45, Teotitlán del Valle, Oaxaca.',
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDjeJGKemRBFLeeV0zn9kCGtAX902VHlFnQ5WtyEEK6-IbcoOxf3KwMmHNPowhAVv7CRDwcAUuA7uPqc_F3xDMHhTmRbD3TRl9EdVN9cE5lTAU_Ec8_QJ7vurEpSPv81z9_MO80OO2Q7g5yZBdiOINJghCzAet1jRb3ez2FCBLxLZg54UqpfwTxU8oMqgHnTqH9cXaH-L-5ElQVwdcs6fUE5T6RABtQJythUUp4f5IXiNHcZbujsAIW_2he3Rs73x5v6KWplENqad'
    },
    tags: ['Crafts', 'Heritage'],
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnKDWnnceBQJwxv9-ipXfWtXnL_2UkzXhpc7FwKNOHWCJ_dR6OuXiIIPs-E3bJLlIFaWgKUZ8l8vapcpA5RNqms3b4HaqTeYheBrlnWzjV6SDpd1dceee-wfrKYm3vA65wJZP2oOzeMim-yBo2WL76IF8r5ahATbLwmtF0qJsieikdFclDHx9Jj7Q7IyAWHdeJ8cV0tJUcpSDJxSPZCIRlt3I16DvVDhW8AQYf71IdGCKzRfxxBeQSdothkYyS36BHjapGK6bwr6be',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJml7d2BHBK-4rUKbZKcSQXU7K_0GQihW8YQTgVAFQglkIWprIvZITnIqBbAXepmkxE4cYSxn1owkoEIegtZZgdQ3-ybFVpUVTYitGZOVzNF6VcDmQP4iYTr7R7GwQ-47MZtDrvFCebBOEYO6LKjW-1LxFrXigZBeofb9tR54SZCpe8B1IDoLcIxtbK3zWBjqul27-MJvlHD2c6Ls8ABPcm-ixwlHqVM-M17UhyoOPEYex597rk4yB4yQalYyW3M_YdHZdFO29F0_X'
    ]
  },
  {
    id: 'cooking-masterclass',
    title: 'Ancestral Cooking Masterclass',
    location: 'Cusco',
    country: 'Peru',
    category: 'Culinary',
    duration: '5 Hours',
    durationHours: 5,
    groupSize: 'Max 8 people',
    rating: 4.8,
    reviewsCount: 94,
    pricePerPerson: 60,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO4n-YO_bEBBC0PsemOiD8O1FqmxYUPhhJ7C2qAFg2NurVW6V3LNrYzHugFlnB3h9qikc1k1s0sFZHGOXQnIFNpDooTgKfFwJGtsIb3Fm_0iB7kKZ3bSbC79EIOoDtMiZUoWPrbhqR96IoHO5UTwETcXP_X6laPyfLjiqUB9wl4xsBdFGqLJCh2DfXIAtSZQifrAARSqja-Rilcu26ITM8dnoL8bQIxhEp6REuw_2zqHkzMKqZL884PRtfuBpWkwAfDLqt-NG5faEE',
    aboutCommunity: 'Unveil the mysteries of Andean cuisine beside the Sacred Valley near Cusco. This experience focuses on pre-Inca cooking techniques like "Pachamanca", where ingredients are slowly baked underground in a pit lined with volcanic rocks and layered with aromatic native herbs.',
    whatYouWillDo: [
      {
        title: 'Sacred Valley Market Pick-up',
        desc: 'Gather native potato varieties (out of over 3000 options), colorful corn ears, and fresh huacatay leaves.'
      },
      {
        title: 'Stone Heating & Pit Building',
        desc: 'Help heat volcanic stones in a firewood trench, stacking tubers, marinated meats, and beans carefully within the earth.'
      },
      {
        title: 'The Ancestral Feast',
        desc: 'Unearth the smoked, steamed delicacies, thanking Mother Earth (Pachamama) through ancient celebratory toasts.'
      }
    ],
    authenticityScore: 97,
    communityImpactText: 'Directly supports 3 farming communities supplying heritage corn and potato strains, protecting local agricultural biodiversity.',
    communityImpactBullets: [
      'Empowers traditional farmers preserving raw crop types.',
      '10% of fees fund organic soil management seed kits.',
      'Sponsors free cooking vocational slots for regional youths.'
    ],
    howToGetThere: {
      title: 'Quwa Kitchen',
      description: 'Av. Mollepata 512, San Sebastian, Cusco.',
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDjeJGKemRBFLeeV0zn9kCGtAX902VHlFnQ5WtyEEK6-IbcoOxf3KwMmHNPowhAVv7CRDwcAUuA7uPqc_F3xDMHhTmRbD3TRl9EdVN9cE5lTAU_Ec8_QJ7vurEpSPv81z9_MO80OO2Q7g5yZBdiOINJghCzAet1jRb3ez2FCBLxLZg54UqpfwTxU8oMqgHnTqH9cXaH-L-5ElQVwdcs6fUE5T6RABtQJythUUp4f5IXiNHcZbujsAIW_2he3Rs73x5v6KWplENqad'
    },
    tags: ['Culinary', 'Earth-to-Table'],
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDO4n-YO_bEBBC0PsemOiD8O1FqmxYUPhhJ7C2qAFg2NurVW6V3LNrYzHugFlnB3h9qikc1k1s0sFZHGOXQnIFNpDooTgKfFwJGtsIb3Fm_0iB7kKZ3bSbC79EIOoDtMiZUoWPrbhqR96IoHO5UTwETcXP_X6laPyfLjiqUB9wl4xsBdFGqLJCh2DfXIAtSZQifrAARSqja-Rilcu26ITM8dnoL8bQIxhEp6REuw_2zqHkzMKqZL884PRtfuBpWkwAfDLqt-NG5faEE'
    ]
  },
  {
    id: 'market-walk',
    title: 'Artisan Market Walk',
    location: 'Oaxaca',
    country: 'Mexico',
    category: 'Crafts',
    duration: '3 Hours',
    durationHours: 3,
    groupSize: 'Max 10 people',
    rating: 4.7,
    reviewsCount: 76,
    pricePerPerson: 25,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKqgWhFqV2nOFrRDu8meo2L0beLkNHFR4AO-3APdmSdd0GHLMekgOLR7rLciNKB3BXWUMPJUjWTamb-whldckmhIDYPUnfINQvnR8A_NMP5JEZrFXva1BckuOdJGNVsM9slzu3mflJolhxSsTkbFnNIu7uCp34JwbdJO4Tr6qKiEQu0R3G6P7JmkpjfFYrEU4us0MsUyuHhKAVdAaidhqbabbKMpWJ6QJxH-ZemDTWFZMPUZ7nwkM2qf104i8370dsEv7orxdlgOwP',
    aboutCommunity: 'Wander deep into the central markets of Oaxaca guided by local expert Maria. Sample rich moles, talk with local purveyors, and admire handcrafted textiles and pottery in a vibrant, community-centered atmosphere.',
    whatYouWillDo: [
      {
        title: 'Mole Tasting',
        desc: 'Compare three native mole variations (Negro, Amarillo, Coloradito) in an authentic spice stall.'
      },
      {
        title: 'Meeting Clay Masters',
        desc: 'Meet local barros negros (black clay) potters and observe their signature hand-firing process.'
      }
    ],
    authenticityScore: 95,
    communityImpactText: 'Sustains 5 independent micro-stalls within the historic Mercado de Abastos, ensuring sustainable non-extractive tourism flow.',
    communityImpactBullets: [
      'All tour resources spent supporting native stall owners directly.',
      'Helps maintain small artisanal family guilds in Oaxaca city outskirts.'
    ],
    howToGetThere: {
      title: 'Mercado Organico de Oaxaca',
      description: 'Bustamante 303, Oaxaca Centro.',
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDjeJGKemRBFLeeV0zn9kCGtAX902VHlFnQ5WtyEEK6-IbcoOxf3KwMmHNPowhAVv7CRDwcAUuA7uPqc_F3xDMHhTmRbD3TRl9EdVN9cE5lTAU_Ec8_QJ7vurEpSPv81z9_MO80OO2Q7g5yZBdiOINJghCzAet1jRb3ez2FCBLxLZg54UqpfwTxU8oMqgHnTqH9cXaH-L-5ElQVwdcs6fUE5T6RABtQJythUUp4f5IXiNHcZbujsAIW_2he3Rs73x5v6KWplENqad'
    },
    tags: ['Local', 'Explore'],
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKqgWhFqV2nOFrRDu8meo2L0beLkNHFR4AO-3APdmSdd0GHLMekgOLR7rLciNKB3BXWUMPJUjWTamb-whldckmhIDYPUnfINQvnR8A_NMP5JEZrFXva1BckuOdJGNVsM9slzu3mflJolhxSsTkbFnNIu7uCp34JwbdJO4Tr6qKiEQu0R3G6P7JmkpjfFYrEU4us0MsUyuHhKAVdAaidhqbabbKMpWJ6QJxH-ZemDTWFZMPUZ7nwkM2qf104i8370dsEv7orxdlgOwP'
    ]
  }
];

export const MAP_PINS = [
  {
    id: 'weaving-workshop',
    top: '30%',
    left: '35%',
    icon: 'palette',
    color: '#a03f28',
    title: 'Traditional Weaving'
  },
  {
    id: 'coffee-journey',
    top: '48%',
    left: '60%',
    icon: 'park',
    color: '#3a674f',
    title: 'Coffee Journey'
  },
  {
    id: 'cooking-masterclass',
    top: '65%',
    left: '45%',
    icon: 'restaurant',
    color: '#805600',
    title: 'Ancestral Cooking'
  }
];

export const RECENT_PASSPORT_STAMPS = [
  {
    id: 'p1',
    title: 'Andes Trek',
    category: 'Nature',
    date: 'Oct 2023',
    iconType: 'mountain',
    color: '#3a674f'
  },
  {
    id: 'p2',
    title: 'Oaxaca Culinary',
    category: 'Culinary',
    date: 'Aug 2023',
    iconType: 'utensils',
    color: '#805600'
  },
  {
    id: 'p3',
    title: 'Teotitlán Loom',
    category: 'Crafts',
    date: 'Jun 2023',
    iconType: 'palette',
    color: '#a03f28'
  }
];
