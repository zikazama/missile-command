/**
 * Calculate the great-circle distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculate bearing between two points
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Bearing in degrees
 */
export function calculateBearing(lat1, lng1, lat2, lng2) {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);

  const bearing = Math.atan2(y, x);
  return (toDeg(bearing) + 360) % 360;
}

function toDeg(rad) {
  return rad * (180 / Math.PI);
}

/**
 * Linear interpolation between two values
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Calculate coordinates along a great circle path
 * @param {Object} origin - {lat, lng}
 * @param {Object} target - {lat, lng}
 * @param {number} numPoints - Number of points to generate
 * @returns {Array} Array of {lat, lng, t} points
 */
export function calculateGreatCirclePath(origin, target, numPoints = 100) {
  const points = [];
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin(((target.lat - origin.lat) * Math.PI) / 360) ** 2 +
          Math.cos((origin.lat * Math.PI) / 180) *
            Math.cos((target.lat * Math.PI) / 180) *
            Math.sin(((target.lng - origin.lng) * Math.PI) / 360) ** 2
      )
    );

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const f = t * d;

    const lat =
      Math.asin(
        Math.sin((origin.lat * Math.PI) / 180) * Math.cos(f) +
          Math.cos((origin.lat * Math.PI) / 180) *
            Math.sin(f) *
            Math.cos(
              Math.atan2(
                Math.sin(((target.lng - origin.lng) * Math.PI) / 180) *
                  Math.cos((target.lat * Math.PI) / 180),
                Math.cos((origin.lat * Math.PI) / 180) *
                  Math.sin((target.lat * Math.PI) / 180) -
                  Math.sin((origin.lat * Math.PI) / 180) *
                    Math.cos((target.lat * Math.PI) / 180) *
                    Math.cos(((target.lng - origin.lng) * Math.PI) / 180)
              )
            )
      ) *
      (180 / Math.PI);

    const lng =
      (origin.lng +
        Math.atan2(
          Math.sin(((target.lng - origin.lng) * Math.PI) / 180) *
            Math.cos((target.lat * Math.PI) / 180),
          Math.cos((origin.lat * Math.PI) / 180) *
            Math.sin((target.lat * Math.PI) / 180) -
            Math.sin((origin.lat * Math.PI) / 180) *
              Math.cos((target.lat * Math.PI) / 180) *
              Math.cos(((target.lng - origin.lng) * Math.PI) / 180)
        )) *
      (180 / Math.PI);

    points.push({ lat, lng, t });
  }

  return points;
}
