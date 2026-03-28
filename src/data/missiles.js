export const MISSILE_TYPES = {
  // Short Range - Iskander-M (Russia)
  ISKANDER: {
    id: 'iskander',
    name: 'Iskander-M',
    type: 'SRBM',
    class: 'Short-Range Ballistic Missile',
    country: 'Russia',
    speed: { boostPhase: 5.2, midcourse: 4.5, terminal: 0.8 },
    altitude: { max: 50, reentry: 50 },
    range: { min: 400, max: 500 },
    warhead: { yield: 50, type: 'single', count: 1, weight: 480 },
    flightTime: { min: 4, max: 7 },
    accuracy: { CEP: 30 },
    color: '#FFFF44',
    icon: '💥'
  },

  // Intermediate Range - Agni-III (India)
  AGNI: {
    id: 'agni',
    name: 'Agni-III',
    type: 'IRBM',
    class: 'Intermediate-Range Ballistic Missile',
    country: 'India',
    speed: { boostPhase: 7.0, midcourse: 6.0, terminal: 1.0 },
    altitude: { max: 900, reentry: 60 },
    range: { min: 3000, max: 5000 },
    warhead: { yield: 250, type: 'single', count: 1, weight: 1500 },
    flightTime: { min: 10, max: 15 },
    accuracy: { CEP: 40 },
    color: '#FF8800',
    icon: '☄️'
  },

  // Cruise Missile - Tomahawk (USA)
  TOMAHAWK: {
    id: 'tomahawk',
    name: 'BGM-109 Tomahawk',
    type: 'CRUISE',
    class: 'Land-Attack Cruise Missile',
    country: 'United States',
    speed: { cruise: 0.72, terminal: 0 },
    altitude: { cruise: 0.05, terrain: 0.01 },
    range: { min: 1700, max: 2500 },
    warhead: { yield: 0.5, type: 'single', count: 1, weight: 450 },
    flightTime: { min: 90, max: 180 },
    accuracy: { CEP: 10 },
    color: '#44FF44',
    icon: '🏹'
  },

  // Submarine Launched - Trident II D5 (USA/UK)
  TRIDENT: {
    id: 'trident',
    name: 'UGM-133 Trident II',
    type: 'SLBM',
    class: 'Submarine-Launched Ballistic Missile',
    country: 'United States/UK',
    speed: { boostPhase: 6.0, midcourse: 5.5, terminal: 1.0 },
    altitude: { max: 1100, reentry: 70 },
    range: { min: 7400, max: 12000 },
    warhead: { yield: 100, type: 'MIRV', count: 8, weight: 2000 },
    flightTime: { min: 20, max: 30 },
    accuracy: { CEP: 90 },
    color: '#4488FF',
    icon: '🎯'
  },

  // ICBM - Minuteman III (USA)
  MINUTEMAN: {
    id: 'minuteman',
    name: 'LGM-30 Minuteman III',
    type: 'ICBM',
    class: 'Intercontinental Ballistic Missile',
    country: 'United States',
    speed: { boostPhase: 7.0, midcourse: 6.5, terminal: 1.2 },
    altitude: { max: 1100, reentry: 80 },
    range: { min: 13000, max: 13000 },
    warhead: { yield: 300, type: 'MIRV', count: 3, weight: 1100 },
    flightTime: { min: 25, max: 30 },
    accuracy: { CEP: 200 },
    color: '#FF4444',
    icon: '🚀'
  },

  // Hypersonic - Avangard (Russia)
  AVANGARD: {
    id: 'avangard',
    name: 'Avangard',
    type: 'HYPERSONIC',
    class: 'Hypersonic Glide Vehicle',
    country: 'Russia',
    speed: { boostPhase: 6.5, glide: 6.0, terminal: 0.8 },
    altitude: { max: 100, glide: 40, terminal: 25 },
    range: { min: 6000, max: 15000 },
    warhead: { yield: 2000, type: 'single', count: 1, weight: 2000 },
    flightTime: { min: 15, max: 20 },
    accuracy: { CEP: 10 },
    color: '#FF44FF',
    icon: '⚡'
  },

  // ICBM - DF-41 (China)
  DF41: {
    id: 'df41',
    name: 'DF-41',
    type: 'ICBM',
    class: 'Intercontinental Ballistic Missile',
    country: 'China',
    speed: { boostPhase: 7.0, midcourse: 6.5, terminal: 1.5 },
    altitude: { max: 1200, reentry: 100 },
    range: { min: 12000, max: 15000 },
    warhead: { yield: 500, type: 'MIRV', count: 10, weight: 2500 },
    flightTime: { min: 25, max: 30 },
    accuracy: { CEP: 100 },
    color: '#FF6B35',
    icon: '🐉'
  },

  // Heavy ICBM - RS-28 Sarmat (Russia)
  SARMAT: {
    id: 'sarmat',
    name: 'RS-28 Sarmat',
    type: 'ICBM',
    class: 'Heavy Intercontinental Ballistic Missile',
    country: 'Russia',
    speed: { boostPhase: 7.0, midcourse: 6.5, terminal: 1.5 },
    altitude: { max: 1300, reentry: 100 },
    range: { min: 18000, max: 18000 },
    warhead: { yield: 2500, type: 'MIRV', count: 15, weight: 10000 },
    flightTime: { min: 28, max: 35 },
    accuracy: { CEP: 350 },
    color: '#9B2335',
    icon: '🏔️'
  },

  // ICBM - Topol-M/RS-24 (Russia)
  TOPOL: {
    id: 'topol',
    name: 'Topol-M (RS-24)',
    type: 'ICBM',
    class: 'Intercontinental Ballistic Missile',
    country: 'Russia',
    speed: { boostPhase: 7.0, midcourse: 6.0, terminal: 1.4 },
    altitude: { max: 1000, reentry: 80 },
    range: { min: 10500, max: 11000 },
    warhead: { yield: 400, type: 'MIRV', count: 4, weight: 1200 },
    flightTime: { min: 25, max: 30 },
    accuracy: { CEP: 200 },
    color: '#00AA55',
    icon: '🔱'
  },

  // ICBM - DF-5 (China)
  DF5: {
    id: 'df5',
    name: 'DF-5',
    type: 'ICBM',
    class: 'Long-Range Ballistic Missile',
    country: 'China',
    speed: { boostPhase: 6.0, midcourse: 5.5, terminal: 1.0 },
    altitude: { max: 1200, reentry: 80 },
    range: { min: 13000, max: 15500 },
    warhead: { yield: 4000, type: 'single', count: 1, weight: 3200 },
    flightTime: { min: 28, max: 32 },
    accuracy: { CEP: 500 },
    color: '#FFD700',
    icon: '☀️'
  },

  // IRBM - Jericho III (Israel)
  JERICHO: {
    id: 'jericho',
    name: 'Jericho III',
    type: 'ICBM',
    class: 'Long-Range Ballistic Missile',
    country: 'Israel',
    speed: { boostPhase: 6.0, midcourse: 5.0, terminal: 1.2 },
    altitude: { max: 800, reentry: 70 },
    range: { min: 4800, max: 11500 },
    warhead: { yield: 750, type: 'single', count: 1, weight: 750 },
    flightTime: { min: 12, max: 25 },
    accuracy: { CEP: 100 },
    color: '#1E90FF',
    icon: '✡️'
  },

  // SLBM - M51 (France)
  M51: {
    id: 'm51',
    name: 'M51 SLBM',
    type: 'SLBM',
    class: 'Submarine-Launched Ballistic Missile',
    country: 'France',
    speed: { boostPhase: 6.0, midcourse: 5.5, terminal: 1.1 },
    altitude: { max: 1000, reentry: 70 },
    range: { min: 8000, max: 10000 },
    warhead: { yield: 300, type: 'MIRV', count: 6, weight: 1500 },
    flightTime: { min: 20, max: 25 },
    accuracy: { CEP: 150 },
    color: '#0055A4',
    icon: '🔶'
  },

  // SLBM - Trident II D5 (UK)
  UK_TRIDENT: {
    id: 'uk_trident',
    name: 'Trident II D5',
    type: 'SLBM',
    class: 'UK Submarine-Launched Ballistic Missile',
    country: 'United Kingdom',
    speed: { boostPhase: 6.0, midcourse: 5.5, terminal: 1.0 },
    altitude: { max: 1100, reentry: 70 },
    range: { min: 7400, max: 12000 },
    warhead: { yield: 100, type: 'MIRV', count: 8, weight: 2000 },
    flightTime: { min: 20, max: 30 },
    accuracy: { CEP: 90 },
    color: '#C8102E',
    icon: '🇬🇧'
  },

  // ICBM - Hwasong-17 (North Korea)
  HWASONG: {
    id: 'hwasong',
    name: 'Hwaseong-17',
    type: 'ICBM',
    class: 'Intercontinental Ballistic Missile',
    country: 'North Korea',
    speed: { boostPhase: 6.5, midcourse: 5.5, terminal: 1.0 },
    altitude: { max: 3000, reentry: 100 },
    range: { min: 15000, max: 17000 },
    warhead: { yield: 500, type: 'single', count: 1, weight: 1500 },
    flightTime: { min: 30, max: 40 },
    accuracy: { CEP: 1000 },
    color: '#FF0000',
    icon: '🔴'
  },

  // Global Strike (USA - Prompt Global Strike - Hypothetical)
  GLOBAL_STRIKE: {
    id: 'global_strike',
    name: 'AGM-183 ARRW',
    type: 'GLOBAL',
    class: 'Hypersonic Boost-Glide Vehicle',
    country: 'United States',
    speed: { boostPhase: 7.0, glide: 6.5, terminal: 1.5 },
    altitude: { max: 200, glide: 60, terminal: 30 },
    range: { min: 1500, max: 5000 },
    warhead: { yield: 3000, type: 'single', count: 1, weight: 500 },
    flightTime: { min: 8, max: 15 },
    accuracy: { CEP: 10 },
    color: '#8B0000',
    icon: '🌐'
  },

  // FOBS - Fractional Orbital Bombardment (Theoretical)
  ORBITAL: {
    id: 'orbital',
    name: 'FOBS-1',
    type: 'ORBITAL',
    class: 'Fractional Orbital Bombardment System',
    country: 'Russia/China',
    speed: { boostPhase: 7.5, midcourse: 7.5, terminal: 0.5 },
    altitude: { max: 40000, reentry: 200 },
    range: { min: 2000, max: 40000 },
    warhead: { yield: 5000, type: 'FOBS', count: 1, weight: 1500 },
    flightTime: { min: 15, max: 90 },
    accuracy: { CEP: 5 },
    color: '#4B0082',
    icon: '🛸'
  },

  // DOOMSDAY - Unlimited Range (Hypothetical)
  DOOMSDAY: {
    id: 'doomsday',
    name: 'Doomsday Protocol',
    type: 'UNLIMITED',
    class: 'Planetary Annihilation System',
    country: 'GLOBAL',
    speed: { boostPhase: 7.8, midcourse: 7.8, terminal: 1.0 },
    altitude: { max: 100000, reentry: 500 },
    range: { min: 0, max: 999999 },
    warhead: { yield: 100000, type: 'DOOMSDAY', count: 1, weight: 100000 },
    flightTime: { min: 30, max: 120 },
    accuracy: { CEP: 1 },
    color: '#FF0000',
    icon: '☠️'
  }
};

export const MISSILE_LIST = Object.values(MISSILE_TYPES);
