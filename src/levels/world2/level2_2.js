/**
 * GANESH – THE JOURNEY
 * World 2, Level 2: Festival Takes Shape
 * Tracing the evolution into a public festival:
 * Satavahana dynastic roots, Maratha era patronages, and Lokmanya Tilak's 1893
 * Sarvajanik initiative fostering social unity.
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level2_2 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.panelsRead = 0;
    this.targetPanels = 3;

    this.historyPanels = [
      {
        id: "early_dynasties",
        x: 280,
        y: 400,
        title: "Early Dynastic Shrines",
        period: "1st – 10th Century CE",
        desc: "Under the Satavahana, Chalukya, and Rashtrakuta dynasties, stone inscriptions and temple reliefs demonstrate widespread individual devotion across the Deccan plateau.",
        read: false
      },
      {
        id: "maratha_era",
        x: 640,
        y: 400,
        title: "The Maratha & Peshwa Era",
        period: "17th – 18th Century CE",
        desc: "Chhatrapati Shivaji Maharaj promoted the festival to foster cultural pride. Later, the Peshwas of Pune celebrated Ganeshotsav grandly at Shaniwar Wada as a family deity festival.",
        read: false
      },
      {
        id: "tilak_1893",
        x: 1000,
        y: 400,
        title: "1893: The Sarvajanik Renaissance",
        period: "1893 CE",
        desc: "Freedom fighter Lokmanya Bal Gangadhar Tilak recognized Ganeshotsav's unique power to bring all communities together, transforming private domestic worship into an inclusive public (Sarvajanik) festival.",
        read: false
      }
    ];
  }

  setupLevel() {
    this.panelsRead = 0;
    this.player.x = 160;
    this.player.y = 520;

    this.historyPanels.forEach(panel => {
      this.interactables.push({
        x: panel.x,
        y: panel.y,
        interactionRadius: 80,
        promptText: `Read: ${panel.title}`,
        promptOffset: 50,
        onInteract: () => this.readPanel(panel),
        render: (ctx) => {
          ctx.save();
          ctx.fillStyle = panel.read ? "rgba(46, 204, 113, 0.25)" : "rgba(244, 196, 48, 0.25)";
          ctx.strokeStyle = panel.read ? "#2ecc71" : "#f4c430";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(panel.x - 30, panel.y - 40, 60, 80, 8);
          ctx.fill();
          ctx.stroke();

          ctx.font = "26px Nunito";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("📜", panel.x, panel.y);
          ctx.restore();
        }
      });
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "How did a sacred household tradition become one of the world's largest public celebrations? Let us explore these three historical learning panels."
      }
    ]);
  }

  readPanel(panel) {
    if (panel.read) return;

    panel.read = true;
    this.panelsRead++;
    sound.playTempleBell(523.25);
    particles.spawnSparkles(panel.x, panel.y, 20);
    this.addScore(250);

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: `[${panel.title} - ${panel.period}]: ${panel.desc}`,
        onComplete: () => {
          if (this.panelsRead >= this.targetPanels) {
            this.openTimelineSequencingPuzzle();
          }
        }
      }
    ]);
  }

  openTimelineSequencingPuzzle() {
    sound.playShankha();

    const timelineItems = [
      { id: "ancient", label: "1st: Early Dynastic Inscriptions (Satavahana & Chalukya)", placed: false },
      { id: "maratha", label: "2nd: Maratha & Peshwa Household Festivities at Shaniwar Wada", placed: false },
      { id: "tilak", label: "3rd: Lokmanya Tilak's 1893 Public Sarvajanik Movement", placed: false }
    ];

    let currentStep = 0;

    const renderPuzzle = () => {
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 12px;">
          Tap the historical milestones in their verified chronological order:
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
      `;

      timelineItems.forEach((item, idx) => {
        html += `
          <button class="gold-btn btn-timeline-step" data-index="${idx}" style="padding: 12px 16px; text-align: left; background: ${item.placed ? 'rgba(46, 204, 113, 0.3)' : 'rgba(20, 29, 51, 0.85)'}; border-color: ${item.placed ? '#2ecc71' : '#f4c430'};">
            ${item.label} ${item.placed ? '✓' : ''}
          </button>
        `;
      });

      html += `</div>`;
      return html;
    };

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-timeline-step").forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (idx === currentStep) {
            timelineItems[idx].placed = true;
            currentStep++;
            sound.playTempleBell(480 + currentStep * 90);
            particles.spawnSparkles(640, 360, 20);
            this.addScore(200);

            if (currentStep >= timelineItems.length) {
              sound.playPuzzleSuccess();
              particles.spawnSparkles(640, 360, 40, "rgba(46, 204, 113,");
              this.game.closePuzzle();

              this.queueDialogue([
                {
                  speaker: "vinayaka",
                  text: "Timeline verified perfectly! You have seen how devotion bridged private homes and transformed into an inspiring engine for community harmony."
                },
                {
                  speaker: "vinayaka",
                  text: "Next, let us experience the teamwork of an authentic community celebration.",
                  onComplete: () => {
                    this.completeLevel(500);
                  }
                }
              ]);
            } else {
              container.innerHTML = renderPuzzle();
              setupActions();
            }
          } else {
            sound.playMistake();
          }
        };
      });
    };

    this.game.openPuzzle({
      title: "Historical Timeline Sequencing",
      instruction: "Arrange the three historical milestones in chronological sequence.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  renderBackground(ctx) {
    // Historic Pune / Deccan stone library courtyard
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#2c1d11");
    sky.addColorStop(0.5, "#5c3d24");
    sky.addColorStop(1, "#1e140c");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Decorative archways
    ctx.fillStyle = "#3e2716";
    ctx.strokeStyle = "#b8860b";
    ctx.lineWidth = 2;
    for (let x = 140; x < GAME_CONFIG.VIRTUAL_WIDTH; x += 360) {
      ctx.beginPath();
      ctx.arc(x + 140, 260, 100, Math.PI, 0);
      ctx.stroke();
    }

    // Floor
    ctx.fillStyle = "#27190e";
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
