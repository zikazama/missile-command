import { useState, useEffect } from 'react';
import { GAME_STATES } from '../../hooks/useGameState';
import StatsDisplay from './StatsDisplay';
import AttackButton from './AttackButton';

export default function ControlPanel({
  gameState,
  selectedWeapon,
  origin,
  target,
  flightDetails,
  onWeaponMenuOpen,
  onLaunch,
  onReset,
  onChangeOrigin,
  onChangeTarget,
  onSelectOrigin,
  onSelectTarget
}) {
  const showAttack = gameState === GAME_STATES.TARGET_PICK && origin && target && flightDetails;
  const showResults = gameState === GAME_STATES.RESULTS;

  // Countup timer for attack animation (in seconds)
  const [elapsedAnimTime, setElapsedAnimTime] = useState(0);

  useEffect(() => {
    if (gameState === GAME_STATES.ATTACK_ANIM && flightDetails) {
      setElapsedAnimTime(0);

      const interval = setInterval(() => {
        setElapsedAnimTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= flightDetails.animationDuration) {
            clearInterval(interval);
            return flightDetails.animationDuration;
          }
          return Math.round(newTime * 10) / 10;
        });
      }, 100);

      return () => clearInterval(interval);
    }
    // Don't reset on RESULTS - keep showing the final time
  }, [gameState, flightDetails]);

  // Calculate time compression ratio for display
  const getCompressionRatio = () => {
    if (!flightDetails || !flightDetails.animationDuration || !flightDetails.timeMinutes) return 1;
    const realMinutesPerAnimSecond = (flightDetails.timeMinutes * 60) / flightDetails.animationDuration;
    return Math.round(realMinutesPerAnimSecond);
  };

  return (
    <div className="control-panel visible">
      {/* Attack Timer - Count Up with Compression Ratio */}
      {(gameState === GAME_STATES.ATTACK_ANIM || gameState === GAME_STATES.RESULTS) && (
        <div className="attack-timer">
          <div className="timer-main">
            <span className="timer-icon">⏱️</span>
            <span className="timer-value">{elapsedAnimTime.toFixed(1)}s</span>
          </div>
          <div className="timer-ratio">
            1s = {getCompressionRatio()} min real
          </div>
        </div>
      )}

      {/* Step Progress Indicator */}
      <div className="step-progress">
        <div className={`step ${!selectedWeapon ? 'active' : ''}`}>
          <span className="step-num">1</span>
          <span className="step-label">WEAPON</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${selectedWeapon && !origin ? 'active' : ''}`}>
          <span className="step-num">2</span>
          <span className="step-label">ORIGIN</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${origin && !target ? 'active' : ''}`}>
          <span className="step-num">3</span>
          <span className="step-label">TARGET</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${origin && target ? 'active' : ''}`}>
          <span className="step-num">4</span>
          <span className="step-label">LAUNCH</span>
        </div>
        <div className="step-buttons">
          {showAttack && (
            <button className="step-attack-btn" onClick={onLaunch} title="LAUNCH ATTACK">
              🚀
            </button>
          )}
          {gameState !== GAME_STATES.ATTACK_ANIM && (
            <button className="step-reset-btn" onClick={onReset} title="Reset Simulation">
              ↺
            </button>
          )}
        </div>
      </div>

      {/* Weapon Selection - Always Visible */}
      {!selectedWeapon && (
        <div className="weapon-prompt">
          <button className="weapon-select-button large" onClick={onWeaponMenuOpen}>
            <span className="btn-icon">📡</span>
            <span className="btn-text">SELECT WEAPON SYSTEM</span>
            <span className="btn-hint">Choose your missile type</span>
          </button>
        </div>
      )}

      {/* Selected Weapon Display */}
      {selectedWeapon && (
        <div className="selected-weapon-display">
          <span className="weapon-badge">
            {selectedWeapon.icon} {selectedWeapon.name}
          </span>
          <button className="change-weapon-btn" onClick={onWeaponMenuOpen}>
            Change
          </button>
        </div>
      )}

      {/* Instruction Banners */}
      {gameState === GAME_STATES.ORIGIN_PICK && (
        <div className="instruction-banner">
          <span className="instruction-icon">📍</span>
          <span className="instruction-text">Double-click on map to set ORIGIN point</span>
        </div>
      )}

      {gameState === GAME_STATES.TARGET_PICK && (
        <div className="instruction-banner target">
          <span className="instruction-icon">🎯</span>
          <span className="instruction-text">Double-click on map to set TARGET point</span>
        </div>
      )}

      {/* Selection Buttons */}
      <div className="selection-buttons">
        <button
          className={`select-button origin ${origin ? 'selected' : ''} ${gameState === GAME_STATES.ORIGIN_PICK ? 'active' : ''}`}
          onClick={onSelectOrigin}
          disabled={gameState === GAME_STATES.ATTACK_ANIM || gameState === GAME_STATES.RESULTS}
        >
          <span className="select-icon">🚀</span>
          <span className="select-label">ORIGIN</span>
          {origin ? (
            <span className="select-value">{origin.flag} {origin.name}</span>
          ) : (
            <span className="select-placeholder">Tap to select launch site</span>
          )}
        </button>

        <div className="select-arrow">
          <span>➜</span>
        </div>

        <button
          className={`select-button target ${target ? 'selected' : ''} ${gameState === GAME_STATES.TARGET_PICK ? 'active' : ''}`}
          onClick={onSelectTarget}
          disabled={gameState === GAME_STATES.ATTACK_ANIM || gameState === GAME_STATES.RESULTS || !origin}
        >
          <span className="select-icon">💥</span>
          <span className="select-label">TARGET</span>
          {target ? (
            <span className="select-value">{target.flag} {target.name}</span>
          ) : (
            <span className="select-placeholder">Tap to select target</span>
          )}
        </button>
      </div>

      {flightDetails && (
        <StatsDisplay
          flightDetails={flightDetails}
          missile={selectedWeapon}
        />
      )}

      <div className="action-buttons">
        {showAttack && (
          <AttackButton onClick={onLaunch} missile={selectedWeapon} />
        )}

        {showResults && (
          <button className="reset-button" onClick={onReset}>
            <span className="btn-icon">🔄</span>
            <span className="btn-text">NEW SIMULATION</span>
          </button>
        )}

        {gameState === GAME_STATES.ATTACK_ANIM && (
          <button className="reset-button secondary" onClick={onReset}>
            <span className="btn-icon">↩️</span>
            <span className="btn-text">CANCEL</span>
          </button>
        )}

        {!showResults && gameState !== GAME_STATES.ATTACK_ANIM && (
          <button className="reset-button secondary" onClick={onReset}>
            <span className="btn-icon">↩️</span>
            <span className="btn-text">RESET</span>
          </button>
        )}
      </div>
    </div>
  );
}
