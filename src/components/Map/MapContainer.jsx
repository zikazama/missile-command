import { useEffect, useRef } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, useMap, GeoJSON, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CapitalMarker from './CapitalMarker';
import MissileOverlay from './MissileOverlay';
import DamageRadiusOverlay from './DamageRadiusOverlay';
import { GAME_STATES } from '../../hooks/useGameState';

const SATELLITE_TILES = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution: 'Esri, Maxar, Earthstar Geographics'
};

// GeoJSON URL for world countries boundaries
const COUNTRIES_GEOJSON_URL = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

// Custom hook to handle map clicks
function MapClickHandler({ onMapClick, gameState }) {
  const map = useMap();

  useEffect(() => {
    // Disable doubleClickZoom during origin/target pick so double-click can mark location
    if (gameState === GAME_STATES.ORIGIN_PICK || gameState === GAME_STATES.TARGET_PICK) {
      map.doubleClickZoom.disable();
    } else {
      map.doubleClickZoom.enable();
    }

    const handleDoubleClick = (e) => {
      if (gameState === GAME_STATES.ATTACK_ANIM || gameState === GAME_STATES.RESULTS || gameState === GAME_STATES.IDLE) {
        return;
      }

      const { lat, lng } = e.latlng;
      onMapClick({ lat, lng });
    };

    map.on('dblclick', handleDoubleClick);

    return () => {
      map.off('dblclick', handleDoubleClick);
      map.doubleClickZoom.enable();
    };
  }, [map, onMapClick, gameState]);

  return null;
}

// Custom hook to update map view
function MapViewController({ origin, target }) {
  const map = useMap();

  useEffect(() => {
    if (origin && target) {
      const bounds = L.latLngBounds(
        [origin.lat, origin.lng],
        [target.lat, target.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [origin, target, map]);

  return null;
}

// Style for country borders
const countryStyle = {
  fillColor: 'transparent',
  fillOpacity: 0,
  color: '#4488ff',
  weight: 1,
  opacity: 0.3
};

// Style when hovering
const hoverStyle = {
  fillColor: '#4488ff',
  fillOpacity: 0.1,
  color: '#4488ff',
  weight: 2,
  opacity: 0.8
};

function CountryBorders() {
  const geoJsonRef = useRef(null);

  return (
    <GeoJSON
      ref={geoJsonRef}
      url={COUNTRIES_GEOJSON_URL}
      style={(feature) => countryStyle}
      onEachFeature={(feature, layer) => {
        if (feature.properties && feature.properties.name) {
          layer.bindTooltip(feature.properties.name, {
            permanent: false,
            direction: 'center',
            className: 'country-tooltip'
          });
        }
        layer.on({
          mouseover: (e) => {
            e.target.setStyle(hoverStyle);
            e.target.bringToFront();
          },
          mouseout: (e) => {
            e.target.setStyle(countryStyle);
          }
        });
      }}
    />
  );
}

// Custom icon for origin/target markers
function createLocationIcon(type) {
  const color = type === 'origin' ? '#44ff44' : '#ff4444';
  const html = `
    <div style="
      width: 30px;
      height: 30px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 20px ${color}, 0 0 40px ${color};
      animation: locationPulse 1.5s infinite;
    "></div>
  `;

  return L.divIcon({
    html,
    className: 'location-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

export default function MapContainer({
  capitals,
  onCityClick,
  onMapClick,
  origin,
  target,
  gameState,
  selectedWeapon,
  onAnimComplete,
  flightDetails
}) {
  const isClickDisabled =
    gameState === GAME_STATES.ATTACK_ANIM || gameState === GAME_STATES.RESULTS;

  // Check if origin/target are custom coordinates (not from capitals list)
  const isOriginCustom = origin && !origin.country;
  const isTargetCustom = target && !target.country;

  return (
    <div className="map-wrapper">
      <LeafletMapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        worldCopyJump={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        dragging={true}
        doubleClickZoom={true}
      >
        <TileLayer
          url={SATELLITE_TILES.url}
          attribution={SATELLITE_TILES.attribution}
          maxZoom={19}
        />

        <CountryBorders />

        <MapViewController origin={origin} target={target} />

        <MapClickHandler onMapClick={onMapClick} gameState={gameState} />

        {/* Origin Marker */}
        {origin && (
          <CapitalMarker
            city={origin}
            markerType="origin"
            onClick={() => {}}
            disabled={true}
            customIcon={isOriginCustom ? createLocationIcon('origin') : null}
          />
        )}

        {/* Target Marker */}
        {target && (
          <CapitalMarker
            city={target}
            markerType="target"
            onClick={() => {}}
            disabled={true}
            customIcon={isTargetCustom ? createLocationIcon('target') : null}
          />
        )}

        {/* Dashed line from origin to target */}
        {origin && target && gameState !== GAME_STATES.ATTACK_ANIM && (
          <Polyline
            positions={[[origin.lat, origin.lng], [target.lat, target.lng]]}
            pathOptions={{
              color: '#ff4444',
              weight: 2,
              dashArray: '10, 10',
              opacity: 0.7
            }}
          />
        )}

        {/* Capital City Markers */}
        {capitals.map((city) => {
          // Don't show marker if this city is already selected as origin/target
          if (origin && city.name === origin.name && city.country === origin.country) {
            return null;
          }
          if (target && city.name === target.name && city.country === target.country) {
            return null;
          }

          return (
            <CapitalMarker
              key={`${city.name}-${city.country}`}
              city={city}
              markerType={null}
              onClick={() => {
                if (!isClickDisabled) {
                  onCityClick(city);
                }
              }}
              disabled={isClickDisabled}
            />
          );
        })}

        {gameState === GAME_STATES.ATTACK_ANIM && origin && target && selectedWeapon && (
          <MissileOverlay
            origin={origin}
            target={target}
            missile={selectedWeapon}
            animationDuration={flightDetails?.animationDuration || 8}
            onComplete={onAnimComplete}
          />
        )}

        {gameState === GAME_STATES.RESULTS && origin && target && selectedWeapon && (
          <DamageRadiusOverlay
            target={target}
            missile={selectedWeapon}
          />
        )}
      </LeafletMapContainer>
    </div>
  );
}
