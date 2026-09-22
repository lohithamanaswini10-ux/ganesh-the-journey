/**
 * GANESH – THE JOURNEY
 * World 2, Level 5: Traditions Across Generations
 * Exploring respectful regional variations and matching cultural offerings:
 * Maharashtra, Tamil Nadu, Karnataka, and Telangana/Andhra Pradesh.
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level2_5 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.regionsExplored = 0;
    this.targetRegions = 4;

    this.regions = [
      {
        id: "maha",
        x: 240,
        y: 440,
        name: "Maharashtra Tradition",
        offering: "Ukadiche Modak & Dhol-Tasha",
        desc: "Steamed rice dumplings with jaggery and coconut, resounding rhythm of Dhol-Tasha pathaks, and the loving arrival of Gauri.",
        icon: "🥟",
        explored: false
      },
      {
        id: "tn",
        x: 500,
        y: 440,
        name: "Tamil Nadu Tradition",
        offering: "Kozhukattai & Decorative Kudai",
        desc: "Sweet and savory Kozhukattai offerings, colorful traditional decorative umbrellas (Kudai), and sacred chants of Pillaiyar.",
        icon: "☂️",
        explored: false
      },
      {
        id: "karn",
        x: 760,
        y: 440,
        name: "Karnataka Tradition",
        offering: "Gowri Habba & Holige",
        desc: "The maternal goddess festival Gowri Habba celebrated with devotion a day prior, accompanied by sweet Holige / Obbattu.",
        icon: "🪔",
        explored: false
      },
      {
        id: "tel",
        x: 1020,
        y: 440,
        name: "Telangana & Andhra Tradition",
        offering: "Pala Velli & Kudumulu",
        desc: "A decorated wooden ceiling grid (Pala Velli) hung with seasonal fruits like wood-apple (Velaga pandu), pomegranate, and steamed Kudumulu.",
        icon: "🍇",
        explored: false
      }
    ];
  }

  setupLevel() {
    this.regionsExplored = 0;
    this.player.x = 160;
    this.player.y = 520;

    this.regions.forEach(reg => {
      this.interactables.push({
        x: reg.x,
        y: reg.y,
        interactionRadius: 75,
        promptText: `Explore: ${reg.name}`,
        promptOffset: 50,
        onInteract: () => this.exploreRegion(reg),
        render: (ctx) => {
          ctx.save();
          ctx.fillStyle = reg.explored ? "rgba(46, 204, 113, 0.25)" : "rgba(244, 196, 48, 0.25)";
          ctx.strokeStyle = reg.explored ? "#2ecc71" : "#f4c430";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(reg.x, reg.y, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.font = "24px Nunito";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(reg.icon, reg.x, reg.y);
          ctx.restore();
        }
      });
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Across India, different regions express their devotion with unique flavors, melodies, and sacred customs. Let us explore four regional traditions!"
      }
    ]);
  }

  exploreRegion(reg) {
    if (reg.explored) return;

    reg.explored = true;
    this.regionsExplored++;
    sound.playTempleBell(523.25);
    particles.spawnSparkles(reg.x, reg.y, 20);
    this.addScore(250);

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: `[${reg.name} - ${reg.offering}]: ${reg.desc}`,
        onComplete: () => {
          if (this.regionsExplored >= this.targetRegions) {
            this.openRegionalTapestryPuzzle();
          }
        }
      }
    ]);
  }

  openRegionalTapestryPuzzle() {
    sound.playShankha();

    const matches = [
      { state: "Maharashtra", delicacy: "Ukadiche Modak", matched: false },
      { state: "Tamil Nadu", delicacy: "Sweet Kozhukattai & Kudai", matched: false },
      { state: "Karnataka", delicacy: "Gowri Habba & Holige", matched: false },
      { state: "Telangana / Andhra", delicacy: "Pala Velli Canopy & Kudumulu", matched: false }
    ];

    const renderPuzzle = () => {
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 12px;">
          Match each region with its cherished festival specialty:
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
      `;

      matches.forEach((m, idx) => {
        html += `
          <button class="gold-btn btn-match-reg" data-index="${idx}" style="display: flex; justify-content: space-between; padding: 10px 16px; background: ${m.matched ? 'rgba(46, 204, 113, 0.3)' : 'rgba(20, 29, 51, 0.85)'}; border-color: ${m.matched ? '#2ecc71' : '#f4c430'};">
            <strong>${m.state}</strong>
            <span style="color: ${m.matched ? '#2ecc71' : '#d5c8b0'}; font-size: 0.85rem;">${m.matched ? '✓ ' + m.delicacy : '➔ Verify Custom'}</span>
          </button>
        `;
      });

      html += `</div>`;
      return html;
    };

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-match-reg").forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (!matches[idx].matched) {
            matches[idx].matched = true;
            sound.playTempleBell(480 + idx * 80);
            particles.spawnSparkles(640, 360, 15);
            this.addScore(150);

            if (matches.every(m => m.matched)) {
              sound.playPuzzleSuccess();
              particles.spawnSparkles(640, 360, 40, "rgba(46, 204, 113,");
              this.game.closePuzzle();

              this.queueDialogue([
                {
                  speaker: "vinayaka",
                  text: "Diverse traditions, one unified heartbeat of love! Every region weaves its unique strand into the grand festival tapestry."
                },
                {
                  speaker: "vinayaka",
                  text: "Now let us bring everything together in the grand finale: Living Heritage!",
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
      title: "Regional Traditions Tapestry",
      instruction: "Connect the regional traditions with their verified cultural customs.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  renderBackground(ctx) {
    // Cultural tapestry hall with warm festive lamps
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#3a1c28");
    sky.addColorStop(0.5, "#632d43");
    sky.addColorStop(1, "#211118");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Decorative toran border across top
    ctx.fillStyle = "#27ae60";
    for (let x = 0; x < GAME_CONFIG.VIRTUAL_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 20, 35);
      ctx.lineTo(x + 40, 0);
      ctx.fill();
    }

    // Floor
    ctx.fillStyle = "#2e1821";
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
