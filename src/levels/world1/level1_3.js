/**
 * GANESH – THE JOURNEY
 * World 1, Level 3: The Three Rounds
 * The divine race around the universe, 3 sacred pradakshinas around Shiva & Parvati,
 * glowing sacred trail, Subrahmanya's return, and the final Wisdom Puzzle.
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level1_3 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.phase = "intro"; // intro -> choice -> pradakshina -> return_scene -> wisdom_puzzle -> complete
    this.roundsCompleted = 0;
    this.targetRounds = 3;

    // Pradakshina waypoints around parents (Center: 640, 360)
    this.center = { x: 640, y: 360 };
    this.pradakshinaRadius = 150;
    this.goldenTrail = [];
    this.currentSector = 0; // 0: Top, 1: Right, 2: Bottom, 3: Left
    this.visitedSectors = new Set();

    // Wisdom Puzzle State
    this.wisdomNodes = [
      { id: "world", label: "The Cosmic World", selected: false, icon: "🌍" },
      { id: "family", label: "Divine Parents", selected: false, icon: "👨‍👩‍👦" },
      { id: "wisdom", label: "Supreme Wisdom", selected: false, icon: "✨" }
    ];
  }

  setupLevel() {
    this.phase = "intro";
    this.roundsCompleted = 0;
    this.goldenTrail = [];
    this.visitedSectors.clear();
    this.currentSector = 0;

    // Position player to start below parents
    this.player.x = 640;
    this.player.y = 540;

    // Collectibles
    this.collectibles.push(
      { x: 280, y: 480, radius: 18, type: "flower", render: (ctx) => Sprites.drawFlower(ctx, 280, 480, 0.9) },
      { x: 1000, y: 480, radius: 18, type: "flower", render: (ctx) => Sprites.drawFlower(ctx, 1000, 480, 0.9) }
    );

    // Shiva & Parvati enthroned in center
    this.interactables.push({
      x: this.center.x,
      y: this.center.y,
      interactionRadius: 90,
      promptText: "Contemplate Sacred Challenge",
      promptOffset: 70,
      onInteract: () => this.startIntroDialogue(),
      render: (ctx) => {
        Sprites.drawShiva(ctx, this.center.x - 45, this.center.y, 1.25);
        Sprites.drawParvati(ctx, this.center.x + 45, this.center.y, 1.2);
      }
    });

    setTimeout(() => this.startIntroDialogue(), 400);
  }

  startIntroDialogue() {
    this.queueDialogue([
      {
        speaker: "shiva",
        text: "Sage Narada has presented a divine fruit of supreme wisdom (Gyana Pazham). Only one who circles the entire universe first may claim it."
      },
      {
        speaker: "subrahmanya",
        text: "Brother Vinayaka! I mount my swift peacock Mayura to soar across all galaxies and oceans. The race is on!",
        onComplete: () => {
          sound.playShankha();
          particles.spawnSparkles(800, 300, 25, "rgba(26, 82, 118,");
        }
      },
      {
        speaker: "vinayaka",
        text: "Brother Subrahmanya has flown off like lightning across the sky. But where does the universe truly begin and end?",
        onComplete: () => this.openChoiceModal()
      }
    ]);
  }

  openChoiceModal() {
    const renderModal = () => `
      <div style="color: #fff9e6; text-align: center; display: flex; flex-direction: column; gap: 14px;">
        <p style="font-size: 1.05rem; line-height: 1.5;">
          Vinayaka reflects on the meaning of the universe. What path will he choose?
        </p>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
          <button id="choice-a" class="gold-btn" style="padding: 14px; text-align: left;">
            🚀 <strong>Travel Across Distant Planets</strong><br>
            <span style="font-size: 0.8rem; color: #d5c8b0;">Fly through outer space across galaxies and mountain ranges.</span>
          </button>
          <button id="choice-b" class="gold-btn glow-btn" style="padding: 14px; text-align: left;">
            🌺 <strong>Perform 3 Pradakshinas around Shiva & Parvati</strong><br>
            <span style="font-size: 0.8rem; color: #fff2a8;">Parents are the living embodiment of the entire cosmos and divine truth.</span>
          </button>
        </div>
      </div>
    `;

    const setupActions = () => {
      const choiceA = document.getElementById("choice-a");
      const choiceB = document.getElementById("choice-b");

      if (choiceA) {
        choiceA.onclick = () => {
          sound.playMistake();
          this.game.closePuzzle();
          this.queueDialogue([
            {
              speaker: "vinayaka",
              text: "A physical journey across space may cover distance, but does it grasp the true spiritual heart of the universe? Let me reflect deeper."
            },
            {
              speaker: "vinayaka",
              text: "The sacred scriptures declare: 'Matru Devo Bhava, Pitru Devo Bhava' — Parents are the origin of all existence!",
              onComplete: () => this.openChoiceModal()
            }
          ]);
        };
      }

      if (choiceB) {
        choiceB.onclick = () => {
          sound.playPuzzleSuccess();
          this.addScore(300);
          this.game.closePuzzle();
          this.startPradakshina();
        };
      }
    };

    this.game.openPuzzle({
      title: "The Choice of Supreme Wisdom",
      instruction: "Choose the path of understanding.",
      render: renderModal,
      onOpen: setupActions
    });
  }

  startPradakshina() {
    this.phase = "pradakshina";
    this.roundsCompleted = 0;
    this.objective = `Walk around Shiva & Parvati: Round ${this.roundsCompleted + 1}/${this.targetRounds}`;
    this.updateHUD();

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "I shall perform three sacred circumambulations (pradakshinas) around my revered parents, who embody all worlds."
      }
    ]);
  }

  updateLevel(dt, input) {
    if (this.phase === "pradakshina") {
      // Record golden trail
      if (this.player.isWalking) {
        this.goldenTrail.push({
          x: this.player.x,
          y: this.player.y,
          life: 4.0,
          maxLife: 4.0
        });

        // Track angular position relative to parents center (640, 360)
        const dx = this.player.x - this.center.x;
        const dy = this.player.y - this.center.y;
        let angle = Math.atan2(dy, dx); // -PI to PI
        if (angle < 0) angle += Math.PI * 2; // 0 to 2PI

        // Sectors: 0: East (0), 1: South (PI/2), 2: West (PI), 3: North (3PI/2)
        const sector = Math.floor(angle / (Math.PI / 2));
        this.visitedSectors.add(sector);

        // If player has completed all 4 sectors in sequence
        if (this.visitedSectors.size === 4 && sector === 1) { // back at bottom
          this.visitedSectors.clear();
          this.roundsCompleted++;
          sound.playTempleBell(440 + this.roundsCompleted * 80);
          particles.spawnSparkles(this.player.x, this.player.y, 25, "rgba(244, 196, 48,");
          this.addScore(250);

          if (this.roundsCompleted >= this.targetRounds) {
            this.finishPradakshina();
          } else {
            this.objective = `Walk around Shiva & Parvati: Round ${this.roundsCompleted + 1}/${this.targetRounds}`;
            this.updateHUD();
          }
        }
      }

      // Update golden trail life
      for (let i = this.goldenTrail.length - 1; i >= 0; i--) {
        this.goldenTrail[i].life -= dt;
        if (this.goldenTrail[i].life <= 0) {
          this.goldenTrail.splice(i, 1);
        }
      }
    }
  }

  finishPradakshina() {
    this.phase = "return_scene";
    sound.playShankha();

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Three sacred rounds completed with full devotion and pure love! Round 3/3 complete."
      },
      {
        speaker: "subrahmanya",
        text: "I have circled the whole world and returned! But Brother Vinayaka stands here before me... How did you win?",
        onComplete: () => {
          particles.spawnSparkles(800, 360, 20, "rgba(26, 82, 118,");
        }
      },
      {
        speaker: "vinayaka",
        text: "Dear brother, the physical world is vast, but our parents are the infinite fountain from which the universe springs. To circle them is to circle all existence."
      },
      {
        speaker: "shiva",
        text: "Profound wisdom, Vinayaka! Complete the sacred triad connecting World, Family, and Wisdom to seal this truth."
      },
      {
        speaker: "vinayaka",
        text: "Let me align the triad of divine wisdom!",
        onComplete: () => this.openWisdomPuzzle()
      }
    ]);
  }

  openWisdomPuzzle() {
    const renderPuzzle = () => {
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 14px;">
          Connect the sacred triad in order: <strong>WORLD ➔ FAMILY ➔ WISDOM</strong>
        </div>
        <div style="display: flex; justify-content: space-around; gap: 12px; margin: 16px 0;">
      `;

      this.wisdomNodes.forEach((node, i) => {
        html += `
          <button class="gold-btn btn-wisdom-node" data-id="${node.id}" style="padding: 14px 20px; font-size: 1rem; background: ${node.selected ? 'rgba(46, 204, 113, 0.3)' : 'rgba(20, 29, 51, 0.85)'}; border-color: ${node.selected ? '#2ecc71' : '#f4c430'};">
            <span style="font-size: 1.8rem; display: block; margin-bottom: 4px;">${node.icon}</span>
            ${node.label} ${node.selected ? '✓' : ''}
          </button>
        `;
      });

      html += `</div>`;
      return html;
    };

    const expectedOrder = ["world", "family", "wisdom"];
    let selectionIndex = 0;

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-wisdom-node").forEach(btn => {
        btn.onclick = () => {
          const id = btn.dataset.id;
          if (id === expectedOrder[selectionIndex]) {
            const node = this.wisdomNodes.find(n => n.id === id);
            node.selected = true;
            selectionIndex++;
            sound.playTempleBell(500 + selectionIndex * 100);
            particles.spawnSparkles(640, 360, 15, "rgba(244, 196, 48,");
            this.addScore(150);

            if (selectionIndex >= expectedOrder.length) {
              sound.playPuzzleSuccess();
              particles.spawnSparkles(640, 360, 40, "rgba(255, 235, 130,");
              this.game.closePuzzle();

              this.queueDialogue([
                {
                  speaker: "subrahmanya",
                  text: "You are truly the Lord of Wisdom, dear Vinayaka. With all joy, the divine fruit belongs to you!"
                },
                {
                  speaker: "parvati",
                  text: "Blessings upon you, Vinayaka. Your intellect and filial devotion shall inspire seekers for all eternity.",
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
            this.reduceGuardianMeter(10);
          }
        };
      });
    };

    this.game.openPuzzle({
      title: "The Triad of Wisdom Puzzle",
      instruction: "Tap the nodes in order: WORLD ➔ FAMILY ➔ WISDOM.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  renderBackground(ctx) {
    // Kailash divine summit courtyard
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#121b2d");
    sky.addColorStop(0.5, "#2b2a4a");
    sky.addColorStop(1, "#171c2b");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Sacred circular lotus mandala in center
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    const grad = ctx.createRadialGradient(0, 0, 40, 0, 0, 190);
    grad.addColorStop(0, "rgba(244, 196, 48, 0.25)");
    grad.addColorStop(0.8, "rgba(207, 74, 11, 0.15)");
    grad.addColorStop(1, "rgba(207, 74, 11, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 190, 0, Math.PI * 2);
    ctx.fill();

    // Sacred orbit ring
    ctx.strokeStyle = "rgba(244, 196, 48, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  renderForeground(ctx) {
    // Draw golden sacred glowing trail behind Vinayaka
    for (const p of this.goldenTrail) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = `rgba(244, 196, 48, ${alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6 * alpha, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Subrahmanya returning on peacock if returned
    if (this.phase === "return_scene" || this.phase === "wisdom_puzzle" || this.phase === "complete") {
      Sprites.drawSubrahmanya(ctx, 840, 360, 1.2);
    }
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
  }
}
