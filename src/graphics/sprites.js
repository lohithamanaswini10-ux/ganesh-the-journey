/**
 * GANESH – THE JOURNEY
 * Sprites & Visual Art Engine
 * High-definition procedural vector graphics for sacred characters, deities, offerings, and environments.
 * 100% self-contained, lightweight, retina-ready.
 */

export class Sprites {
  /**
   * Draw Lord Vinayaka (Young Ganesha)
   */
  static drawVinayaka(ctx, x, y, scale = 1, facing = 1, isWalking = false, walkTime = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing * scale, scale);

    const bob = isWalking ? Math.sin(walkTime * 12) * 3 : Math.sin(walkTime * 3) * 1.5;
    const legSwing = isWalking ? Math.sin(walkTime * 12) * 6 : 0;

    // 1. Divine Aura / Halo
    const haloGrad = ctx.createRadialGradient(0, -35 + bob, 10, 0, -35 + bob, 45);
    haloGrad.addColorStop(0, "rgba(255, 235, 130, 0.55)");
    haloGrad.addColorStop(0.6, "rgba(244, 196, 48, 0.25)");
    haloGrad.addColorStop(1, "rgba(244, 196, 48, 0)");
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, -35 + bob, 45, 0, Math.PI * 2);
    ctx.fill();

    // 2. Feet / Dhoti Legs
    ctx.fillStyle = "#e67e22"; // Saffron dhoti
    // Left leg
    ctx.beginPath();
    ctx.ellipse(-12, -4 + legSwing, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Right leg
    ctx.beginPath();
    ctx.ellipse(12, -4 - legSwing, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Cute Sturdy Torso & Lambodara (Sweet Belly)
    ctx.fillStyle = "#f5b041"; // Warm golden skin
    ctx.beginPath();
    ctx.ellipse(0, -20 + bob, 17, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden necklace & Janeu (sacred thread)
    ctx.strokeStyle = "#f4d03f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -25 + bob, 11, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Janeu across shoulder
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-10, -32 + bob);
    ctx.lineTo(12, -12 + bob);
    ctx.stroke();

    // 4. Large Compassionate Ears
    ctx.fillStyle = "#f5b041";
    // Left ear
    ctx.beginPath();
    ctx.ellipse(-23, -42 + bob, 11, 14, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f1948a"; // Pink ear inner
    ctx.beginPath();
    ctx.ellipse(-23, -42 + bob, 6, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Right ear
    ctx.fillStyle = "#f5b041";
    ctx.beginPath();
    ctx.ellipse(23, -42 + bob, 11, 14, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f1948a";
    ctx.beginPath();
    ctx.ellipse(23, -42 + bob, 6, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Head
    ctx.fillStyle = "#f5b041";
    ctx.beginPath();
    ctx.arc(0, -42 + bob, 18, 0, Math.PI * 2);
    ctx.fill();

    // 6. Sacred Tilak on Forehead (Trishul / Crescent & Bindu)
    ctx.fillStyle = "#c0392b";
    ctx.beginPath();
    ctx.ellipse(0, -48 + bob, 2.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4d03f";
    ctx.beginPath();
    ctx.arc(0, -43 + bob, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 7. Kind Loving Eyes
    ctx.fillStyle = "#2c3e50";
    ctx.beginPath();
    ctx.ellipse(-7, -43 + bob, 2.2, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(7, -43 + bob, 2.2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-8, -44 + bob, 0.9, 0, Math.PI * 2);
    ctx.arc(6, -44 + bob, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // 8. Broken Tusk (Ekadanta) & Right Tusk
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(8, -35 + bob);
    ctx.lineTo(13, -31 + bob);
    ctx.lineTo(8, -32 + bob);
    ctx.fill();
    // Left broken tusk (symbol of wisdom and sacrifice)
    ctx.beginPath();
    ctx.moveTo(-8, -35 + bob);
    ctx.lineTo(-11, -33 + bob);
    ctx.lineTo(-8, -33 + bob);
    ctx.fill();

    // 9. Graceful Curved Trunk holding Modak
    ctx.fillStyle = "#f5b041";
    ctx.strokeStyle = "#d68910";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -38 + bob);
    ctx.bezierCurveTo(-2, -30 + bob, -4, -22 + bob, 4, -18 + bob);
    ctx.bezierCurveTo(9, -15 + bob, 12, -22 + bob, 9, -24 + bob);
    ctx.bezierCurveTo(6, -23 + bob, 4, -26 + bob, 3, -38 + bob);
    ctx.fill();

    // Modak at tip of trunk
    this.drawModak(ctx, 12, -24 + bob, 0.55);

    // 10. Golden Crown (Mukut)
    ctx.fillStyle = "#f4d03f";
    ctx.strokeStyle = "#b7950b";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-12, -55 + bob);
    ctx.lineTo(0, -74 + bob);
    ctx.lineTo(12, -55 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crown Ruby
    ctx.fillStyle = "#c0392b";
    ctx.beginPath();
    ctx.arc(0, -62 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 11. Hands: Right Hand Abhaya Mudra (Blessing)
    ctx.fillStyle = "#f5b041";
    ctx.beginPath();
    ctx.arc(-16, -22 + bob, 5, 0, Math.PI * 2);
    ctx.fill();
    // Lotus mark on palm
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(-16, -22 + bob, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Mushika (The Devoted Mouse Companion)
   */
  static drawMushika(ctx, x, y, scale = 1, facing = 1, isScampering = false, time = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing * scale, scale);

    const bob = isScampering ? Math.sin(time * 16) * 2 : 0;
    const tailWag = Math.sin(time * 10) * 0.3;

    // Soft Shadow
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.strokeStyle = "#d5dbdb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -6 + bob);
    ctx.bezierCurveTo(-18, -12 + bob + tailWag * 10, -22, -4 + bob, -26, -12 + bob + tailWag * 14);
    ctx.stroke();

    // Body
    ctx.fillStyle = "#bdc3c7";
    ctx.beginPath();
    ctx.ellipse(0, -8 + bob, 12, 8, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = "#f1948a";
    ctx.beginPath();
    ctx.arc(7, -17 + bob, 4, 0, Math.PI * 2);
    ctx.arc(3, -18 + bob, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = "#bdc3c7";
    ctx.beginPath();
    ctx.moveTo(4, -14 + bob);
    ctx.lineTo(15, -8 + bob);
    ctx.lineTo(4, -4 + bob);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = "#1b2631";
    ctx.beginPath();
    ctx.arc(8, -11 + bob, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Bell Collar
    ctx.fillStyle = "#f4d03f";
    ctx.beginPath();
    ctx.arc(4, -5 + bob, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Divine Mother Parvati
   */
  static drawParvati(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Radiant Divine Aura
    const aura = ctx.createRadialGradient(0, -50, 10, 0, -50, 65);
    aura.addColorStop(0, "rgba(255, 223, 100, 0.65)");
    aura.addColorStop(0.7, "rgba(230, 126, 34, 0.2)");
    aura.addColorStop(1, "rgba(230, 126, 34, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -50, 65, 0, Math.PI * 2);
    ctx.fill();

    // Elegant Red & Gold Saree
    ctx.fillStyle = "#922b21";
    ctx.beginPath();
    ctx.moveTo(-16, -10);
    ctx.lineTo(-24, 0);
    ctx.lineTo(24, 0);
    ctx.lineTo(16, -10);
    ctx.lineTo(12, -45);
    ctx.lineTo(-12, -45);
    ctx.closePath();
    ctx.fill();

    // Gold Saree Borders
    ctx.strokeStyle = "#f4d03f";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-24, 0);
    ctx.lineTo(24, 0);
    ctx.stroke();

    // Face
    ctx.fillStyle = "#f5cba7";
    ctx.beginPath();
    ctx.arc(0, -58, 14, 0, Math.PI * 2);
    ctx.fill();

    // Hair & Crown
    ctx.fillStyle = "#17202a";
    ctx.beginPath();
    ctx.arc(0, -62, 15, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f4d03f";
    ctx.beginPath();
    ctx.moveTo(-10, -68);
    ctx.lineTo(0, -84);
    ctx.lineTo(10, -68);
    ctx.closePath();
    ctx.fill();

    // Serene Eyes & Bindi
    ctx.fillStyle = "#c0392b";
    ctx.beginPath();
    ctx.arc(0, -62, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#17202a";
    ctx.beginPath();
    ctx.arc(-5, -57, 1.5, 0, Math.PI * 2);
    ctx.arc(5, -57, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Lord Shiva
   */
  static drawShiva(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Cosmic Radiant Halo
    const aura = ctx.createRadialGradient(0, -55, 15, 0, -55, 75);
    aura.addColorStop(0, "rgba(214, 234, 248, 0.7)");
    aura.addColorStop(0.6, "rgba(93, 173, 226, 0.3)");
    aura.addColorStop(1, "rgba(93, 173, 226, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -55, 75, 0, Math.PI * 2);
    ctx.fill();

    // Trishula in Background
    ctx.strokeStyle = "#b7950b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(22, -95);
    ctx.stroke();

    // Trishul Head
    ctx.fillStyle = "#f4d03f";
    ctx.beginPath();
    ctx.moveTo(22, -108);
    ctx.lineTo(16, -95);
    ctx.lineTo(28, -95);
    ctx.closePath();
    ctx.fill();

    // Tiger Skin / Dhoti
    ctx.fillStyle = "#d35400";
    ctx.beginPath();
    ctx.moveTo(-16, -15);
    ctx.lineTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.lineTo(16, -15);
    ctx.closePath();
    ctx.fill();

    // Torso (Divine Ash / Bhasma Toned)
    ctx.fillStyle = "#d5dbdb";
    ctx.beginPath();
    ctx.ellipse(0, -32, 16, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blue Throat (Neelakantha)
    ctx.fillStyle = "#2980b9";
    ctx.beginPath();
    ctx.arc(0, -46, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = "#d5dbdb";
    ctx.beginPath();
    ctx.arc(0, -60, 15, 0, Math.PI * 2);
    ctx.fill();

    // Matted Jata (Hair)
    ctx.fillStyle = "#34495e";
    ctx.beginPath();
    ctx.arc(0, -70, 12, 0, Math.PI * 2);
    ctx.fill();

    // Crescent Moon (Chandra) in Jata
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(10, -72, 6, 0.4, Math.PI * 1.6);
    ctx.fill();

    // Sacred Tripundra & Third Eye
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-6, -64); ctx.lineTo(6, -64);
    ctx.moveTo(-6, -62); ctx.lineTo(6, -62);
    ctx.moveTo(-6, -60); ctx.lineTo(6, -60);
    ctx.stroke();

    ctx.fillStyle = "#c0392b"; // Third Eye
    ctx.beginPath();
    ctx.ellipse(0, -62, 1.2, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Subrahmanya (Kartikeya) with Peacock Vahana
   */
  static drawSubrahmanya(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Peacock Body alongside
    ctx.fillStyle = "#1a5276";
    ctx.beginPath();
    ctx.ellipse(22, -15, 16, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Peacock Plumage
    ctx.fillStyle = "#117864";
    ctx.beginPath();
    ctx.arc(32, -22, 12, 0, Math.PI * 2);
    ctx.fill();

    // Subrahmanya Torso
    ctx.fillStyle = "#f5cba7";
    ctx.beginPath();
    ctx.ellipse(0, -26, 13, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dhoti
    ctx.fillStyle = "#f39c12";
    ctx.beginPath();
    ctx.moveTo(-12, -10);
    ctx.lineTo(-14, 0);
    ctx.lineTo(14, 0);
    ctx.lineTo(12, -10);
    ctx.closePath();
    ctx.fill();

    // Golden Vel (Spear)
    ctx.strokeStyle = "#b7950b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-16, -75);
    ctx.stroke();

    ctx.fillStyle = "#f4d03f";
    ctx.beginPath();
    ctx.moveTo(-16, -86);
    ctx.lineTo(-22, -72);
    ctx.lineTo(-10, -72);
    ctx.closePath();
    ctx.fill();

    // Face & Royal Crown
    ctx.fillStyle = "#f5cba7";
    ctx.beginPath();
    ctx.arc(0, -50, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f4d03f";
    ctx.beginPath();
    ctx.moveTo(-8, -58);
    ctx.lineTo(0, -72);
    ctx.lineTo(8, -58);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Traditional Modak
   */
  static drawModak(ctx, x, y, scale = 1, bob = 0) {
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(scale, scale);

    // Warm Shimmer Aura
    const aura = ctx.createRadialGradient(0, -10, 2, 0, -10, 22);
    aura.addColorStop(0, "rgba(255, 235, 130, 0.45)");
    aura.addColorStop(1, "rgba(255, 235, 130, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -10, 22, 0, Math.PI * 2);
    ctx.fill();

    // Sacred Modak Body (Rice Flour Creamy Texture)
    ctx.fillStyle = "#fffdf0";
    ctx.strokeStyle = "#f0dfb8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -22); // pointed pleated crown
    ctx.bezierCurveTo(-14, -12, -14, -2, 0, 0);
    ctx.bezierCurveTo(14, -2, 14, -12, 0, -22);
    ctx.fill();
    ctx.stroke();

    // Modak Pleat Lines
    ctx.strokeStyle = "#e8d5a8";
    ctx.lineWidth = 0.9;
    for (let i = -8; i <= 8; i += 4) {
      ctx.beginPath();
      ctx.moveTo(0, -21);
      ctx.quadraticCurveTo(i * 1.2, -10, i, 0);
      ctx.stroke();
    }

    // Saffron Tip Dot
    ctx.fillStyle = "#e67e22";
    ctx.beginPath();
    ctx.arc(0, -22, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Red Hibiscus Flower
   */
  static drawFlower(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // 5 Red Petals
    ctx.fillStyle = "#c0392b";
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -12, 7, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Yellow Golden Stamen
    ctx.fillStyle = "#f4d03f";
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#f4d03f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -16);
    ctx.stroke();

    ctx.fillStyle = "#e67e22";
    ctx.beginPath();
    ctx.arc(0, -16, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Traditional Brass Diya (Oil Lamp)
   */
  static drawDiya(ctx, x, y, scale = 1, isLit = true, flameTime = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Brass Diya Base & Bowl
    ctx.fillStyle = "#d4ac0d";
    ctx.strokeStyle = "#9a7d0a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-16, -6);
    ctx.bezierCurveTo(-14, 6, 14, 6, 16, -6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lamp Stem & Foot
    ctx.beginPath();
    ctx.rect(-3, 6, 6, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 14, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isLit) {
      const flameWag = Math.sin(flameTime * 14) * 1.5;
      const flameHeight = 14 + Math.cos(flameTime * 10) * 2;

      // Ambient Warm Glow
      const glow = ctx.createRadialGradient(0, -12, 2, 0, -12, 36);
      glow.addColorStop(0, "rgba(255, 195, 0, 0.6)");
      glow.addColorStop(0.5, "rgba(255, 87, 51, 0.2)");
      glow.addColorStop(1, "rgba(255, 87, 51, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, -12, 36, 0, Math.PI * 2);
      ctx.fill();

      // Outer Orange Flame
      ctx.fillStyle = "#ff5733";
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.quadraticCurveTo(flameWag, -6 - flameHeight, 0, -6 - flameHeight);
      ctx.quadraticCurveTo(flameWag, -6 - flameHeight, 6, -6);
      ctx.closePath();
      ctx.fill();

      // Inner Golden Heart
      ctx.fillStyle = "#ffeb3b";
      ctx.beginPath();
      ctx.moveTo(-3, -6);
      ctx.quadraticCurveTo(flameWag * 0.5, -6 - flameHeight * 0.7, 0, -6 - flameHeight * 0.7);
      ctx.quadraticCurveTo(flameWag * 0.5, -6 - flameHeight * 0.7, 3, -6);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Draw Visitor or Devotee for Gatekeeper & History Levels
   */
  static drawDevotee(ctx, x, y, scale = 1, type = "devotee") {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (type === "devotee") {
      // Devotee holding flower basket
      ctx.fillStyle = "#f8c471";
      ctx.beginPath();
      ctx.moveTo(-12, -10);
      ctx.lineTo(-15, 0);
      ctx.lineTo(15, 0);
      ctx.lineTo(12, -10);
      ctx.lineTo(8, -35);
      ctx.lineTo(-8, -35);
      ctx.closePath();
      ctx.fill();

      // Head
      ctx.fillStyle = "#edbb99";
      ctx.beginPath();
      ctx.arc(0, -45, 10, 0, Math.PI * 2);
      ctx.fill();

      // Flower Basket
      ctx.fillStyle = "#b9770e";
      ctx.beginPath();
      ctx.arc(14, -20, 7, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = "#c0392b";
      ctx.beginPath();
      ctx.arc(14, -22, 4, 0, Math.PI * 2);
      ctx.fill();

    } else if (type === "sage") {
      // Himalayan Rishi Sage with saffron robe & beard
      ctx.fillStyle = "#d35400";
      ctx.beginPath();
      ctx.moveTo(-14, -5);
      ctx.lineTo(-16, 0);
      ctx.lineTo(16, 0);
      ctx.lineTo(14, -5);
      ctx.lineTo(9, -40);
      ctx.lineTo(-9, -40);
      ctx.closePath();
      ctx.fill();

      // Head & White Beard
      ctx.fillStyle = "#edbb99";
      ctx.beginPath();
      ctx.arc(0, -48, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fdfefe"; // White beard
      ctx.beginPath();
      ctx.moveTo(-8, -46);
      ctx.lineTo(0, -32);
      ctx.lineTo(8, -46);
      ctx.closePath();
      ctx.fill();

      // Kamandalu (water pot)
      ctx.fillStyle = "#b7950b";
      ctx.beginPath();
      ctx.arc(-14, -18, 5, 0, Math.PI * 2);
      ctx.fill();

    } else if (type === "impostor") {
      // Shifty character with inconsistent shadow
      ctx.fillStyle = "#566573";
      ctx.beginPath();
      ctx.moveTo(-12, -10);
      ctx.lineTo(-14, 0);
      ctx.lineTo(14, 0);
      ctx.lineTo(12, -10);
      ctx.lineTo(8, -35);
      ctx.lineTo(-8, -35);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#edbb99";
      ctx.beginPath();
      ctx.arc(0, -45, 10, 0, Math.PI * 2);
      ctx.fill();

      // Discordant concealed dagger/staff
      ctx.strokeStyle = "#7f8c8d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, -25);
      ctx.lineTo(12, -5);
      ctx.stroke();

    } else {
      // General pilgrim
      ctx.fillStyle = "#e59866";
      ctx.beginPath();
      ctx.moveTo(-12, -10);
      ctx.lineTo(-14, 0);
      ctx.lineTo(14, 0);
      ctx.lineTo(12, -10);
      ctx.lineTo(8, -35);
      ctx.lineTo(-8, -35);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#edbb99";
      ctx.beginPath();
      ctx.arc(0, -45, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Draw Avatar in Dialogue Canvas
   */
  static drawAvatar(canvas, characterKey = "vinayaka") {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height * 0.82);

    if (characterKey === "vinayaka") {
      this.drawVinayaka(ctx, 0, 0, 1.15, 1, false, 0);
    } else if (characterKey === "parvati") {
      this.drawParvati(ctx, 0, 0, 0.95);
    } else if (characterKey === "shiva") {
      this.drawShiva(ctx, 0, 0, 0.85);
    } else if (characterKey === "subrahmanya") {
      this.drawSubrahmanya(ctx, 0, 0, 0.9);
    } else if (characterKey === "mushika") {
      this.drawMushika(ctx, 0, -10, 2.2, 1, false, 0);
    } else {
      this.drawDevotee(ctx, 0, 0, 1.1, characterKey);
    }

    ctx.restore();
  }
}
