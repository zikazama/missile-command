import { haversineDistance, lerp } from './geoUtils';

/**
 * Calculate flight time for a missile between two points
 * @param {Object} origin - {lat, lng}
 * @param {Object} target - {lat, lng}
 * @param {Object} missile - missile type definition
 * @returns {Object} - {timeMinutes, distanceKm, avgSpeedKmh, valid, error}
 */
export function calculateFlightDetails(origin, target, missile) {
  // Validate coordinates exist
  if (!origin || !target || origin.lat == null || origin.lng == null || target.lat == null || target.lng == null) {
    return {
      valid: false,
      distanceKm: 0,
      error: 'Invalid coordinates'
    };
  }

  const distanceKm = haversineDistance(origin.lat, origin.lng, target.lat, target.lng);

  // Validate range - but still show results even if out of range for demo purposes
  const isOutOfRange = distanceKm < missile.range.min || distanceKm > missile.range.max;

  let timeMinutes;

  if (missile.type === 'CRUISE') {
    timeMinutes = calculateCruiseFlightTime(distanceKm, missile);
  } else {
    timeMinutes = calculateBallisticFlightTime(distanceKm, missile);
  }

  const avgSpeedKmh = Math.round(distanceKm / (timeMinutes / 60));

  return {
    valid: !isOutOfRange, // Set valid to false if out of range, but still return results
    distanceKm: Math.round(distanceKm),
    timeMinutes: Math.round(timeMinutes),
    timeSeconds: Math.round(timeMinutes * 60),
    avgSpeedKmh,
    displayTime: formatTime(timeMinutes),
    outOfRange: isOutOfRange,
    error: isOutOfRange ? `Out of range (${Math.round(missile.range.min)}-${Math.round(missile.range.max)} km)` : null
  };
}

function calculateCruiseFlightTime(distanceKm, missile) {
  const cruiseSpeedKmh = missile.speed.cruise * 1224; // Mach to km/h
  return (distanceKm / cruiseSpeedKmh) * 60;
}

function calculateBallisticFlightTime(distanceKm, missile) {
  const rangeSpan = missile.range.max - missile.range.min;
  // Clamp normalizedDistance to 0-1 range to prevent negative times
  const normalizedDistance = Math.max(0, Math.min(1, (distanceKm - missile.range.min) / rangeSpan));
  const timeSpan = missile.flightTime.max - missile.flightTime.min;
  let timeMinutes =
    missile.flightTime.min + normalizedDistance * timeSpan;

  // Add some variance for realism (±5%)
  const variance = (Math.random() - 0.5) * 0.1;
  timeMinutes *= 1 + variance;

  return Math.max(1, timeMinutes); // Minimum 1 minute
}

function formatTime(minutes) {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

/**
 * Calculate ballistic arc trajectory points
 * @param {Object} origin - {lat, lng}
 * @param {Object} target - {lat, lng}
 * @param {number} numPoints - Number of points to generate
 * @returns {Array} Array of {lat, lng, height, t} points
 */
export function calculateTrajectory(origin, target, numPoints = 100) {
  const distance = haversineDistance(origin.lat, origin.lng, target.lat, target.lng);

  // Apogee based on distance (higher for longer ranges)
  // Max altitude capped at 800km (Karman line)
  const apogee = Math.min(distance * 0.15, 800);

  const points = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;

    // Linear interpolation
    const lat = lerp(origin.lat, target.lat, t);
    const lng = lerp(origin.lng, target.lng, t);

    // Parabolic height: 4 * apogee * t * (1 - t)
    // This creates a symmetric parabola peaking at t=0.5
    const height = 4 * apogee * t * (1 - t);

    points.push({ lat, lng, height, t });
  }

  return points;
}

/**
 * Get average speed in km/h from missile speed specs
 * @param {Object} missile - missile type definition
 * @returns {number} Average speed in km/h
 */
function getMissileAvgSpeed(missile) {
  const speed = missile.speed;
  if (missile.type === 'CRUISE') {
    return speed.cruise * 1224; // Mach to km/h
  }
  // For ballistic missiles, average of boost and midcourse speeds
  const boostSpeed = speed.boostPhase * 1224;
  const midSpeed = speed.midcourse ? speed.midcourse * 1224 : boostSpeed * 0.7;
  return (boostSpeed + midSpeed) / 2;
}

/**
 * Get animation duration based on missile specs and distance
 * Faster missiles = shorter animation time
 * @param {Object} missile - missile type definition
 * @param {number} distanceKm - distance in km
 * @returns {number} Animation duration in seconds
 */
export function getAnimationDuration(missile, distanceKm) {
  if (!distanceKm || distanceKm <= 0) {
    // Default durations based on type only
    switch (missile.type) {
      case 'SRBM': return 4;
      case 'IRBM': return 7;
      case 'ICBM': return 10;
      case 'HYPERSONIC': return 6;
      case 'SLBM': return 9;
      case 'CRUISE': return 15;
      case 'GLOBAL': return 12;
      case 'ORBITAL': return 15;
      case 'UNLIMITED': return 8;
      default: return 10;
    }
  }

  const avgSpeedKmh = getMissileAvgSpeed(missile);

  // Calculate real flight time in minutes
  let realFlightTimeMin;
  if (missile.type === 'CRUISE') {
    realFlightTimeMin = (distanceKm / avgSpeedKmh) * 60;
  } else {
    // For ballistic missiles, interpolate based on range
    const rangeSpan = missile.range.max - missile.range.min;
    const normalizedDist = Math.max(0, Math.min(1, (distanceKm - missile.range.min) / rangeSpan));
    realFlightTimeMin = missile.flightTime.min + normalizedDist * (missile.flightTime.max - missile.flightTime.min);
  }

  // Compression ratio: how much to compress real time to animation time
  // SRBM: compress more (real 2-10 min -> 3-6 sec)
  // ICBM: compress less (real 20-35 min -> 8-15 sec)
  // CRUISE: compress least (real 45-180 min -> 12-20 sec)
  let compressionRatio;
  switch (missile.type) {
    case 'SRBM':
      compressionRatio = 150;
      break;
    case 'IRBM':
      compressionRatio = 180;
      break;
    case 'HYPERSONIC':
      compressionRatio = 200;
      break;
    case 'ICBM':
      compressionRatio = 200;
      break;
    case 'SLBM':
      compressionRatio = 200;
      break;
    case 'CRUISE':
      compressionRatio = 600;
      break;
    case 'GLOBAL':
    case 'ORBITAL':
      compressionRatio = 250;
      break;
    case 'UNLIMITED':
      compressionRatio = 400;
      break;
    default:
      compressionRatio = 180;
  }

  const animDuration = realFlightTimeMin * 60 / compressionRatio;

  // Add small random variance (±10%) for realism
  const variance = 0.9 + Math.random() * 0.2;

  // Clamp to reasonable bounds
  return Math.max(2, Math.min(25, animDuration * variance));
}
