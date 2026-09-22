/**
 * GANESH – THE JOURNEY
 * World 3, Level 1: Choose Clay
 * Selecting eco-friendly natural Shaadu clay, mixing with pure water,
 * kneading to optimal consistency, and preparing the sacred sculpting base.
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level3_1 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.phase = "select_material"; // select_material -> knead -> inspect -> complete
    this.kneadProgress = 0;
    this.targetKneads = 5;
  }

  setupLevel() {
    this.phase = "select_material";
    this.kneadProgress = 0;
    this.player.x = 200;
    this.player.y = 500;

    // Clay Selection Stations
    this.materials = [
      { id: "shaadu", name: "Natural Shaadu River Clay", eco: true, x: 420, y: 440, desc: "Sacred sediment from riverbeds that dissolves cleanly back into mother earth without harming aquatic life." },
      { id: "terracotta", name: "Natural Terracotta Red Soil", eco: true, x: 640, y: 440, desc: "Rich red soil, completely biodegradable, porous, and traditionally revered." },
      { id: "pop", name: "Plaster of Paris (Synthetic)", eco: false, x: 860, y: 440, desc: "Non-biodegradable synthetic gypsum that does not dissolve in water and harms river ecosystems." }
    ];

    this.materials.forEach(mat => {
      this.interactables.push({
        x: mat.x,
        y: mat.y,
        interactionRadius: 80,
        promptText: `Inspect: ${mat.name}`,
        promptOffset: 50,
        onInteract: () => this.inspectMaterial(mat),
        render: (ctx) => {
          ctx.save();
          ctx.fillStyle = mat.eco ? "rgba(46, 204, 113, 0.25)" : "rgba(231, 76, 60, 0.25)";
          ctx.strokeStyle = mat.eco ? "#2ecc71" : "#e74c3c";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(mat.x, mat.y, 30, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.font = "26px Nunito";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(mat.eco ? "🌱" : "⚠️", mat.x, mat.y);
          ctx.restore();
        }
      });
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Welcome to the Sculpture World! Here we craft an eco-friendly Ganesha murti with our own hands, learning every sacred touch."
      },
      {
        speaker: "vinayaka",
        text: "First, let us choose the right clay. Nature is divine; we must choose earth that returns gently to earth."
      }
    ]);
  }

  inspectMaterial(mat) {
    if (mat.eco) {
      sound.playPuzzleSuccess();
      particles.spawnSparkles(mat.x, mat.y, 25, "rgba(46, 204, 113,");
      this.addScore(300);

      this.queueDialogue([
        {
          speaker: "vinayaka",
          text: `[Selected: ${mat.name}]: ${mat.desc}`
        },
        {
          speaker: "vinayaka",
          text: "An auspicious, eco-conscious choice! Now let us add pure water and knead the clay to smooth consistency.",
          onComplete: () => this.startKneadingPhase()
        }
      ]);
    } else {
      sound.playMistake();
      this.reduceGuardianMeter(10);
      this.queueDialogue([
        {
          speaker: "vinayaka",
          text: `[Warning: ${mat.name}]: ${mat.desc} Plaster of Paris harms fish and sacred rivers. Let us choose natural earth!`
        }
      ]);
    }
  }

  startKneadingPhase() {
    this.phase = "knead";
    this.objective = "Knead the clay by tapping the kneading rhythm";
    this.updateHUD();

    const renderPuzzle = () => `
      <div style="text-align: center; color: #fff9e6; margin-bottom: 12px;">
        Tap the <strong>Knead & Smooth</strong> button to blend pure water and river clay:
      </div>
      <div style="background: rgba(20, 29, 51, 0.85); border: 2px solid #f4c430; border-radius: 12px; padding: 20px; text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 10px;">🏺</div>
        <div style="font-size: 1.1rem; color: #f4c430; font-weight: bold; margin-bottom: 8px;">Clay Texture: ${Math.round((this.kneadProgress / this.targetKneads) * 100)}% Ready</div>
        <div style="width: 100%; height: 12px; background: rgba(255,255,255,0.15); border-radius: 6px; overflow: hidden; margin-bottom: 16px;">
          <div style="width: ${(this.kneadProgress / this.targetKneads) * 100}%; height: 100%; background: #2ecc71; transition: width 0.2s ease;"></div>
        </div>
        <button id="btn-knead" class="gold-btn glow-btn" style="min-width: 160px; font-size: 1.1rem;">
          👐 Knead Clay
        </button>
      </div>
    `;

    const setupActions = () => {
      const btn = document.getElementById("btn-knead");
      if (!btn) return;

      btn.onclick = () => {
        this.kneadProgress++;
        sound.playTempleBell(440 + this.kneadProgress * 80);
        particles.spawnSparkles(640, 360, 15);
        this.addScore(100);

        if (this.kneadProgress >= this.targetKneads) {
          sound.playPuzzleSuccess();
          particles.spawnSparkles(640, 360, 40, "rgba(46, 204, 113,");
          this.game.closePuzzle();

          this.queueDialogue([
            {
              speaker: "vinayaka",
              text: "The Shaadu clay is velvety, pliable, and ready! We have established the pure foundation."
            },
            {
              speaker: "vinayaka",
              text: "Next, we shall shape the basic divine form of the murti.",
              onComplete: () => {
                this.completeLevel(500);
              }
            }
          ]);
        } else {
          const container = document.getElementById("puzzle-content");
          if (container) {
            container.innerHTML = renderPuzzle();
            setupActions();
          }
        }
      };
    };

    this.game.openPuzzle({
      title: "Clay Kneading & Texture Preparation",
      instruction: "Knead the sacred earth until it achieves perfect sculptability.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  renderBackground(ctx) {
    // Sculptor's traditional wooden artisan studio
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#2c1c11");
    sky.addColorStop(0.5, "#4a2c1a");
    sky.addColorStop(1, "#1c1109");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Artisan work table
    ctx.fillStyle = "#3e2415";
    ctx.fillRect(0, 380, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT - 380);
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

    Sprites.drawMushika(ctx, this.player.x - 30 * this.player.facing, this.player.y, 1.2, this.player.facing, this.player.isWalking, this.elapsedTime);
  }
}
