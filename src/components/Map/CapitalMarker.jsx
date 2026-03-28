import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function createCustomIcon(city, markerType) {
  // If no city (custom location marker), return null
  if (!city) return null;

  let bgColor = '#1a1a2e';
  let borderColor = '#e94560';
  let glowColor = 'rgba(233, 69, 96, 0.5)';

  if (markerType === 'origin') {
    bgColor = '#1a4d1a';
    borderColor = '#44ff44';
    glowColor = 'rgba(68, 255, 68, 0.5)';
  } else if (markerType === 'target') {
    bgColor = '#4d1a1a';
    borderColor = '#ff4444';
    glowColor = 'rgba(255, 68, 68, 0.5)';
  }

  const html = `
    <div class="capital-marker ${markerType || ''}" style="
      background: ${bgColor};
      border: 2px solid ${borderColor};
      border-radius: 25px;
      padding: 5px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      box-shadow: 0 0 15px ${glowColor};
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Share Tech Mono', monospace;
      position: relative;
    " title="${city.country || 'Custom Location'}">
      <span style="font-size: 24px; filter: drop-shadow(0 0 4px rgba(255,255,255,0.6));">${city.flag || '📍'}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-marker',
    iconSize: [45, 40],
    iconAnchor: [22, 20]
  });
}

// Create a simple location marker icon
function createLocationIcon(markerType) {
  const color = markerType === 'origin' ? '#44ff44' : '#ff4444';

  const html = `
    <div style="
      width: 24px;
      height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 15px ${color}, 0 0 30px ${color};
    "></div>
  `;

  return L.divIcon({
    html,
    className: 'location-marker-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

export default function CapitalMarker({ city, markerType, onClick, disabled, customIcon }) {
  // If customIcon is provided, use it instead
  if (customIcon) {
    return (
      <Marker
        position={[city.lat, city.lng]}
        icon={customIcon}
        eventHandlers={{
          click: onClick
        }}
        opacity={disabled ? 0.5 : 1}
      >
        <Popup>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', minWidth: '150px', background: '#1a1a2e', padding: '8px', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#eaeaea' }}>
              {markerType === 'origin' ? '🚀 Launch Point' : '💥 Target'}
            </div>
            <div style={{ color: '#a0a0a0', fontSize: '11px', marginTop: '4px' }}>
              {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }

  const icon = createCustomIcon(city, markerType);

  return (
    <Marker
      position={[city.lat, city.lng]}
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
      opacity={disabled ? 0.5 : 1}
    >
      <Popup>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', minWidth: '150px', background: '#1a1a2e', padding: '8px', borderRadius: '8px' }}>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>
            {city.flag}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px', color: '#eaeaea' }}>
            {city.name}
          </div>
          <div style={{ color: '#a0a0a0', fontSize: '11px' }}>
            {city.country}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
