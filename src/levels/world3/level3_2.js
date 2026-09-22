/**
 * GANESH – THE JOURNEY
 * World 3, Level 2: Shape the Form
 * Sculpting the core divine anatomy:
 * 1. Lotus Pedestal Base
 * 2. Seated Torso (Lambodara)
 * 3. Sacred Elephant Head
 * 4. Graceful Curved Trunk
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level3_2 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.shapesFormed = {
      base: false,
      torso: false,
      head: false,
      trunk: false
    };

    this.steps = [
      { id: "base", name: "1. Sacred Lotus Pedestal", desc: "A sturdy foundation representing spiritual purity rising from worldly waters.", icon: "🪷" },
      { id: "torso", name: "2. Seated Torso (Lambodara)", desc: "The generous, peaceful belly that contains the entire manifest universe.", icon: "🟡" },
      { id: "head", name: "3. Sacred Head", desc: "The supreme elephant head symbolizing cosmic intellect and patience.", icon: "🐘" },
      { id: "trunk", name: "4. Graceful Curved Trunk", desc: "The Idampuri trunk turning gently toward the left, bringing auspicious peace.", icon: "➰" }
    ];
  }

  setupLevel() {
    this.shapesFormed = { base: false, torso: false, head: false, trunk: false };
    this.player.x = 240;
    this.player.y = 520;

    // Sculpting Turntable in Studio Center
    this.turntable = { x: 640, y: 440 };

    this.interactables.push({
      x: this.turntable.x,
      y: this.turntable.y,
      interactionRadius: 90,
      promptText: "Shape Clay on Turntable",
      promptOffset: 65,
      onInteract: () => this.openShapeSculptingModal(),
      render: (ctx) => {
        // Draw wooden sculpting turntable
        ctx.save();
        ctx.fillStyle = "#5c381e";
        ctx.strokeStyle = "#b8860b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(this.turntable.x, this.turntable.y + 20, 70, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw current clay murti progress on turntable
        this.drawClayProgress(ctx, this.turntable.x, this.turntable.y);
        ctx.restore();
      }
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Now comes the joy of shaping the form! Step up to the wooden turntable and build the murti from base to trunk."
      }
    ]);
  }

  openShapeSculptingModal() {
    const renderModal = () => {
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 14px;">
          Build the sacred silhouette in traditional anatomical order:
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
      `;

      this.steps.forEach((s) => {
        const isDone = this.shapesFormed[s.id];
        html += `
          <button class="gold-btn btn-sculpt-step" data-id="${s.id}" style="padding: 12px; text-align: left; display: flex; align-items: center; justify-content: space-between; background: ${isDone ? 'rgba(46, 204, 113, 0.3)' : 'rgba(20, 29, 51, 0.85)'}; border-color: ${isDone ? '#2ecc71' : '#f4c430'};">
            <div>
              <span style="font-size: 1.4rem; margin-right: 8px;">${s.icon}</span>
              <strong style="color: #f4c430;">${s.name}</strong><br>
              <span style="font-size: 0.78rem; color: #d5c8b0; margin-left: 32px;">${s.desc}</span>
            </div>
            <span>${isDone ? '✓ Formed' : '➔ Shape'}</span>
          </button>
        `;
      });

      html += `
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
          <button id="btn-undo-shape" class="nav-back-btn">↺ Reset Forms</button>
        </div>
      `;
      return html;
    };

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-sculpt-step").forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.id;
          if (!this.shapesFormed[id]) {
            // Must follow order: base -> torso -> head -> trunk
            const order = ["base", "torso", "head", "trunk"];
            const expected = order.find(k => !this.shapesFormed[k]);

            if (id === expected) {
              this.shapesFormed[id] = true;
              sound.playTempleBell(480 + order.indexOf(id) * 80);
              particles.spawnSparkles(640, 360, 20, "rgba(244, 196, 48,");
              this.addScore(200);

              const allDone = order.every(k => this.shapesFormed[k]);
              if (allDone) {
                sound.playPuzzleSuccess();
                particles.spawnSparkles(640, 360, 40, "rgba(46, 204, 113,");
                this.game.closePuzzle();

                this.queueDialogue([
                  {
                    speaker: "vinayaka",
                    text: "Splendid proportion! Base, torso, head, and trunk have emerged in graceful, loving harmony."
                  },
                  {
                    speaker: "vinayaka",
                    text: "Next, we shall carve the fine iconographic details: the listening ears, broken tusk, and crown.",
                    onComplete: () => {
                      this.completeLevel(500);
                    }
                  }
                ]);
              } else {
                container.innerHTML = renderModal();
                setupActions();
              }
            } else {
              sound.playMistake();
            }
          }
        };
      });

      const btnUndo = document.getElementById("btn-undo-shape");
      if (btnUndo) {
        btnUndo.onclick = () => {
          this.shapesFormed = { base: false, torso: false, head: false, trunk: false };
          sound.playClick();
          container.innerHTML = renderModal();
          setupActions();
        };
      }
    };

    this.game.openPuzzle({
      title: "Shaping the Sacred Form",
      instruction: "Shape each anatomical element from foundation to crown.",
      render: renderModal,
      onOpen: setupActions
    });
  }

  drawClayProgress(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Natural Shaadu clay gray/brown shade
    ctx.fillStyle = "#8a735b";
    ctx.strokeStyle = "#5a4836";
    ctx.lineWidth = 1.5;

    // 1. Base
    if (this.shapesFormed.base) {
      ctx.beginPath();
      ctx.ellipse(0, 5, 45, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 2. Torso
    if (this.shapesFormed.torso) {
      ctx.beginPath();
      ctx.ellipse(0, -18, 26, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 3. Head
    if (this.shapesFormed.head) {
      ctx.beginPath();
      ctx.arc(0, -45, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 4. Trunk
    if (this.shapesFormed.trunk) {
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.quadraticCurveTo(-14, -28, -8, -15);
      ctx.quadraticCurveTo(-4, -10, 0, -20);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  renderBackground(ctx) {
    // Sculptor's warm studio
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#2c1c11");
    sky.addColorStop(0.5, "#4a2c1a");
    sky.addColorStop(1, "#1c1109");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Floor
    ctx.fillStyle = "#351e10";
    ctx.fillRect(0, 400, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT - 400);
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
