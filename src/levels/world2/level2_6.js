/**
 * GANESH – THE JOURNEY
 * World 2, Level 6: Living Heritage
 * Grand finale of History World:
 * Setting up the Living Heritage Pandal, solving the master cultural synthesis puzzle,
 * and celebrating with HISTORY WORLD COMPLETE — 6/6 LEVELS!
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";
import { saveManager } from "../../storage/saveManager.js";

export class Level2_6 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.phase = "setup_pandal"; // setup_pandal -> master_puzzle -> celebration -> complete
    this.pandalElements = {
      ecoClayBooth: false,
      musicStage: false,
      charityDesk: false
    };
  }

  setupLevel() {
    this.phase = "setup_pandal";
    this.pandalElements = { ecoClayBooth: false, musicStage: false, charityDesk: false };
    this.player.x = 200;
    this.player.y = 500;

    // 1. Eco Clay Booth
    this.interactables.push({
      x: 340,
      y: 420,
      interactionRadius: 75,
      promptText: "Setup Eco-Clay Workshop Booth",
      promptOffset: 50,
      onInteract: () => {
        if (!this.pandalElements.ecoClayBooth) {
          this.pandalElements.ecoClayBooth = true;
          sound.playTempleBell(523.25);
          particles.spawnSparkles(340, 420, 20);
          this.addScore(200);
          this.checkPandalProgress();
        }
      },
      render: (ctx) => {
        ctx.save();
        ctx.fillStyle = this.pandalElements.ecoClayBooth ? "#27ae60" : "#d35400";
        ctx.font = "bold 16px Nunito";
        ctx.fillText("🏺 Eco-Clay Booth", 280, 415);
        ctx.restore();
      }
    });

    // 2. Music Stage
    this.interactables.push({
      x: 640,
      y: 420,
      interactionRadius: 75,
      promptText: "Arrange Classical Music Stage",
      promptOffset: 50,
      onInteract: () => {
        if (!this.pandalElements.musicStage) {
          this.pandalElements.musicStage = true;
          sound.playTempleBell(659.25);
          particles.spawnSparkles(640, 420, 20);
          this.addScore(200);
          this.checkPandalProgress();
        }
      },
      render: (ctx) => {
        ctx.save();
        ctx.fillStyle = this.pandalElements.musicStage ? "#27ae60" : "#d35400";
        ctx.font = "bold 16px Nunito";
        ctx.fillText("🎵 Music Stage", 590, 415);
        ctx.restore();
      }
    });

    // 3. Charity / Blood Donation & Food Relief Desk
    this.interactables.push({
      x: 940,
      y: 420,
      interactionRadius: 75,
      promptText: "Setup Community Charity & Relief Desk",
      promptOffset: 50,
      onInteract: () => {
        if (!this.pandalElements.charityDesk) {
          this.pandalElements.charityDesk = true;
          sound.playTempleBell(783.99);
          particles.spawnSparkles(940, 420, 20);
          this.addScore(200);
          this.checkPandalProgress();
        }
      },
      render: (ctx) => {
        ctx.save();
        ctx.fillStyle = this.pandalElements.charityDesk ? "#27ae60" : "#d35400";
        ctx.font = "bold 16px Nunito";
        ctx.fillText("🤝 Charity & Seva", 880, 415);
        ctx.restore();
      }
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "In the modern era, Ganeshotsav serves as a living beacon of social good: eco-friendly awareness, classical arts, and charitable relief."
      },
      {
        speaker: "vinayaka",
        text: "Let us prepare the three core zones of our Living Heritage Mandap."
      }
    ]);
  }

  checkPandalProgress() {
    if (this.pandalElements.ecoClayBooth && this.pandalElements.musicStage && this.pandalElements.charityDesk) {
      this.queueDialogue([
        {
          speaker: "vinayaka",
          text: "The Living Heritage Mandap is splendidly assembled! Now, solve the Master Cultural Riddle to inaugurate the festival.",
          onComplete: () => this.openMasterHeritagePuzzle()
        }
      ]);
    }
  }

  openMasterHeritagePuzzle() {
    sound.playShankha();

    const questions = [
      {
        q: "What was Lokmanya Tilak's visionary goal in 1893?",
        opts: ["A. Build private palaces", "B. Foster unity across social barriers through public celebration", "C. End the monsoon"],
        correct: 1
      },
      {
        q: "Why is natural Shaadu clay revered over synthetic materials?",
        opts: ["A. It dissolves respectfully back into earth and waters", "B. It is made of plastic", "C. It is imported"],
        correct: 0
      },
      {
        q: "What is the true soul of Ganeshotsav across all eras?",
        opts: ["A. Noise and competition", "B. Faith, wisdom, unity, and selfless service", "C. Only commercial trade"],
        correct: 1
      }
    ];

    let currentQ = 0;

    const renderPuzzle = () => {
      const q = questions[currentQ];
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 14px;">
          <strong style="color: #f4c430; font-size: 1.1rem;">Heritage Synthesis (${currentQ + 1}/3):</strong>
          <p style="margin-top: 6px; font-size: 0.95rem;">${q.q}</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
      `;

      q.opts.forEach((opt, idx) => {
        html += `
          <button class="gold-btn btn-master-opt" data-index="${idx}" style="padding: 12px 16px; text-align: left;">
            ${opt}
          </button>
        `;
      });

      html += `</div>`;
      return html;
    };

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-master-opt").forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (idx === questions[currentQ].correct) {
            sound.playTempleBell(523.25 + currentQ * 100);
            particles.spawnSparkles(640, 360, 20);
            this.addScore(250);
            currentQ++;

            if (currentQ >= questions.length) {
              sound.playPuzzleSuccess();
              particles.spawnSparkles(640, 360, 45, "rgba(46, 204, 113,");
              this.game.closePuzzle();

              this.queueDialogue([
                {
                  speaker: "vinayaka",
                  text: "Supreme understanding! You have synthesized centuries of living heritage, devotion, and social harmony."
                },
                {
                  speaker: "vinayaka",
                  text: "May this timeless spirit of unity, art, and wisdom continue to inspire future generations!",
                  onComplete: () => this.completeWorld2()
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
      title: "Master Heritage Synthesis",
      instruction: "Answer with wisdom to inaugurate the Living Heritage celebration.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  completeWorld2() {
    this.phase = "complete";
    this.isCompleted = true;
    this.addScore(500);

    saveManager.saveLevelResult(this.id, this.score, 3, Math.floor(this.elapsedTime));
    sound.playWorldComplete();

    const worldProg = saveManager.getWorldProgress(2);

    this.game.showWorldCompleteModal({
      worldId: 2,
      worldTitle: "HISTORY WORLD COMPLETE — 6/6 LEVELS",
      quote: "Heritage is not just history remembered; it is tradition lived with heart and harmony.",
      levelsDone: "6 / 6",
      totalScore: worldProg.worldScore,
      totalTime: this.formatTime(this.elapsedTime)
    });
  }

  renderBackground(ctx) {
    // Grand illuminated community pandal hall
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#1c142b");
    sky.addColorStop(0.5, "#3b1e54");
    sky.addColorStop(1, "#120c1c");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Decorative festival lights garland strings
    ctx.strokeStyle = "rgba(244, 196, 48, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.quadraticCurveTo(GAME_CONFIG.VIRTUAL_WIDTH / 2, 160, GAME_CONFIG.VIRTUAL_WIDTH, 80);
    ctx.stroke();

    // Floor
    ctx.fillStyle = "#2a153d";
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
