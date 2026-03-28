import { useState, useRef } from 'react';
import MapContainer from './components/Map/MapContainer';
import Header from './components/UI/Header';
import WeaponMenu from './components/UI/WeaponMenu';
import ControlPanel from './components/UI/ControlPanel';
import BottomSheet from './components/UI/BottomSheet';
import MobileCollapsedBar from './components/UI/MobileCollapsedBar';
import AboutModal from './components/UI/AboutModal';
import { useGameState, GAME_STATES } from './hooks/useGameState';
import { CAPITALS } from './data/capitals';
import { initAudio, playLaunchSound, playExplosionSound } from './utils/soundEffects';
import './App.css';

function App() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [bottomSheetCollapsed, setBottomSheetCollapsed] = useState(false);
  const bottomSheetRef = useRef(null);

  const {
    gameState,
    selectedWeapon,
    origin,
    target,
    flightDetails,
    weaponMenuOpen,
    selectWeapon,
    pickOrigin,
    pickTarget,
    launch,
    animComplete,
    reset,
    setWeaponMenuOpen,
    setGameState
  } = useGameState();

  // Handle city click based on current game state
  const handleCityClick = (city) => {
    if (gameState === GAME_STATES.ORIGIN_PICK) {
      pickOrigin(city);
      // Collapse bottom sheet when origin is picked
      if (bottomSheetRef.current) {
        bottomSheetRef.current.collapse();
      }
    } else if (gameState === GAME_STATES.TARGET_PICK) {
      // Don't allow same city as origin
      if (origin && city.name === origin.name && city.country === origin.country) {
        return;
      }
      pickTarget(city);
      // Collapse bottom sheet when target is picked
      if (bottomSheetRef.current) {
        bottomSheetRef.current.collapse();
      }
    }
  };

  // Handle map click (anywhere on map)
  const handleMapClick = (location) => {
    if (gameState === GAME_STATES.ORIGIN_PICK) {
      pickOrigin({
        ...location,
        name: 'Custom Location',
        country: null,
        flag: '📍'
      });
      // Collapse bottom sheet when origin is picked
      if (bottomSheetRef.current) {
        bottomSheetRef.current.collapse();
      }
    } else if (gameState === GAME_STATES.TARGET_PICK) {
      // Check if clicking on the same point as origin
      if (origin && location.lat === origin.lat && location.lng === origin.lng) {
        return;
      }
      pickTarget({
        ...location,
        name: 'Custom Location',
        country: null,
        flag: '🎯'
      });
      // Collapse bottom sheet when target is picked
      if (bottomSheetRef.current) {
        bottomSheetRef.current.collapse();
      }
    }
  };

  // Handle weapon selection
  const handleWeaponSelect = (weapon) => {
    selectWeapon(weapon);
    // Collapse bottom sheet when weapon is selected
    if (bottomSheetRef.current) {
      bottomSheetRef.current.collapse();
    }
  };

  // Handle weapon menu open - collapse bottom sheet first
  const handleWeaponMenuOpen = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.collapse();
    }
    setTimeout(() => {
      setWeaponMenuOpen(true);
    }, 300);
  };

  // Handle attack launch
  const handleLaunch = () => {
    // Collapse bottom sheet when launching
    if (bottomSheetRef.current) {
      bottomSheetRef.current.collapse();
    }
    initAudio(); // Initialize audio context on user interaction
    playLaunchSound(); // Play launch sound
    launch();
  };

  // Handle origin/target change (re-select)
  const handleChangeOrigin = () => {
    if (gameState === GAME_STATES.TARGET_PICK || gameState === GAME_STATES.RESULTS) {
      // Reset and go back to origin pick
      reset();
      setWeaponMenuOpen(false);
    }
  };

  const handleChangeTarget = () => {
    if (gameState === GAME_STATES.TARGET_PICK || gameState === GAME_STATES.RESULTS) {
      // Go back to target pick (keep weapon and origin)
      // This requires modifying state, so we'll just reset for now
      reset();
      if (selectedWeapon) {
        selectWeapon(selectedWeapon);
      }
    }
  };

  // Handle origin/target selection via cards - set game state for map picking
  const handleSelectOrigin = () => {
    if (selectedWeapon && gameState !== GAME_STATES.ATTACK_ANIM && gameState !== GAME_STATES.RESULTS) {
      setGameState(GAME_STATES.ORIGIN_PICK);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectTarget = () => {
    if (selectedWeapon && origin && gameState !== GAME_STATES.ATTACK_ANIM && gameState !== GAME_STATES.RESULTS) {
      setGameState(GAME_STATES.TARGET_PICK);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      <Header
        gameState={gameState}
        selectedWeapon={selectedWeapon}
        onAboutClick={() => setAboutOpen(true)}
      />

      <main className="main-content">
        <MapContainer
          capitals={CAPITALS}
          onCityClick={handleCityClick}
          onMapClick={handleMapClick}
          origin={origin}
          target={target}
          gameState={gameState}
          selectedWeapon={selectedWeapon}
          onLaunch={handleLaunch}
          onAnimComplete={animComplete}
          flightDetails={flightDetails}
        />

        <WeaponMenu
          isOpen={weaponMenuOpen}
          onClose={() => setWeaponMenuOpen(false)}
          onSelect={handleWeaponSelect}
          gameState={gameState}
        />

        <BottomSheet ref={bottomSheetRef} onCollapseChange={setBottomSheetCollapsed}>
          <ControlPanel
            gameState={gameState}
            selectedWeapon={selectedWeapon}
            origin={origin}
            target={target}
            flightDetails={flightDetails}
            onWeaponMenuOpen={handleWeaponMenuOpen}
            onLaunch={handleLaunch}
            onReset={reset}
            onChangeOrigin={handleChangeOrigin}
            onChangeTarget={handleChangeTarget}
            onSelectOrigin={handleSelectOrigin}
            onSelectTarget={handleSelectTarget}
          />
        </BottomSheet>
      </main>

      {/* Scan line overlay for retro effect */}
      <div className="scanlines"></div>

      {/* Mobile collapsed bar - shows step progress, timer, and buttons when bottom sheet is hidden */}
      <MobileCollapsedBar
        gameState={gameState}
        selectedWeapon={selectedWeapon}
        origin={origin}
        target={target}
        flightDetails={flightDetails}
        onLaunch={handleLaunch}
        onReset={reset}
      />

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}

export default App;
