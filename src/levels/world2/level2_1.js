/**
 * GANESH – THE JOURNEY
 * World 2, Level 1: Roots of the Festival
 * Ancient Vedic and cultural foundations: explore historical discovery points,
 * learn agricultural harvest roots, and solve the ancient symbol matching puzzle.
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level2_1 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.artifactsFound = 0;
    this.targetArtifacts = 4;

    this.artifacts = [
      {
        id: "rigveda",
        x: 280,
        y: 380,
        title: "Rigvedic Hymn Inscription",
        desc: "'Gananam Tva Ganapatim Havamahe' — Ancient Vedic invocation of the supreme leader of wisdom and universal categories.",
        found: false,
        icon: "📜"
      },
      {
        id: "harvest",
        x: 520,
        y: 520,
        title: "Monsoon Harvest Grain Sheaf",
        desc: "The festival traditionally coincides with Bhadrapada month, celebrating the fertility of mother earth and autumn harvest crops.",
        found: false,
        icon: "🌾"
      },
      {
        id: "clay",
        x: 800,
        y: 380,
        title: "Natural Clay Tablet",
        desc: "Ancient households crafted idols from nearby riverbank soil (Shaadu), symbolizing the cosmic cycle of creation and dissolution.",
        found: false,
        icon: "🏺"
      },
      {
        id: "durva",
        x: 1040,
        y: 500,
        title: "Sacred Durva Grass",
        desc: "Offering 21 blades of hardy Bermuda grass (Durva) traces back to ancient reverence for medicinal, life-sustaining flora.",
        found: false,
        icon: "🌿"
      }
    ];
  }

  setupLevel() {
    this.artifactsFound = 0;
    this.player.x = 180;
    this.player.y = 480;

    this.artifacts.forEach((art, idx) => {
      this.interactables.push({
        x: art.x,
        y: art.y,
        interactionRadius: 75,
        promptText: `Examine: ${art.title}`,
        promptOffset: 45,
        onInteract: () => this.examineArtifact(art),
        render: (ctx) => {
          ctx.save();
          ctx.fillStyle = art.found ? "rgba(46, 204, 113, 0.25)" : "rgba(244, 196, 48, 0.25)";
          ctx.strokeStyle = art.found ? "#2ecc71" : "#f4c430";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(art.x, art.y, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.font = "20px Nunito";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(art.icon, art.x, art.y);
          ctx.restore();
        }
      });
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Welcome to the History World! Here we explore how the celebration of Ganesh Chaturthi grew through centuries of culture, devotion, and community."
      },
      {
        speaker: "vinayaka",
        text: "Let us inspect the four ancient historical artifacts scattered across this sacred temple courtyard."
      }
    ]);
  }

  examineArtifact(art) {
    if (art.found) return;

    art.found = true;
    this.artifactsFound++;
    sound.playTempleBell(523.25);
    particles.spawnSparkles(art.x, art.y, 20, "rgba(244, 196, 48,");
    this.addScore(250);

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: `Discovered (${this.artifactsFound}/4) [${art.title}]: ${art.desc}`,
        onComplete: () => {
          if (this.artifactsFound >= this.targetArtifacts) {
            this.openSymbolMatchingPuzzle();
          }
        }
      }
    ]);
  }

  openSymbolMatchingPuzzle() {
    sound.playShankha();

    const pairs = [
      { term: "Rigveda", match: "Wisdom & Arts Invocation", solved: false },
      { term: "Bhadrapada Harvest", match: "Autumn Crop Fertility", solved: false },
      { term: "Riverbank Shaadu Clay", match: "Natural Creation & Dissolution", solved: false },
      { term: "21 Durva Grass Blades", match: "Medicinal Life-Sustaining Flora", solved: false }
    ];

    const renderPuzzle = () => {
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 12px;">
          Match each historical foundation with its verified cultural significance:
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
      `;

      pairs.forEach((p, idx) => {
        html += `
          <button class="gold-btn btn-match-pair" data-index="${idx}" style="display: flex; justify-content: space-between; padding: 10px 16px; background: ${p.solved ? 'rgba(46, 204, 113, 0.3)' : 'rgba(20, 29, 51, 0.85)'}; border-color: ${p.solved ? '#2ecc71' : '#f4c430'};">
            <strong>${p.term}</strong>
            <span style="color: ${p.solved ? '#2ecc71' : '#d5c8b0'}; font-size: 0.85rem;">${p.solved ? '✓ ' + p.match : '➔ Tap to verify'}</span>
          </button>
        `;
      });

      html += `</div>`;
      return html;
    };

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-match-pair").forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (!pairs[idx].solved) {
            pairs[idx].solved = true;
            sound.playTempleBell(480 + idx * 80);
            particles.spawnSparkles(640, 360, 15);
            this.addScore(150);

            if (pairs.every(p => p.solved)) {
              sound.playPuzzleSuccess();
              particles.spawnSparkles(640, 360, 40, "rgba(46, 204, 113,");
              this.game.closePuzzle();

              this.queueDialogue([
                {
                  speaker: "vinayaka",
                  text: "You have verified all ancient foundations! From early Vedic philosophy to agrarian gratitude, the festival's roots run deep."
                },
                {
                  speaker: "vinayaka",
                  text: "Now let us see how the celebration took public shape in the next era.",
                  onComplete: () => {
                    this.completeLevel(500);
                  }
                }
              ]);
            } else {
              container.innerHTML = renderPuzzle();
              setupActions();
            }
          }
        };
      });
    };

    this.game.openPuzzle({
      title: "Ancient Foundations Verification",
      instruction: "Connect each historical element with its verified cultural origin.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  renderBackground(ctx) {
    // Ancient stone temple courtyard with stone pillars
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#231f20");
    sky.addColorStop(0.6, "#4a3c31");
    sky.addColorStop(1, "#1c1815");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Stone pillars in background
    ctx.fillStyle = "#3e3228";
    ctx.strokeStyle = "#8d7054";
    ctx.lineWidth = 1.5;
    for (let x = 100; x < GAME_CONFIG.VIRTUAL_WIDTH; x += 260) {
      ctx.fillRect(x, 140, 40, 260);
      ctx.strokeRect(x, 140, 40, 260);
    }

    // Flagstone ground
    ctx.fillStyle = "#2c241d";
    ctx.fillRect(0, 360, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT - 360);
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
