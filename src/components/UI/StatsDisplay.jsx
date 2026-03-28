import { formatRadius } from '../../utils/damageRadius';

export default function StatsDisplay({ flightDetails, missile }) {
  if (!flightDetails) return null;

  const damageRadius = missile
    ? Math.cbrt(missile.warhead.yield) * 3
    : 0;

  return (
    <div className={`stats-display ${flightDetails.outOfRange ? 'warning' : ''}`}>
      {flightDetails.outOfRange && (
        <div className="warning-banner">
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">{flightDetails.error}</span>
        </div>
      )}

      <div className="stat-item">
        <span className="stat-icon">📏</span>
        <span className="stat-label">Distance</span>
        <span className="stat-value">{flightDetails.distanceKm.toLocaleString()} km</span>
      </div>

      <div className="stat-item">
        <span className="stat-icon">⏱️</span>
        <span className="stat-label">Flight Time</span>
        <span className="stat-value">{flightDetails.displayTime}</span>
      </div>

      <div className="stat-item">
        <span className="stat-icon">💣</span>
        <span className="stat-label">Warhead</span>
        <span className="stat-value">{missile?.warhead.yield} kt</span>
      </div>

      <div className="stat-item">
        <span className="stat-icon">🔥</span>
        <span className="stat-label">Blast Radius</span>
        <span className="stat-value">{formatRadius(damageRadius)}</span>
      </div>
    </div>
  );
}
