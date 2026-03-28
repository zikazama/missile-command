/**
 * Calculate nuclear weapon damage radii based on warhead yield
 *
 * Nuclear weapon effects:
 * - Fireball radius: ∛(yield in kt) * 0.5 km
 * - Blast radius (5 psi overpressure): ∛(yield in kt) * 1.5 km
 * - Radiation radius (500 rem): ∛(yield in kt) * 2.0 km
 * - Thermal radius: ∛(yield in kt) * 3.0 km
 */

export function calculateDamageRadius(yieldKt) {
  const scale = Math.cbrt(yieldKt);

  return {
    fireball: {
      radius: scale * 0.5,
      description: 'Fireball (instant vaporization)',
      color: 'rgba(255, 255, 200, 0.8)'
    },
    blast: {
      radius: scale * 1.5,
      description: 'Blast damage (5 psi overpressure)',
      color: 'rgba(255, 100, 100, 0.5)'
    },
    radiation: {
      radius: scale * 2.0,
      description: 'Acute radiation (500 rem)',
      color: 'rgba(255, 200, 100, 0.4)'
    },
    thermal: {
      radius: scale * 3.0,
      description: 'Thermal burns (3rd degree)',
      color: 'rgba(255, 150, 50, 0.3)'
    }
  };
}

/**
 * Get the maximum damage radius
 */
export function getMaxDamageRadius(yieldKt) {
  const radii = calculateDamageRadius(yieldKt);
  return radii.thermal.radius;
}

/**
 * Format radius for display
 */
export function formatRadius(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}
