# Missile Command Simulation

A realistic ballistic missile simulation web application with satellite map visualization, missile trajectory animation, and nuclear blast radius effects.

## Features

- **Interactive World Map** - ESRI satellite imagery with country borders
- **Capital City Markers** - 15+ major world capitals with country flags
- **Custom Location Selection** - Double-click anywhere to set origin/target
- **Multiple Missile Types** - 17 realistic missile systems with accurate specifications
- **Realistic Physics** - Ballistic arc trajectories based on actual missile specs
- **Speed Variation** - Animation speed matches real missile velocities
- **Nuclear Effects** - Fireball, blast, radiation, and thermal radius visualization
- **Sound Effects** - Launch rumble, flight sound, and explosion effects
- **Damage Radius** - Real-time blast radius calculation based on warhead yield
- **Time Compression** - Shows real-world time equivalent (1s = X min)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Leaflet + React-Leaflet** - Interactive map
- **ESRI World Imagery** - Satellite tiles
- **Web Audio API** - Sound effects generation
- **Canvas API** - Missile trajectory and explosion animations

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Select Weapon** - Click "SELECT WEAPON SYSTEM" to choose a missile
2. **Set Origin** - Double-click on map or capital city to set launch location
3. **Set Target** - Double-click on map or capital city to set target location
4. **Launch** - Click the attack button (rocket icon) in top-right corner
5. **Watch** - Observe missile flight with real-time countdown
6. **Results** - View explosion animation and damage radius

## Missile Specifications

| Missile | Type | Range (km) | Speed (Mach) | Warhead (kt) |
|---------|------|-------------|--------------|--------------|
| Iskander-M | SRBM | 400-500 | 5.2 | 50 |
| Agni-III | IRBM | 3000-5000 | 7.0 | 250 |
| Tomahawk | Cruise | 1700-2500 | 0.72 | 0.5 |
| Trident II | SLBM | 7400-12000 | 6.0 | 100 (8 MIRV) |
| Minuteman III | ICBM | 13000 | 7.0 | 300 (3 MIRV) |
| Avangard | Hypersonic | 6000-15000 | 6.0 | 2000 |
| DF-41 | ICBM | 12000-15000 | 7.0 | 500 (10 MIRV) |
| Sarmat | ICBM | 18000 | 7.0 | 2500 (15 MIRV) |

## Project Structure

```
src/
├── components/
│   ├── Map/
│   │   ├── MapContainer.jsx
│   │   ├── CapitalMarker.jsx
│   │   ├── MissileOverlay.jsx
│   │   └── DamageRadiusOverlay.jsx
│   └── UI/
│       ├── Header.jsx
│       ├── WeaponMenu.jsx
│       ├── ControlPanel.jsx
│       ├── StatsDisplay.jsx
│       └── BottomSheet.jsx
├── data/
│   ├── missiles.js
│   └── capitals.js
├── hooks/
│   └── useGameState.js
├── utils/
│   ├── flightTime.js
│   ├── geoUtils.js
│   ├── damageRadius.js
│   └── soundEffects.js
├── App.jsx
├── App.css
└── main.jsx
```

## State Flow

```
IDLE → WEAPON_SELECT → ORIGIN_PICK → TARGET_PICK → ATTACK_ANIM → RESULTS
                                                              ↓
                                                         (Reset to IDLE)
```

## License

MIT
