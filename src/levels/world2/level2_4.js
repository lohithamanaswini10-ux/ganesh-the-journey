/**
 * GANESH – THE JOURNEY
 * World 2, Level 4: Journey Through Time
 * Four visually distinct historical eras:
 * 1. Ancient Vedic Roots
 * 2. Medieval Maratha Period
 * 3. 1893 Public Sarvajanik Renaissance
 * 4. Contemporary Eco-Friendly Revival
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level2_4 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.currentEraIndex = 0;
    this.erasVisited = 0;

    this.eras = [
      {
        id: "era_ancient",
        name: "Ancient Vedic Era",
        century: "c. 1500 BCE – 500 CE",
        desc: "Hymns to Ganapati as Brahmanaspati, harvest celebrations of Bhadrapada, and natural clay idols from riverbeds.",
        bgColor: "#2e2118",
        skyGrad: ["#1c1611", "#3b2a1e"],
        sealIcon: "📜"
      },
      {
        id: "era_maratha",
        name: "Medieval Maratha Era",
        century: "17th – 18th Century CE",
        desc: "Chhatrapati Shivaji Maharaj and the Peshwa court celebrate Ganeshotsav as an auspicious cultural and state festival at Shaniwar Wada.",
        bgColor: "#3b1e18",
        skyGrad: ["#2b120c", "#5c2a1c"],
        sealIcon: "🏰"
      },
      {
        id: "era_tilak",
        name: "1893 Public Renaissance",
        century: "1893 CE",
        desc: "Lokmanya Tilak pioneers the Sarvajanik Ganeshotsav in Pune and Mumbai, uniting diverse communities during the freedom movement.",
        bgColor: "#1c2b3e",
        skyGrad: ["#0f1926", "#2a4361"],
        sealIcon: "🚩"
      },
      {
        id: "era_modern",
        name: "Contemporary Eco-Friendly Era",
        century: "21st Century Present",
        desc: "Global celebrations, cultural exhibitions, and widespread return to natural Shaadu clay and seed-Ganesha (visarjan in garden pots).",
        bgColor: "#143324",
        skyGrad: ["#0b1d14", "#1e5237"],
        sealIcon: "🌱"
      }
    ];
  }

  setupLevel() {
    this.currentEraIndex = 0;
    this.erasVisited = 0;
    this.player.x = 200;
    this.player.y = 500;

    this.setupEraInteractable();

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Step through the Portal of Time! We shall journey through four distinct historical eras to collect their sacred cultural seals."
      }
    ]);
  }

  setupEraInteractable() {
    this.interactables = [];
    const era = this.eras[this.currentEraIndex];
    this.objective = `Visit Era ${this.currentEraIndex + 1}/4: ${era.name}`;
    this.updateHUD();

    this.interactables.push({
      x: 640,
      y: 420,
      interactionRadius: 85,
      promptText: `Inspect Seal of ${era.name}`,
      promptOffset: 55,
      onInteract: () => this.inspectEraSeal(era),
      render: (ctx) => {
        ctx.save();
        ctx.fillStyle = "rgba(244, 196, 48, 0.25)";
        ctx.strokeStyle = "#f4c430";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(640, 420, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = "32px Nunito";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(era.sealIcon, 640, 420);
        ctx.restore();
      }
    });
  }

  inspectEraSeal(era) {
    sound.playTempleBell(523.25);
    particles.spawnSparkles(640, 420, 30, "rgba(244, 196, 48,");
    this.addScore(250);
    this.erasVisited++;

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: `[${era.name} (${era.century})]: ${era.desc}`,
        onComplete: () => {
          if (this.currentEraIndex < this.eras.length - 1) {
            this.currentEraIndex++;
            sound.playShankha();
            this.setupEraInteractable();
          } else {
            this.openChronologicalMasterPuzzle();
          }
        }
      }
    ]);
  }

  openChronologicalMasterPuzzle() {
    sound.playShankha();

    const renderPuzzle = () => `
      <div style="text-align: center; color: #fff9e6; margin-bottom: 12px;">
        Verify the complete historical arc across millennia:
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="background: rgba(20, 29, 51, 0.9); border: 1px solid #f4c430; border-radius: 8px; padding: 10px; text-align: left;">
          📜 <strong>Ancient Roots</strong>: Agricultural harvest & Vedic wisdom hymns
        </div>
        <div style="background: rgba(20, 29, 51, 0.9); border: 1px solid #f4c430; border-radius: 8px; padding: 10px; text-align: left;">
          🏰 <strong>Maratha & Peshwa Era</strong>: Courtly patronage and cultural unity at Shaniwar Wada
        </div>
        <div style="background: rgba(20, 29, 51, 0.9); border: 1px solid #f4c430; border-radius: 8px; padding: 10px; text-align: left;">
          🚩 <strong>1893 Public Renaissance</strong>: Lokmanya Tilak's inclusive public Sarvajanik movement
        </div>
        <div style="background: rgba(20, 29, 51, 0.9); border: 1px solid #f4c430; border-radius: 8px; padding: 10px; text-align: left;">
          🌱 <strong>Contemporary Era</strong>: Global celebrations & sustainable eco-friendly Shaadu clay
        </div>
        <button id="btn-seal-history" class="gold-btn glow-btn" style="margin-top: 10px;">
          Harmonize Chronological History ➔
        </button>
      </div>
    `;

    const setupActions = () => {
      const btn = document.getElementById("btn-seal-history");
      if (btn) {
        btn.onclick = () => {
          sound.playPuzzleSuccess();
          particles.spawnSparkles(640, 360, 40, "rgba(46, 204, 113,");
          this.game.closePuzzle();

          this.queueDialogue([
            {
              speaker: "vinayaka",
              text: "All four eras shine in harmonious succession! You have mastered the grand historical tapestry."
            },
            {
              speaker: "vinayaka",
              text: "Next, let us explore the beautiful regional traditions across generations.",
              onComplete: () => {
                this.completeLevel(500);
              }
            }
          ]);
        };
      }
    };

    this.game.openPuzzle({
      title: "The Chronological Heritage Arc",
      instruction: "Review and seal the four-era timeline of Ganesh Chaturthi.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  renderBackground(ctx) {
    const era = this.eras[this.currentEraIndex];
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, era.skyGrad[0]);
    sky.addColorStop(0.6, era.skyGrad[1]);
    sky.addColorStop(1, era.bgColor);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Era Title Banner in Sky
    ctx.save();
    ctx.font = "bold 20px 'Cinzel', Georgia";
    ctx.fillStyle = "#f4c430";
    ctx.textAlign = "center";
    ctx.fillText(`${era.name} (${era.century})`, GAME_CONFIG.VIRTUAL_WIDTH / 2, 80);
    ctx.restore();

    // Floor
    ctx.fillStyle = era.bgColor;
    ctx.fillRect(0, 420, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT - 420);
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
