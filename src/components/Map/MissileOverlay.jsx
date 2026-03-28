import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import { calculateTrajectory } from '../../utils/flightTime';
import { calculateDamageRadius } from '../../utils/damageRadius';
import { playExplosionSound } from '../../utils/soundEffects';

export default function MissileOverlay({
  origin,
  target,
  missile,
  animationDuration,
  onComplete
}) {
  const canvasRef = useRef(null);
  const map = useMap();

  const animationRef = useRef({
    started: false,
    frameId: null,
    startTime: null,
    trailTs: [],
    particles: [],
    explosionPhase: false,
    damagePhase: false,
    damagePhaseStart: null,
    explosionSoundPlayed: false
  });

  const trajectory = useMemo(() => {
    if (!origin || !target) return [];
    return calculateTrajectory(origin, target, 150);
  }, [origin, target]);

  const damageRadii = useMemo(() => {
    if (!missile) return null;
    return calculateDamageRadius(missile.warhead.yield);
  }, [missile]);

  const cleanup = useCallback(() => {
    const anim = animationRef.current;
    if (anim.frameId) {
      cancelAnimationFrame(anim.frameId);
    }
    anim.started = false;
    anim.frameId = null;
    anim.startTime = null;
    anim.trailTs = [];
    anim.particles = [];
    anim.explosionPhase = false;
    anim.damagePhase = false;
    anim.damagePhaseStart = null;
    anim.explosionSoundPlayed = false;

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, []);

  useEffect(() => {
    if (!origin || !target || !missile || trajectory.length === 0) return;
    if (!canvasRef.current || !map) return;

    const anim = animationRef.current;
    if (anim.started) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const duration = animationDuration * 1000;

    const updateCanvasSize = () => {
      const width = map.getContainer().offsetWidth;
      const height = map.getContainer().offsetHeight;
      if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const startAnimation = () => {
      updateCanvasSize();
      anim.started = true;
      anim.startTime = performance.now();
      anim.trailTs = [];
      anim.particles = [];
      anim.explosionPhase = false;
      anim.damagePhase = false;
      anim.damagePhaseStart = null;
      anim.explosionSoundPlayed = false;

      const animate = (timestamp) => {
        if (!anim.started) return;

        const elapsed = timestamp - anim.startTime;
        const progress = Math.min(elapsed / duration, 1);

        updateCanvasSize();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!anim.explosionPhase) {
          const currentIndex = Math.floor(progress * (trajectory.length - 1));
          const currentPoint = trajectory[currentIndex];
          if (!currentPoint) {
            anim.frameId = requestAnimationFrame(animate);
            return;
          }

          const screenPos = map.latLngToContainerPoint([currentPoint.lat, currentPoint.lng]);

          anim.trailTs.push(progress);

          // Draw trail
          if (anim.trailTs.length > 1) {
            ctx.beginPath();
            const firstT = anim.trailTs[0];
            const firstIndex = Math.floor(firstT * (trajectory.length - 1));
            const firstPoint = trajectory[firstIndex];
            const firstScreen = map.latLngToContainerPoint([firstPoint.lat, firstPoint.lng]);
            ctx.moveTo(firstScreen.x, firstScreen.y);

            for (let i = 1; i < anim.trailTs.length; i++) {
              const t = anim.trailTs[i];
              const idx = Math.floor(t * (trajectory.length - 1));
              const point = trajectory[idx];
              const pos = map.latLngToContainerPoint([point.lat, point.lng]);
              const alpha = 1 - (anim.trailTs.length - i) / anim.trailTs.length;
              ctx.strokeStyle = `rgba(255, ${150 - i * 1.5}, 50, ${alpha * 0.8})`;
              ctx.lineWidth = 3;
              ctx.lineTo(pos.x, pos.y);
            }
            ctx.stroke();
          }

          // Draw missile with realistic shape
          const scale = 1 + (currentPoint.height / 500) * 0.3;
          const missileSize = 14 * scale;

          ctx.save();
          ctx.translate(screenPos.x, screenPos.y);

          let angle = 0;
          if (currentIndex < trajectory.length - 1) {
            const nextPoint = trajectory[currentIndex + 1];
            const nextScreen = map.latLngToContainerPoint([nextPoint.lat, nextPoint.lng]);
            angle = Math.atan2(nextScreen.y - screenPos.y, nextScreen.x - screenPos.x) + Math.PI / 2;
          }
          ctx.rotate(angle);

          // Draw realistic missile based on type
          drawMissile(ctx, missile, missileSize);

          ctx.restore();

          if (progress >= 1) {
            anim.explosionPhase = true;
            const targetScreen = map.latLngToContainerPoint([target.lat, target.lng]);
            anim.particles = createExplosionParticles(200, targetScreen.x, targetScreen.y);
            // Play explosion sound once
            if (!anim.explosionSoundPlayed) {
              playExplosionSound();
              anim.explosionSoundPlayed = true;
            }
          }
        } else {
          const explosionProgress = (elapsed - duration) / 3000;
          const targetScreen = map.latLngToContainerPoint([target.lat, target.lng]);

          if (explosionProgress < 1 && !anim.damagePhase) {
            anim.particles.forEach(p => {
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.1;
              p.life -= p.decay;
              p.size *= 0.98;
            });

            anim.particles.forEach(p => {
              if (p.life <= 0) return;
              ctx.globalAlpha = p.life;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
            });
            ctx.globalAlpha = 1;

            const shockwaveRadius = explosionProgress * 200;
            const shockwaveOpacity = 1 - explosionProgress;

            ctx.strokeStyle = `rgba(255, 200, 100, ${shockwaveOpacity})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(targetScreen.x, targetScreen.y, shockwaveRadius, 0, Math.PI * 2);
            ctx.stroke();

            const gradient = ctx.createRadialGradient(
              targetScreen.x, targetScreen.y, 0,
              targetScreen.x, targetScreen.y, shockwaveRadius * 0.5
            );
            gradient.addColorStop(0, `rgba(255, 255, 200, ${shockwaveOpacity * 0.8})`);
            gradient.addColorStop(0.5, `rgba(255, 150, 50, ${shockwaveOpacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(targetScreen.x, targetScreen.y, shockwaveRadius * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            if (!anim.damagePhase) {
              anim.damagePhase = true;
              anim.damagePhaseStart = performance.now();
            }

            if (damageRadii) {
              const radiusKm = damageRadii.thermal.radius;
              const radiusMeters = radiusKm * 1000;
              const metersPerPixel = map.distance(
                map.containerPointToLatLng([targetScreen.x, targetScreen.y]),
                map.containerPointToLatLng([targetScreen.x + 1, targetScreen.y + 1])
              );
              const radiusPx = radiusMeters / metersPerPixel;

              ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
              ctx.beginPath();
              ctx.arc(targetScreen.x, targetScreen.y, radiusPx, 0, Math.PI * 2);
              ctx.fill();

              ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.stroke();
              ctx.setLineDash([]);

              ctx.fillStyle = '#FF0000';
              ctx.font = '12px "Share Tech Mono", monospace';
              ctx.fillText(
                `${radiusKm.toFixed(1)} km blast radius`,
                targetScreen.x + 10,
                targetScreen.y
              );
            }

            const damageElapsed = performance.now() - anim.damagePhaseStart;
            if (damageElapsed > 3000) {
              anim.started = false;
              onComplete();
              return;
            }
          }
        }

        if (anim.started) {
          anim.frameId = requestAnimationFrame(animate);
        }
      };

      anim.frameId = requestAnimationFrame(animate);
    };

    const handleZoom = () => {
      updateCanvasSize();
    };
    map.on('zoom', handleZoom);
    map.on('zoomend', handleZoom);

    if (map._loaded) {
      startAnimation();
    } else {
      map.whenReady(startAnimation);
    }

    return () => {
      cleanup();
      map.off('zoom', handleZoom);
      map.off('zoomend', handleZoom);
    };
  }, [origin, target, missile, animationDuration, map, onComplete, trajectory, damageRadii, cleanup]);

  return (
    <canvas
      ref={canvasRef}
      className="missile-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    />
  );
}

// Draw realistic missile based on type
function drawMissile(ctx, missile, size) {
  const color = missile.color || '#FFFFFF';
  const type = missile.type;

  // Draw exhaust flame first (behind missile)
  ctx.save();
  const flameGradient = ctx.createLinearGradient(0, size * 0.3, 0, size * 1.2);
  flameGradient.addColorStop(0, 'rgba(255, 200, 50, 0.9)');
  flameGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.7)');
  flameGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
  ctx.fillStyle = flameGradient;
  ctx.beginPath();
  ctx.moveTo(-size * 0.3, size * 0.3);
  ctx.quadraticCurveTo(-size * 0.5, size * 0.8, 0, size * 1.2);
  ctx.quadraticCurveTo(size * 0.5, size * 0.8, size * 0.3, size * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Missile body gradient
  const bodyGradient = ctx.createLinearGradient(-size * 0.2, 0, size * 0.2, 0);
  bodyGradient.addColorStop(0, shadeColor(color, -30));
  bodyGradient.addColorStop(0.3, color);
  bodyGradient.addColorStop(0.7, color);
  bodyGradient.addColorStop(1, shadeColor(color, -30));

  if (type === 'CRUISE') {
    // Cruise missile - longer, sleek body
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    // Nose cone
    ctx.moveTo(0, -size * 1.2);
    ctx.quadraticCurveTo(size * 0.15, -size * 0.8, size * 0.15, -size * 0.3);
    // Body
    ctx.lineTo(size * 0.15, size * 0.4);
    // Tail
    ctx.lineTo(size * 0.4, size * 0.5);
    ctx.lineTo(size * 0.4, size * 0.7);
    ctx.lineTo(size * 0.15, size * 0.6);
    ctx.lineTo(0, size * 0.7);
    ctx.lineTo(-size * 0.15, size * 0.6);
    ctx.lineTo(-size * 0.4, size * 0.7);
    ctx.lineTo(-size * 0.4, size * 0.5);
    ctx.lineTo(-size * 0.15, size * 0.4);
    ctx.lineTo(-size * 0.15, -size * 0.3);
    ctx.quadraticCurveTo(-size * 0.15, -size * 0.8, 0, -size * 1.2);
    ctx.closePath();
    ctx.fill();

    // Wings for cruise missile
    ctx.fillStyle = shadeColor(color, -20);
    ctx.fillRect(-size * 0.5, size * 0.2, size * 0.15, size * 0.3);
    ctx.fillRect(size * 0.35, size * 0.2, size * 0.15, size * 0.3);
  } else if (type === 'HYPERSONIC') {
    // Hypersonic - very sleek, pointed
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.4);
    ctx.quadraticCurveTo(size * 0.12, -size * 0.9, size * 0.12, size * 0.3);
    ctx.lineTo(size * 0.25, size * 0.5);
    ctx.lineTo(0, size * 0.6);
    ctx.lineTo(-size * 0.25, size * 0.5);
    ctx.lineTo(-size * 0.12, size * 0.3);
    ctx.quadraticCurveTo(-size * 0.12, -size * 0.9, 0, -size * 1.4);
    ctx.closePath();
    ctx.fill();

    // Glide wings
    ctx.fillStyle = shadeColor(color, -15);
    ctx.beginPath();
    ctx.moveTo(-size * 0.15, 0);
    ctx.lineTo(-size * 0.6, size * 0.3);
    ctx.lineTo(-size * 0.5, size * 0.4);
    ctx.lineTo(-size * 0.15, size * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.15, 0);
    ctx.lineTo(size * 0.6, size * 0.3);
    ctx.lineTo(size * 0.5, size * 0.4);
    ctx.lineTo(size * 0.15, size * 0.2);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'SLBM') {
    // Submarine launched - cylindrical, blunt nose
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.9);
    ctx.lineTo(size * 0.15, -size * 0.7);
    ctx.lineTo(size * 0.18, size * 0.4);
    ctx.lineTo(size * 0.3, size * 0.6);
    ctx.lineTo(0, size * 0.6);
    ctx.lineTo(-size * 0.3, size * 0.6);
    ctx.lineTo(-size * 0.18, size * 0.4);
    ctx.lineTo(-size * 0.15, -size * 0.7);
    ctx.closePath();
    ctx.fill();

    // Engine nozzles
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(-size * 0.12, size * 0.55, size * 0.08, 0, Math.PI * 2);
    ctx.arc(size * 0.12, size * 0.55, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Standard ballistic missile (ICBM, IRBM, SRBM)
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    // Nose cone
    ctx.moveTo(0, -size * 1.2);
    ctx.quadraticCurveTo(size * 0.18, -size * 0.7, size * 0.18, -size * 0.2);
    // Body
    ctx.lineTo(size * 0.18, size * 0.3);
    // Engine section
    ctx.lineTo(size * 0.35, size * 0.5);
    ctx.lineTo(size * 0.35, size * 0.65);
    ctx.lineTo(size * 0.18, size * 0.55);
    ctx.lineTo(0, size * 0.65);
    ctx.lineTo(-size * 0.18, size * 0.55);
    ctx.lineTo(-size * 0.35, size * 0.65);
    ctx.lineTo(-size * 0.35, size * 0.5);
    ctx.lineTo(-size * 0.18, size * 0.3);
    ctx.lineTo(-size * 0.18, -size * 0.2);
    ctx.quadraticCurveTo(-size * 0.18, -size * 0.7, 0, -size * 1.2);
    ctx.closePath();
    ctx.fill();

    // Fins at bottom
    ctx.fillStyle = shadeColor(color, -25);
    ctx.beginPath();
    ctx.moveTo(-size * 0.18, size * 0.35);
    ctx.lineTo(-size * 0.5, size * 0.6);
    ctx.lineTo(-size * 0.35, size * 0.65);
    ctx.lineTo(-size * 0.18, size * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.18, size * 0.35);
    ctx.lineTo(size * 0.5, size * 0.6);
    ctx.lineTo(size * 0.35, size * 0.65);
    ctx.lineTo(size * 0.18, size * 0.55);
    ctx.closePath();
    ctx.fill();

    // Center fin
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.lineTo(-size * 0.15, size * 0.65);
    ctx.lineTo(size * 0.15, size * 0.65);
    ctx.closePath();
    ctx.fill();
  }

  // Add highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.ellipse(-size * 0.08, -size * 0.3, size * 0.05, size * 0.25, -0.2, 0, Math.PI * 2);
  ctx.fill();
}

function shadeColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

function createExplosionParticles(count, startX = 0, startY = 0) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 8;
    const size = 3 + Math.random() * 10;

    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size,
      color: getFireColor(Math.random()),
      life: 1.0,
      decay: 0.01 + Math.random() * 0.02
    });
  }
  return particles;
}

function getFireColor(t) {
  if (t < 0.2) return '#FFFFFF';
  if (t < 0.4) return '#FFFF00';
  if (t < 0.6) return '#FF8800';
  if (t < 0.8) return '#FF4400';
  return '#880000';
}
