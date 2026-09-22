/**
 * GANESH – THE JOURNEY
 * World 1, Level 4: The Celebration
 * Joyful festival preparation: collect 8 modaks & 10 flowers, assist Mushika
 * in hanging garlands, light sacred diyas, arrange rangoli, and offer the grand Aarti.
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level1_4 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.phase = "collect"; // collect -> decorate -> mushika_task -> grand_aarti -> complete
    this.targetModaks = 8;
    this.targetFlowers = 10;
    this.decorationsPlaced = 0;
    this.targetDecorations = 4;
    this.isMushikaGarlandDone = false;
  }

  setupLevel() {
    this.phase = "collect";
    this.modaksCollected = 0;
    this.flowersCollected = 0;
    this.decorationsPlaced = 0;
    this.isMushikaGarlandDone = false;

    // Scatter 8 delicious modaks
    const modakPositions = [
      { x: 180, y: 340 }, { x: 300, y: 440 }, { x: 420, y: 560 }, { x: 520, y: 380 },
      { x: 740, y: 380 }, { x: 840, y: 560 }, { x: 960, y: 440 }, { x: 1100, y: 340 }
    ];

    modakPositions.forEach((pos, idx) => {
      this.collectibles.push({
        x: pos.x,
        y: pos.y,
        radius: 18,
        type: "modak",
        render: (ctx) => Sprites.drawModak(ctx, pos.x, pos.y, 0.9, Math.sin(this.elapsedTime * 4 + idx) * 2.5)
      });
    });

    // Scatter 10 vibrant flowers
    const flowerPositions = [
      { x: 140, y: 460 }, { x: 240, y: 580 }, { x: 360, y: 340 }, { x: 480, y: 480 },
      { x: 640, y: 580 }, { x: 800, y: 480 }, { x: 920, y: 340 }, { x: 1040, y: 580 },
      { x: 1140, y: 460 }, { x: 640, y: 320 }
    ];

    flowerPositions.forEach(pos => {
      this.collectibles.push({
        x: pos.x,
        y: pos.y,
        radius: 18,
        type: "flower",
        render: (ctx) => Sprites.drawFlower(ctx, pos.x, pos.y, 0.9)
      });
    });

    // 4 Decorative Altar Stations
    this.decorStations = [
      { id: "diya_left", x: 480, y: 260, name: "Brass Diya (Left)", placed: false },
      { id: "diya_right", x: 800, y: 260, name: "Brass Diya (Right)", placed: false },
      { id: "rangoli", x: 640, y: 420, name: "Lotus Rangoli Pattern", placed: false },
      { id: "saffron_cloth", x: 640, y: 250, name: "Saffron Silk Draping", placed: false }
    ];

    this.decorStations.forEach((station) => {
      this.interactables.push({
        x: station.x,
        y: station.y,
        interactionRadius: 65,
        promptText: `Place ${station.name}`,
        promptOffset: 35,
        onInteract: () => this.placeDecoration(station),
        render: (ctx) => {
          if (station.placed) {
            if (station.id.startsWith("diya")) {
              Sprites.drawDiya(ctx, station.x, station.y, 1.2, true, this.elapsedTime);
            } else if (station.id === "rangoli") {
              this.drawLotusRangoli(ctx, station.x, station.y);
            }
          } else {
            // Outlined placement marker
            ctx.save();
            ctx.strokeStyle = "rgba(244, 196, 48, 0.6)";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(station.x, station.y, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
      });
    });

    // Mushika High Garland Station
    this.garlandStation = { x: 640, y: 160 };
    this.interactables.push({
      x: this.garlandStation.x,
      y: 260,
      interactionRadius: 80,
      promptText: "Ask Mushika to hang Golden Garland",
      promptOffset: 55,
      onInteract: () => this.triggerMushikaGarland()
    });

    // Central Altar for Final Offering
    this.altar = { x: 640, y: 240 };
    this.interactables.push({
      x: this.altar.x,
      y: this.altar.y,
      interactionRadius: 85,
      promptText: "Offer Sacred Aarti & Modaks",
      promptOffset: 65,
      onInteract: () => this.offerGrandAarti()
    });

    this.queueDialogue([
      {
        speaker: "parvati",
        text: "Kailash rejoices today! Gather 8 sweet modaks and 10 fresh flowers to prepare the grand festival altar."
      },
      {
        speaker: "vinayaka",
        text: "I will make the celebration radiant with flowers, diyas, and rangoli!"
      }
    ]);
  }

  placeDecoration(station) {
    if (station.placed) return;

    // Check if enough items collected
    if (this.modaksCollected < 2 || this.flowersCollected < 2) {
      this.queueDialogue([
        {
          speaker: "vinayaka",
          text: "Let me collect more flowers and modaks before preparing this sacred decoration!"
        }
      ]);
      return;
    }

    station.placed = true;
    this.decorationsPlaced++;
    sound.playTempleBell(523.25);
    particles.spawnSparkles(station.x, station.y, 20, "rgba(244, 196, 48,");
    this.addScore(200);

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: `Placed ${station.name}! The courtyard shines brighter (${this.decorationsPlaced}/${this.targetDecorations}).`
      }
    ]);
  }

  triggerMushikaGarland() {
    if (this.isMushikaGarlandDone) return;

    sound.playTempleBell(659.25);
    particles.spawnSparkles(this.garlandStation.x, this.garlandStation.y, 30, "rgba(255, 235, 130,");
    this.isMushikaGarlandDone = true;
    this.addScore(300);

    this.queueDialogue([
      {
        speaker: "mushika",
        text: "With a nimble leap, I have fastened the golden marigold garland atop the sacred pillars!"
      },
      {
        speaker: "vinayaka",
        text: "Wonderful work, Mushika! The altar is nearly complete. Let's offer the Grand Aarti."
      }
    ]);
  }

  offerGrandAarti() {
    // Check if prerequisites are done
    if (this.modaksCollected < this.targetModaks || this.flowersCollected < this.targetFlowers || this.decorationsPlaced < this.targetDecorations || !this.isMushikaGarlandDone) {
      this.queueDialogue([
        {
          speaker: "vinayaka",
          text: `We need all offerings ready: Modaks (${this.modaksCollected}/${this.targetModaks}), Flowers (${this.flowersCollected}/${this.targetFlowers}), Decorations (${this.decorationsPlaced}/${this.targetDecorations}), and Mushika's Garland!`
        }
      ]);
      return;
    }

    this.phase = "grand_aarti";
    sound.playShankha();
    sound.playTempleBell(523.25);
    particles.spawnPetalShower(GAME_CONFIG.VIRTUAL_WIDTH, 40);

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Om Gam Ganapataye Namaha! With pure devotion, we offer the golden lamps and fragrant sweets."
      },
      {
        speaker: "shiva",
        text: "May the divine celebration bring prosperity, intellect, and joy to all realms!"
      },
      {
        speaker: "parvati",
        text: "Vinayaka, your heart is as pure as the mountain snows. Accept our eternal love.",
        onComplete: () => {
          this.completeLevel(500);
        }
      }
    ]);
  }

  drawLotusRangoli(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // Draw 8 petal rangoli
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      ctx.save();
      ctx.rotate(angle);
      ctx.fillStyle = i % 2 === 0 ? "#e74c3c" : "#f4c430";
      ctx.beginPath();
      ctx.ellipse(0, -18, 8, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Rangoli center
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderBackground(ctx) {
    // Festive Kailash Altar Courtyard
    const ambientBrightness = 0.2 + (this.decorationsPlaced / this.targetDecorations) * 0.4;
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#19183b");
    sky.addColorStop(0.5, "#3b2247");
    sky.addColorStop(1, "#171424");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Altar Platform
    ctx.fillStyle = "#2c223b";
    ctx.strokeStyle = "#f4c430";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(400, 180, 480, 100, 12);
    ctx.fill();
    ctx.stroke();

    // Saffron Silk Draping if placed
    const saffronStation = this.decorStations.find(s => s.id === "saffron_cloth");
    if (saffronStation && saffronStation.placed) {
      ctx.fillStyle = "#e67e22";
      ctx.beginPath();
      ctx.roundRect(420, 190, 440, 20, 6);
      ctx.fill();
    }

    // High Garland if Mushika hung it
    if (this.isMushikaGarlandDone) {
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(380, 150);
      ctx.quadraticCurveTo(640, 200, 900, 150);
      ctx.stroke();
    }

    // Divine Shiva & Parvati standing at the Altar
    Sprites.drawShiva(ctx, 580, 220, 1.1);
    Sprites.drawParvati(ctx, 700, 220, 1.05);
  }

  renderPlayer(ctx) {
    Sprites.drawVinayaka(
      ctx,
      this.player.x,
      this.player.y,
      1.2,
      this.player.facing,
      this.player.isWalking,
      this.player.walkTime
    );

    // Mushika follows
    Sprites.drawMushika(ctx, this.player.x - 30 * this.player.facing, this.player.y, 1.2, this.player.facing, this.player.isWalking, this.elapsedTime);
  }
}
