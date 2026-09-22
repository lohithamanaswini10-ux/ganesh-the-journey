/**
 * GANESH – THE JOURNEY
 * World 3, Level 4: Colours and Patterns
 * Painting with organic, non-toxic traditional pigments:
 * Turmeric Yellow (Pitambar Dhoti), Vermilion Red (Sacred Tilak),
 * Sandalwood White (Sacred Thread & Lotus), and Gold Filigree (Crown).
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level3_4 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.zonesPainted = {
      dhoti: false,
      tilak: false,
      lotus: false,
      crown: false
    };

    this.paintZones = [
      { id: "dhoti", name: "Pitambar Dhoti", color: "Haldi (Turmeric Yellow)", desc: "Radiant yellow symbolizing auspicious knowledge and prosperity.", hex: "#f1c40f" },
      { id: "tilak", name: "Sacred Forehead Tilak", color: "Kumkum (Vermilion Red)", desc: "Auspicious red vermilion crescent and bindi invoking divine grace.", hex: "#c0392b" },
      { id: "lotus", name: "Sacred Lotus Petals", color: "Chandan (Sandalwood White)", desc: "Cooling fragrant sandalwood white petals rising untainted.", hex: "#fdfefe" },
      { id: "crown", name: "Mukut Crown Filigree", color: "Suvarna (Pure Gold)", desc: "Shimmering gold embellishments adorning the sovereign crown.", hex: "#f4d03f" }
    ];
  }

  setupLevel() {
    this.zonesPainted = { dhoti: false, tilak: false, lotus: false, crown: false };
    this.player.x = 240;
    this.player.y = 520;

    // Painting Turntable in Studio
    this.turntable = { x: 640, y: 440 };

    this.interactables.push({
      x: this.turntable.x,
      y: this.turntable.y,
      interactionRadius: 90,
      promptText: "Apply Natural Organic Pigments",
      promptOffset: 65,
      onInteract: () => this.openPaintingModal(),
      render: (ctx) => {
        ctx.save();
        ctx.fillStyle = "#5c381e";
        ctx.strokeStyle = "#b8860b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(this.turntable.x, this.turntable.y + 20, 70, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw painted murti
        Sprites.drawVinayaka(ctx, this.turntable.x, this.turntable.y - 10, 1.15, 1, false, 0);
        ctx.restore();
      }
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "True beauty honors nature! We use 100% natural, biodegradable pigments from plants, roots, and minerals."
      },
      {
        speaker: "vinayaka",
        text: "Approach the turntable to paint the sacred Pitambar, Tilak, Lotus, and Crown."
      }
    ]);
  }

  openPaintingModal() {
    const renderModal = () => {
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 12px;">
          Select each sacred area and apply its organic herbal pigment:
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
      `;

      this.paintZones.forEach((z) => {
        const isDone = this.zonesPainted[z.id];
        html += `
          <button class="gold-btn btn-paint-zone" data-id="${z.id}" style="padding: 12px; text-align: left; display: flex; justify-content: space-between; align-items: center; background: ${isDone ? 'rgba(46, 204, 113, 0.3)' : 'rgba(20, 29, 51, 0.85)'}; border-color: ${isDone ? '#2ecc71' : '#f4c430'};">
            <div>
              <span style="display: inline-block; width: 18px; height: 18px; border-radius: 50%; background: ${z.hex}; vertical-align: middle; margin-right: 8px; border: 1px solid white;"></span>
              <strong style="color: #f4c430;">${z.name}</strong> ➔ <em style="color: #fff2a8;">${z.color}</em><br>
              <span style="font-size: 0.78rem; color: #d5c8b0; margin-left: 28px;">${z.desc}</span>
            </div>
            <span>${isDone ? '✓ Painted' : '➔ Apply'}</span>
          </button>
        `;
      });

      html += `
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
          <button id="btn-undo-paint" class="nav-back-btn">↺ Reset Paints</button>
        </div>
      `;
      return html;
    };

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-paint-zone").forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.id;
          if (!this.zonesPainted[id]) {
            this.zonesPainted[id] = true;
            sound.playTempleBell(523.25 + Object.keys(this.zonesPainted).indexOf(id) * 80);
            particles.spawnSparkles(640, 360, 25, "rgba(244, 196, 48,");
            this.addScore(200);

            const allDone = Object.values(this.zonesPainted).every(v => v);
            if (allDone) {
              sound.playPuzzleSuccess();
              particles.spawnSparkles(640, 360, 45, "rgba(46, 204, 113,");
              this.game.closePuzzle();

              this.queueDialogue([
                {
                  speaker: "vinayaka",
                  text: "How radiant! The turmeric yellow and vermilion glow with pure life, completely safe for our waters."
                },
                {
                  speaker: "vinayaka",
                  text: "Now, let us prepare the altar with banana leaves, lamps, and flowers for the sacred celebration.",
                  onComplete: () => {
                    this.completeLevel(500);
                  }
                }
              ]);
            } else {
              container.innerHTML = renderModal();
              setupActions();
            }
          }
        };
      });

      const btnUndo = document.getElementById("btn-undo-paint");
      if (btnUndo) {
        btnUndo.onclick = () => {
          this.zonesPainted = { dhoti: false, tilak: false, lotus: false, crown: false };
          sound.playClick();
          container.innerHTML = renderModal();
          setupActions();
        };
      }
    };

    this.game.openPuzzle({
      title: "Applying Natural Organic Pigments",
      instruction: "Apply eco-friendly haldi, kumkum, and chandan to the sculpture.",
      render: renderModal,
      onOpen: setupActions
    });
  }

  renderBackground(ctx) {
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#2c1c11");
    sky.addColorStop(0.5, "#4a2c1a");
    sky.addColorStop(1, "#1c1109");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

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
