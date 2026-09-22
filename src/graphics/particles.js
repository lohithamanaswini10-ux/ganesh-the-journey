/**
 * GANESH – THE JOURNEY
 * Particle System: Divine Sparkles, Flower Showers & Sacred Ambience
 */

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.reducedEffects = false;
  }

  setReducedEffects(reduced) {
    this.reducedEffects = !!reduced;
    if (this.reducedEffects && this.particles.length > 20) {
      this.particles = this.particles.slice(0, 20);
    }
  }

  /**
   * Spawn golden divine sparkles at a point (e.g. collecting modak or solving puzzle)
   */
  spawnSparkles(x, y, count = 12, color = "rgba(255, 235, 130,") {
    const maxCount = this.reducedEffects ? Math.min(count, 5) : count;
    for (let i = 0; i < maxCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        size: 2 + Math.random() * 3.5,
        life: 0.6 + Math.random() * 0.6,
        maxLife: 0.6 + Math.random() * 0.6,
        color,
        type: "sparkle"
      });
    }
  }

  /**
   * Spawn sacred flower petals gently floating down (e.g. celebration or Visarjan)
   */
  spawnPetalShower(width, count = 25) {
    if (this.reducedEffects) count = Math.min(count, 8);
    const petalColors = ["#c0392b", "#e67e22", "#f39c12", "#f1948a"];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: -10 - Math.random() * 60,
        vx: (Math.random() - 0.5) * 40,
        vy: 30 + Math.random() * 50,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 4,
        size: 4 + Math.random() * 4,
        life: 4 + Math.random() * 3,
        maxLife: 4 + Math.random() * 3,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        type: "petal"
      });
    }
  }

  /**
   * Sacred Water Ripple for Visarjan Level
   */
  spawnRipple(x, y, maxRadius = 50) {
    this.particles.push({
      x,
      y,
      radius: 4,
      maxRadius,
      growth: 30,
      life: 1.5,
      maxLife: 1.5,
      type: "ripple"
    });
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.type === "sparkle") {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 60 * dt; // slight gravity
      } else if (p.type === "petal") {
        p.x += p.vx * dt + Math.sin(p.life * 4) * 0.8;
        p.y += p.vy * dt;
        p.rot += p.vRot * dt;
      } else if (p.type === "ripple") {
        p.radius += p.growth * dt;
      }
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);

      if (p.type === "sparkle") {
        ctx.fillStyle = `${p.color} ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "petal") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.type === "ripple") {
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        ctx.strokeStyle = "rgba(255, 235, 150, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.radius, p.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  clear() {
    this.particles = [];
  }
}

export const particles = new ParticleSystem();
