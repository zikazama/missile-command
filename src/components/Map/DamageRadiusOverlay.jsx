import { Circle, Tooltip } from 'react-leaflet';
import { calculateDamageRadius } from '../../utils/damageRadius';

export default function DamageRadiusOverlay({ target, missile }) {
  if (!target) return null;

  const damageRadii = calculateDamageRadius(missile.warhead.yield);
  const radiusMeters = damageRadii.thermal.radius * 1000; // Convert km to meters

  return (
    <Circle
      center={[target.lat, target.lng]}
      radius={radiusMeters}
      pathOptions={{
        color: '#ff0000',
        fillColor: '#ff0000',
        fillOpacity: 0.3,
        weight: 2,
        dashArray: '5, 5'
      }}
    >
      <Tooltip permanent direction="top" className="damage-radius-tooltip">
        <span style={{ color: '#ff0000', fontFamily: 'Share Tech Mono, monospace' }}>
          {damageRadii.thermal.radius.toFixed(1)} km blast radius
        </span>
      </Tooltip>
    </Circle>
  );
}
