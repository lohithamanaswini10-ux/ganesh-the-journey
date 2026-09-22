/**
 * GANESH – THE JOURNEY
 * World 3, Level 3: Add Details
 * Carving sacred iconographical attributes:
 * 1. Large Ears (Surpakarna)
 * 2. Broken Tusk (Ekadanta)
 * 3. Auspicious Crown (Mukut)
 * 4. Sweet Modak in Palm
 * 5. Abhaya Mudra (Hand of Fearlessness)
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level3_3 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.details = [
      { id: "ears", name: "Large Listening Ears (Surpakarna)", symbol: "👂", desc: "Wide fan ears that listen to every prayer and sift wisdom from folly.", carved: false },
      { id: "tusk", name: "Sacred Broken Tusk (Ekadanta)", symbol: "🦷", desc: "The broken tusk represents sacrifice and intellect used to write the Mahabharata.", carved: false },
      { id: "crown", name: "Royal Crown (Kiritam)", symbol: "👑", desc: "Symbolizes divine majesty and spiritual supremacy.", carved: false },
      { id: "modak", name: "Sweet Modak in Palm", symbol: "🥟", desc: "Represents the sweet reward of spiritual sadhana and inner joy.", carved: false },
      { id: "abhaya", name: "Abhaya Mudra (Blessing Hand)", symbol: "✋", desc: "The open palm dispelling all fears and protecting the righteous.", carved: false }
    ];
  }

  setupLevel() {
    this.details.forEach(d => d.carved = false);
    this.player.x = 240;
    this.player.y = 520;

    // Sculpting Turntable in Studio
    this.turntable = { x: 640, y: 440 };

    this.interactables.push({
      x: this.turntable.x,
      y: this.turntable.y,
      interactionRadius: 90,
      promptText: "Carve Sacred Details",
      promptOffset: 65,
      onInteract: () => this.openCarvingModal(),
      render: (ctx) => {
        ctx.save();
        ctx.fillStyle = "#5c381e";
        ctx.strokeStyle = "#b8860b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(this.turntable.x, this.turntable.y + 20, 70, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw murti silhouette with details added so far
        Sprites.drawVinayaka(ctx, this.turntable.x, this.turntable.y - 10, 1.1, 1, false, 0);
        ctx.restore();
      }
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "The basic clay form is strong! Now we carefully carve the five profound sacred details that define Ganesha's iconography."
      }
    ]);
  }

  openCarvingModal() {
    const renderModal = () => {
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 12px;">
          Select and carve each sacred iconographical attribute:
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
      `;

      this.details.forEach((d, idx) => {
        html += `
          <button class="gold-btn btn-carve-detail" data-index="${idx}" style="padding: 12px; text-align: left; display: flex; justify-content: space-between; align-items: center; background: ${d.carved ? 'rgba(46, 204, 113, 0.3)' : 'rgba(20, 29, 51, 0.85)'}; border-color: ${d.carved ? '#2ecc71' : '#f4c430'};">
            <div>
              <span style="font-size: 1.4rem; margin-right: 8px;">${d.symbol}</span>
              <strong style="color: #f4c430;">${d.name}</strong><br>
              <span style="font-size: 0.78rem; color: #d5c8b0; margin-left: 32px;">${d.desc}</span>
            </div>
            <span>${d.carved ? '✓ Carved' : '➔ Carve'}</span>
          </button>
        `;
      });

      html += `</div>`;
      return html;
    };

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-carve-detail").forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (!this.details[idx].carved) {
            this.details[idx].carved = true;
            sound.playTempleBell(523.25 + idx * 70);
            particles.spawnSparkles(640, 360, 20);
            this.addScore(200);

            if (this.details.every(d => d.carved)) {
              sound.playPuzzleSuccess();
              particles.spawnSparkles(640, 360, 45, "rgba(46, 204, 113,");
              this.game.closePuzzle();

              this.queueDialogue([
                {
                  speaker: "vinayaka",
                  text: "Ears, tusk, crown, modak, and blessing hand! Every detail breathes with timeless philosophical meaning."
                },
                {
                  speaker: "vinayaka",
                  text: "Now let us bring vibrant life to the murti with organic, natural colours!",
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
    };

    this.game.openPuzzle({
      title: "Carving Sacred Details",
      instruction: "Carve the five divine attributes into the clay sculpture.",
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
