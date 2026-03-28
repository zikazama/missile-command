import { GAME_STATES } from '../../hooks/useGameState';

export default function Header({ gameState, selectedWeapon, onAboutClick }) {
  const showWeapon = gameState !== GAME_STATES.IDLE && gameState !== GAME_STATES.WEAPON_SELECT;

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">MISSILE COMMAND</span>
        </div>
        <span className="version">v1.0</span>
      </div>

      <div className="header-center">
        {showWeapon && selectedWeapon && (
          <div className="selected-weapon">
            <span className="weapon-icon">{selectedWeapon.icon}</span>
            <span className="weapon-name">{selectedWeapon.name}</span>
            <span className="weapon-type">{selectedWeapon.type}</span>
          </div>
        )}
      </div>

      <div className="header-right">
        <button className="about-button" onClick={onAboutClick}>
          <span>ℹ️</span>
        </button>
        <div className={`status-indicator ${gameState === GAME_STATES.ATTACK_ANIM ? 'active' : ''}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {gameState === GAME_STATES.IDLE && 'STANDBY'}
            {gameState === GAME_STATES.WEAPON_SELECT && 'SELECT WEAPON'}
            {gameState === GAME_STATES.ORIGIN_PICK && 'SELECT ORIGIN'}
            {gameState === GAME_STATES.TARGET_PICK && 'SELECT TARGET'}
            {gameState === GAME_STATES.ATTACK_ANIM && 'INCOMING'}
            {gameState === GAME_STATES.RESULTS && 'IMPACT'}
          </span>
        </div>
      </div>
    </header>
  );
}
