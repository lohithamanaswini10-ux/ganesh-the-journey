/**
 * GANESH – THE JOURNEY
 * World 2, Level 3: Community Celebration
 * Helping prepare a vibrant community mandap: arrange the Dhol-Tasha station,
 * organize the prasad counter, assist the stage artist, and solve the community unity puzzle.
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level2_3 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.tasksCompleted = 0;
    this.targetTasks = 3;

    this.tasks = [
      { id: "dhol", x: 300, y: 440, name: "Dhol-Tasha Percussion Area", done: false, icon: "🥁" },
      { id: "prasad", x: 640, y: 480, name: "Prasad Distribution Counter", done: false, icon: "🥣" },
      { id: "stage", x: 980, y: 440, name: "Cultural Stage Backdrop", done: false, icon: "🎭" }
    ];
  }

  setupLevel() {
    this.tasksCompleted = 0;
    this.player.x = 180;
    this.player.y = 520;

    this.tasks.forEach(task => {
      this.interactables.push({
        x: task.x,
        y: task.y,
        interactionRadius: 80,
        promptText: `Organize: ${task.name}`,
        promptOffset: 50,
        onInteract: () => this.completeTask(task),
        render: (ctx) => {
          ctx.save();
          ctx.fillStyle = task.done ? "rgba(46, 204, 113, 0.25)" : "rgba(244, 196, 48, 0.25)";
          ctx.strokeStyle = task.done ? "#2ecc71" : "#f4c430";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(task.x, task.y, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.font = "24px Nunito";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(task.icon, task.x, task.y);
          ctx.restore();
        }
      });
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "A Sarvajanik festival thrives because everyone contributes! Volunteers from every walk of life are working together."
      },
      {
        speaker: "vinayaka",
        text: "Let us help prepare the Dhol-Tasha drums, the prasad counter, and the cultural stage."
      }
    ]);
  }

  completeTask(task) {
    if (task.done) return;

    task.done = true;
    this.tasksCompleted++;
    sound.playTempleBell(523.25);
    particles.spawnSparkles(task.x, task.y, 25, "rgba(244, 196, 48,");
    this.addScore(250);

    this.queueDialogue([
      {
        speaker: "devotee",
        text: `Thank you for lending a helping hand! The ${task.name} is now ready for the community (${this.tasksCompleted}/${this.targetTasks}).`,
        onComplete: () => {
          if (this.tasksCompleted >= this.targetTasks) {
            this.openCooperationPuzzle();
          }
        }
      }
    ]);
  }

  openCooperationPuzzle() {
    sound.playShankha();

    const pillars = [
      { name: "Ekata (Unity)", desc: "Bringing people together as one family", active: false },
      { name: "Seva (Selfless Service)", desc: "Volunteering without expecting praise", active: false },
      { name: "Kala (Sacred Arts)", desc: "Music, dance, rangoli, and theatre", active: false },
      { name: "Shraddha (Faith)", desc: "Pure devotion transcending barriers", active: false }
    ];

    const renderPuzzle = () => {
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 12px;">
          Harmonize the four sacred pillars of community celebration:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      `;

      pillars.forEach((p, idx) => {
        html += `
          <button class="gold-btn btn-pillar" data-index="${idx}" style="padding: 12px; text-align: left; background: ${p.active ? 'rgba(46, 204, 113, 0.3)' : 'rgba(20, 29, 51, 0.85)'}; border-color: ${p.active ? '#2ecc71' : '#f4c430'};">
            <strong style="color: #f4c430;">${p.name}</strong><br>
            <span style="font-size: 0.78rem; color: #d5c8b0;">${p.desc}</span>
            ${p.active ? '<span style="color: #2ecc71; float: right;">✓</span>' : ''}
          </button>
        `;
      });

      html += `</div>`;
      return html;
    };

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-pillar").forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (!pillars[idx].active) {
            pillars[idx].active = true;
            sound.playTempleBell(440 + idx * 80);
            particles.spawnSparkles(640, 360, 15);
            this.addScore(150);

            if (pillars.every(p => p.active)) {
              sound.playPuzzleSuccess();
              particles.spawnSparkles(640, 360, 40, "rgba(46, 204, 113,");
              this.game.closePuzzle();

              this.queueDialogue([
                {
                  speaker: "vinayaka",
                  text: "Unity, Service, Art, and Faith! When these four pillars stand strong, every community celebration shines with divine joy."
                },
                {
                  speaker: "vinayaka",
                  text: "Now let us embark on a Journey Through Time across four historical eras!",
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
      title: "The Pillars of Community Cooperation",
      instruction: "Activate each community pillar to complete the mandap preparations.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  renderBackground(ctx) {
    // Community Pandal Pavilion with cloth canopies
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#802b12");
    sky.addColorStop(0.5, "#d35400");
    sky.addColorStop(1, "#27120a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Colorful Fabric Drapes on Ceiling
    const drapes = ["#c0392b", "#f39c12", "#f1c40f", "#27ae60"];
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = drapes[i % drapes.length];
      ctx.beginPath();
      ctx.moveTo(i * 160, 0);
      ctx.quadraticCurveTo(i * 160 + 80, 120, i * 160 + 160, 0);
      ctx.fill();
    }

    // Pandal wooden stage floor
    ctx.fillStyle = "#4a2e18";
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
