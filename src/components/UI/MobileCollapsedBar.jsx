import { useState, useEffect } from 'react';
import { GAME_STATES } from '../../hooks/useGameState';
import './MobileCollapsedBar.css';

export default function MobileCollapsedBar({
  gameState,
  selectedWeapon,
  origin,
  target,
  flightDetails,
  onLaunch,
  onReset
}) {
  const showAttack = gameState === GAME_STATES.TARGET_PICK && origin && target && flightDetails;

  // Timer state for attack animation
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

  // Calculate compression ratio
  const getCompressionRatio = () => {
    if (!flightDetails || !flightDetails.animationDuration || !flightDetails.timeMinutes) return 1;
    const realMinutesPerAnimSecond = (flightDetails.timeMinutes * 60) / flightDetails.animationDuration;
    return Math.round(realMinutesPerAnimSecond);
  };

  // Determine active step
  const getActiveStep = () => {
    if (!selectedWeapon) return 1;
    if (selectedWeapon && !origin) return 2;
    if (origin && !target) return 3;
    if (origin && target) return 4;
    return 1;
  };

  const activeStep = getActiveStep();

  // Show if we have a weapon selected and bottom sheet is collapsed
  const shouldShow = selectedWeapon && (gameState !== GAME_STATES.IDLE && gameState !== GAME_STATES.WEAPON_SELECT);

  if (!shouldShow) return null;

  return (
    <div className="mobile-collapsed-bar">
      {/* Compact Step Progress */}
      <div className="collapsed-step-progress">
        <div className={`collapsed-step ${activeStep >= 1 ? 'completed' : ''} ${activeStep === 1 ? 'active' : ''}`}>
          <span>1</span>
        </div>
        <div className="collapsed-step-line"></div>
        <div className={`collapsed-step ${activeStep >= 2 ? 'completed' : ''} ${activeStep === 2 ? 'active' : ''}`}>
          <span>2</span>
        </div>
        <div className="collapsed-step-line"></div>
        <div className={`collapsed-step ${activeStep >= 3 ? 'completed' : ''} ${activeStep === 3 ? 'active' : ''}`}>
          <span>3</span>
        </div>
        <div className="collapsed-step-line"></div>
        <div className={`collapsed-step ${activeStep >= 4 ? 'completed' : ''} ${activeStep === 4 ? 'active' : ''}`}>
          <span>4</span>
        </div>
      </div>

      {/* Timer - only show during attack anim or results */}
      {(gameState === GAME_STATES.ATTACK_ANIM || gameState === GAME_STATES.RESULTS) && (
        <div className="collapsed-timer">
          <span className="timer-icon">⏱️</span>
          <span className="timer-value">{elapsedAnimTime.toFixed(1)}s</span>
          <span className="timer-ratio">({getCompressionRatio()}x)</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="collapsed-actions">
        {showAttack && (
          <button
            className="collapsed-attack-btn"
            onClick={onLaunch}
            title="LAUNCH ATTACK"
          >
            🚀
          </button>
        )}

        {gameState !== GAME_STATES.ATTACK_ANIM && (
          <button
            className="collapsed-reset-btn"
            onClick={onReset}
            title="Reset Simulation"
          >
            ↺
          </button>
        )}
      </div>
    </div>
  );
}
