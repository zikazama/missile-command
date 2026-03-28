import { MISSILE_LIST } from '../../data/missiles';
import { GAME_STATES } from '../../hooks/useGameState';

export default function WeaponMenu({
  isOpen,
  onClose,
  onSelect,
  gameState
}) {
  const canSelect = gameState === GAME_STATES.IDLE || gameState === GAME_STATES.WEAPON_SELECT;

  if (!isOpen && gameState !== GAME_STATES.WEAPON_SELECT) return null;

  return (
    <div className={`weapon-menu ${isOpen ? 'open' : ''}`}>
      <div className="weapon-menu-header">
        <h3>SELECT WEAPON SYSTEM</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="weapon-list">
        {MISSILE_LIST.map((missile) => (
          <button
            key={missile.id}
            className="weapon-item"
            onClick={() => onSelect(missile)}
            disabled={!canSelect}
          >
            <div className="weapon-icon-large">{missile.icon}</div>
            <div className="weapon-info">
              <div className="weapon-name">{missile.name}</div>
              <div className="weapon-class">{missile.class}</div>
              <div className="weapon-stats">
                <span className="stat">
                  <span className="stat-label">Range:</span>
                  <span className="stat-value">{missile.range.min.toLocaleString()}-{missile.range.max.toLocaleString()} km</span>
                </span>
                <span className="stat">
                  <span className="stat-label">Warhead:</span>
                  <span className="stat-value">{missile.warhead.yield} kt</span>
                </span>
                <span className="stat">
                  <span className="stat-label">Flight:</span>
                  <span className="stat-value">{missile.flightTime.min}-{missile.flightTime.max} min</span>
                </span>
              </div>
            </div>
            <div
              className="weapon-color-indicator"
              style={{ backgroundColor: missile.color }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
