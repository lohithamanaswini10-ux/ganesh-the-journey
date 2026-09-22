/**
 * GANESH – THE JOURNEY
 * World 1, Level 1: Birth of Vinayaka (Puzzle-Solving Edition)
 * Rich interactive gatekeeper challenge with celestial glyph deduction puzzles,
 * five distinct visitors, and the respectful divine revelation of Lord Shiva.
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level1_1 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.phase = "intro"; // intro -> gate_seal_puzzle -> guard_duty -> visitor_challenge -> shiva_puzzle -> complete
    this.currentVisitorIndex = 0;
    this.decisionTimer = 0;
    this.isTimerActive = false;

    // 5 Distinct Visitors for the Gatekeeper Challenge
    this.visitors = [
      {
        name: "Devotee of Kailash",
        avatar: "devotee",
        title: "A Humble Pilgrim with Fresh Hibiscus",
        dialogue: "Pranam, young guardian! I have journeyed across the mountains to offer fresh hibiscus flowers at Mother Parvati's feet.",
        puzzleType: "flower_match",
        correctDecision: "ALLOW",
        clue: "Carries a fragrant basket of red hibiscus, sings praises with pure heart.",
        successMsg: "Correct! Pure devotion is always welcomed into sacred Kailash.",
        failMsg: "Devoted pilgrims should be welcomed with warmth and blessings."
      },
      {
        name: "Disguised Impostor",
        avatar: "impostor",
        title: "A Shifty Figure with Concealed Intent",
        dialogue: "Hurry, child! Step aside immediately. I bring urgent royal tidings from Indra's court that cannot wait!",
        puzzleType: "shadow_anomaly",
        correctDecision: "STOP",
        clue: "Notice the discord in his shadow: his silhouette conceals an iron mace, and his gaze avoids the sacred gate.",
        successMsg: "Splendid observation! You saw through the disguise and protected Kailash.",
        failMsg: "Beware! The figure hid deceptive intent beneath false urgency."
      },
      {
        name: "Venerable Sage Markandeya",
        avatar: "sage",
        title: "An Ascetic with Kamandalu and Holy Mantras",
        dialogue: "Om Namah Shivaya. Child of the mountain, I seek to offer holy waters of the sacred Manasarovar lake.",
        puzzleType: "vedic_verse",
        correctDecision: "ALLOW",
        clue: "Wears sacred rudraksha beads, carries holy water, speaks with deep calm.",
        successMsg: "Wise decision! True sages of Vedic wisdom are honored guests.",
        failMsg: "Revered sages bearing holy river offerings must not be turned away."
      },
      {
        name: "Disguised Asura Trickster",
        avatar: "impostor",
        title: "A Flattering Merchant with Illusory Modaks",
        dialogue: "Look, little prince! I have brought the sweetest honeyed modaks just for you! Simply let me walk inside while you feast.",
        puzzleType: "illusion_mirror",
        correctDecision: "STOP",
        clue: "His offerings cast no divine reflection in the sacred pool; it is an illusion!",
        successMsg: "Outstanding duty! Duty and dharma stand steadfast above tempting illusions.",
        failMsg: "Never neglect sacred duty for sweet illusions!"
      },
      {
        name: "Wandering Mountain Devotee",
        avatar: "devotee",
        title: "A Tired Pilgrim Seeking Divine Darshan",
        dialogue: "Young guardian, the snowy paths were treacherous, but devotion guided my steps. May I offer this humble lamp?",
        puzzleType: "intent_compass",
        correctDecision: "ALLOW",
        clue: "His hands are frostbitten yet hold the sacred brass diya with unwavering faith.",
        successMsg: "Compassionate wisdom! Faith perseveres through hardships and is blessed.",
        failMsg: "Humble seekers who endured the snows carry true love in their hearts."
      }
    ];

    // Kailash Gateway Celestial Runes Puzzle State
    this.gatewayRunes = [
      { id: "om", name: "Sacred Om", currentRot: 90, targetRot: 0, symbol: "🕉️" },
      { id: "lotus", name: "Divine Lotus", currentRot: 180, targetRot: 0, symbol: "🪷" },
      { id: "trishul", name: "Sacred Trishula", currentRot: 270, targetRot: 0, symbol: "🔱" }
    ];

    // Shiva Revelation Puzzle State
    this.shivaSymbols = [
      { id: "ganga", name: "Holy Ganga", matched: false, icon: "🌊", prompt: "Flowing stream from matted locks" },
      { id: "chandra", name: "Crescent Moon", matched: false, icon: "🌙", prompt: "Silver crescent adorning the crown" },
      { id: "damaru", name: "Sacred Damaru", matched: false, icon: "🥁", prompt: "Cosmic rhythm of creation" },
      { id: "trishul", name: "Divine Trishula", matched: false, icon: "🔱", prompt: "Threefold cosmic harmony" }
    ];
  }

  setupLevel() {
    this.phase = "intro";
    this.currentVisitorIndex = 0;
    this.decisionTimer = 0;
    this.isTimerActive = false;

    // Place Mother Parvati at top center
    this.parvati = { x: GAME_CONFIG.VIRTUAL_WIDTH / 2, y: 260 };

    // Place Sacred Gateway at bottom center
    this.gateway = { x: GAME_CONFIG.VIRTUAL_WIDTH / 2, y: 530, isUnlocked: false };

    // Place introductory interactable near Parvati
    this.interactables.push({
      x: this.parvati.x,
      y: this.parvati.y,
      interactionRadius: 80,
      promptText: "Speak with Mother Parvati",
      promptOffset: 65,
      onInteract: () => this.startIntroDialogue(),
      render: (ctx) => Sprites.drawParvati(ctx, this.parvati.x, this.parvati.y, 1.25)
    });

    // Place Sacred Gateway Guardian Arch
    this.interactables.push({
      x: this.gateway.x,
      y: this.gateway.y,
      interactionRadius: 90,
      promptText: "Inspect Sacred Gate",
      promptOffset: 70,
      onInteract: () => this.onInteractGateway(),
      render: (ctx) => this.drawSacredGate(ctx)
    });

    // Modaks to collect in Kailash garden
    this.collectibles.push(
      { x: 320, y: 380, radius: 18, type: "modak", render: (ctx) => Sprites.drawModak(ctx, 320, 380, 0.9, Math.sin(this.elapsedTime * 4) * 3) },
      { x: 960, y: 380, radius: 18, type: "modak", render: (ctx) => Sprites.drawModak(ctx, 960, 380, 0.9, Math.cos(this.elapsedTime * 4) * 3) }
    );

    // Flowers
    this.collectibles.push(
      { x: 220, y: 460, radius: 18, type: "flower", render: (ctx) => Sprites.drawFlower(ctx, 220, 460, 0.9) },
      { x: 1060, y: 460, radius: 18, type: "flower", render: (ctx) => Sprites.drawFlower(ctx, 1060, 460, 0.9) }
    );

    // Start introductory dialogue automatically
    setTimeout(() => this.startIntroDialogue(), 400);
  }

  startIntroDialogue() {
    this.queueDialogue([
      {
        speaker: "parvati",
        text: "My beloved child Vinayaka, I have created you with divine love. I am entering the inner sanctum for meditation."
      },
      {
        speaker: "parvati",
        text: "Please guard this sacred entrance to Mount Kailash with your sharpest wisdom. Do not permit anyone inside without permission."
      },
      {
        speaker: "vinayaka",
        text: "Mother, your word is my sacred oath. I shall solve every mystery and protect the entrance with unwavering devotion!"
      },
      {
        speaker: "parvati",
        text: "First, approach the Sacred Gateway and align the three Celestial Runes to activate the divine shield of Kailash.",
        onComplete: () => {
          this.phase = "gate_seal_puzzle";
          this.objective = "Approach the Sacred Gate and align the 3 Celestial Runes";
          this.updateHUD();
        }
      }
    ]);
  }

  onInteractGateway() {
    if (!this.gateway.isUnlocked) {
      this.openGatewayRunePuzzle();
    } else if (this.phase === "guard_duty") {
      this.startVisitorChallenge();
    }
  }

  /**
   * Puzzle Phase 1: Align the 3 Celestial Runes of Kailash
   */
  openGatewayRunePuzzle() {
    sound.playTempleBell(440);

    const renderPuzzle = () => {
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 12px;">
          Rotate the 3 Sacred Kailash Stones until they align in perfect cosmic balance (0° upright):
        </div>
        <div style="display: flex; justify-content: space-around; gap: 14px; margin: 16px 0;">
      `;

      this.gatewayRunes.forEach((rune, i) => {
        const isAligned = rune.currentRot % 360 === 0;
        html += `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <div id="rune-${i}" style="width: 80px; height: 80px; border-radius: 50%; background: ${isAligned ? 'rgba(46, 204, 113, 0.2)' : 'rgba(244, 196, 48, 0.15)'}; border: 2px solid ${isAligned ? '#2ecc71' : '#f4c430'}; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; transform: rotate(${rune.currentRot}deg); transition: transform 0.25s ease; cursor: pointer; user-select: none;" title="Tap to rotate 90°">
              ${rune.symbol}
            </div>
            <span style="font-size: 0.85rem; font-weight: 700; color: ${isAligned ? '#2ecc71' : '#f4c430'};">${rune.name}</span>
            <button class="gold-btn small-btn btn-rotate-rune" data-index="${i}">↻ Rotate</button>
          </div>
        `;
      });

      html += `</div>`;
      return html;
    };

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-rotate-rune").forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.index, 10);
          this.gatewayRunes[idx].currentRot = (this.gatewayRunes[idx].currentRot + 90) % 360;
          sound.playClick();
          particles.spawnSparkles(640, 360, 8);

          // Check if all runes are aligned
          const allAligned = this.gatewayRunes.every(r => r.currentRot % 360 === 0);
          if (allAligned) {
            sound.playPuzzleSuccess();
            particles.spawnSparkles(640, 360, 30, "rgba(46, 204, 113,");
            this.addScore(400);
            this.gateway.isUnlocked = true;
            this.game.closePuzzle();

            this.queueDialogue([
              {
                speaker: "vinayaka",
                text: "The three Sacred Runes shine in divine harmony! The protective shield of Kailash is awakened."
              },
              {
                speaker: "vinayaka",
                text: "Now, I will take my post at the gate. Visitors are already approaching the mountain path!",
                onComplete: () => {
                  this.phase = "guard_duty";
                  this.startVisitorChallenge();
                }
              }
            ]);
          } else {
            // Re-render
            container.innerHTML = renderPuzzle();
            setupActions();
          }
        };
      });
    };

    this.game.openPuzzle({
      title: "Sacred Seal of Mount Kailash",
      instruction: "Rotate each sacred stone so its divine symbol stands upright.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  /**
   * Puzzle Phase 2: The Five Visitors Challenge
   */
  startVisitorChallenge() {
    if (this.currentVisitorIndex >= this.visitors.length) {
      // Move to Lord Shiva's Arrival!
      this.startShivaArrival();
      return;
    }

    const visitor = this.visitors[this.currentVisitorIndex];
    this.objective = `Inspect Visitor ${this.currentVisitorIndex + 1}/5: ${visitor.name}`;
    this.updateHUD();

    // Position visitor at gate entrance
    this.activeVisitorEntity = {
      x: GAME_CONFIG.VIRTUAL_WIDTH / 2,
      y: 620,
      avatar: visitor.avatar
    };

    this.queueDialogue([
      {
        speaker: visitor.avatar,
        text: `[Visitor ${this.currentVisitorIndex + 1}/5]: "${visitor.dialogue}"`
      },
      {
        speaker: "vinayaka",
        text: `Let me inspect the clues and solve the deduction puzzle to discern their true intent.`,
        onComplete: () => this.openVisitorDeductionPuzzle(visitor)
      }
    ]);
  }

  openVisitorDeductionPuzzle(visitor) {
    this.decisionTimer = 5.0;
    this.isTimerActive = true;

    const renderPuzzle = () => {
      return `
        <div style="display: flex; flex-direction: column; gap: 12px; color: #fff9e6;">
          <div style="background: rgba(20, 29, 51, 0.85); border-left: 4px solid #f4c430; padding: 10px 14px; border-radius: 6px;">
            <strong style="color: #f4c430; font-size: 1.05rem;">Observation & Clue:</strong>
            <p style="margin-top: 4px; font-size: 0.92rem; color: #fdfefe;">${visitor.clue}</p>
          </div>

          <div style="background: rgba(14, 20, 36, 0.7); border: 1px solid rgba(244, 196, 48, 0.4); border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 0.85rem; color: #d5c8b0; margin-bottom: 6px;">Decision Window:</div>
            <div id="decision-timer-bar" style="width: 100%; height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden;">
              <div id="timer-fill" style="width: 100%; height: 100%; background: #2ecc71; transition: width 0.1s linear;"></div>
            </div>
            <span id="timer-sec" style="font-weight: 800; font-size: 1.1rem; color: #f4c430; margin-top: 6px; display: inline-block;">5.0s</span>
          </div>

          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
            <button id="btn-allow" class="gold-btn glow-btn" style="min-width: 130px; background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%); border-color: #58d68d;">
              ✔ ALLOW
            </button>
            <button id="btn-stop" class="gold-btn" style="min-width: 130px; background: linear-gradient(135deg, #c0392b 0%, #922b21 100%); border-color: #ec7063; color: white;">
              ✖ STOP
            </button>
          </div>
        </div>
      `;
    };

    let timerInterval = null;

    const onDecision = (choice) => {
      clearInterval(timerInterval);
      this.isTimerActive = false;
      this.game.closePuzzle();

      const isCorrect = choice === visitor.correctDecision;

      if (isCorrect) {
        sound.playPuzzleSuccess();
        particles.spawnSparkles(GAME_CONFIG.VIRTUAL_WIDTH / 2, 600, 25, "rgba(46, 204, 113,");
        this.addScore(250);
        this.queueDialogue([
          {
            speaker: "vinayaka",
            text: visitor.successMsg,
            onComplete: () => {
              this.currentVisitorIndex++;
              this.startVisitorChallenge();
            }
          }
        ]);
      } else {
        this.reduceGuardianMeter(20);
        this.queueDialogue([
          {
            speaker: "vinayaka",
            text: visitor.failMsg,
            onComplete: () => {
              this.currentVisitorIndex++;
              this.startVisitorChallenge();
            }
          }
        ]);
      }
    };

    const setupActions = () => {
      const btnAllow = document.getElementById("btn-allow");
      const btnStop = document.getElementById("btn-stop");
      const timerFill = document.getElementById("timer-fill");
      const timerSec = document.getElementById("timer-sec");

      if (btnAllow) btnAllow.onclick = () => onDecision("ALLOW");
      if (btnStop) btnStop.onclick = () => onDecision("STOP");

      const startTime = Date.now();
      timerInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, 5.0 - elapsed);

        if (timerSec) timerSec.innerText = `${remaining.toFixed(1)}s`;
        if (timerFill) {
          const pct = (remaining / 5.0) * 100;
          timerFill.style.width = `${pct}%`;
          if (pct < 30) timerFill.style.background = "#e74c3c";
          else if (pct < 60) timerFill.style.background = "#f39c12";
        }

        if (remaining <= 0) {
          clearInterval(timerInterval);
          // Default to STOP if timer runs out (safe guardian instinct)
          onDecision("STOP");
        }
      }, 100);
    };

    this.game.openPuzzle({
      title: `Gatekeeper Inspection: ${visitor.name}`,
      instruction: "Examine the clues carefully and choose whether to ALLOW or STOP the visitor.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  /**
   * Puzzle Phase 3: Divine Arrival of Lord Shiva
   */
  startShivaArrival() {
    this.phase = "shiva_puzzle";
    this.objective = "Solve the Divine Celestial Harmony to recognize Lord Shiva";
    this.updateHUD();

    sound.playShankha();
    sound.playTempleBell(523.25);
    particles.spawnPetalShower(GAME_CONFIG.VIRTUAL_WIDTH, 35);

    // Shiva Entity at Gate
    this.shivaEntity = {
      x: GAME_CONFIG.VIRTUAL_WIDTH / 2,
      y: 620
    };

    this.queueDialogue([
      {
        speaker: "shiva",
        text: "Om Namah Shivaya. Little one, I have returned to Mount Kailash. Who stands vigilant at my gate?"
      },
      {
        speaker: "vinayaka",
        text: "I am Vinayaka, Mother Parvati's son. She asked me to guard this entrance with supreme devotion and truth."
      },
      {
        speaker: "shiva",
        text: "A true guardian discerns the cosmic essence of the universe. Align the four celestial attributes of Kailash to reveal my eternal truth."
      },
      {
        speaker: "vinayaka",
        text: "I will align the sacred cosmic elements with deep reverence!",
        onComplete: () => this.openShivaHarmonyPuzzle()
      }
    ]);
  }

  openShivaHarmonyPuzzle() {
    const renderPuzzle = () => {
      let html = `
        <div style="text-align: center; color: #fff9e6; margin-bottom: 12px;">
          Match all four celestial attributes with their sacred divine descriptions:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 14px 0;">
      `;

      this.shivaSymbols.forEach((sym, i) => {
        html += `
          <button class="gold-btn btn-shiva-match" data-index="${i}" style="display: flex; align-items: center; gap: 10px; text-align: left; padding: 10px 14px; background: ${sym.matched ? 'rgba(46, 204, 113, 0.3)' : 'rgba(20, 29, 51, 0.85)'}; border-color: ${sym.matched ? '#2ecc71' : '#f4c430'};">
            <span style="font-size: 1.6rem;">${sym.icon}</span>
            <div style="display: flex; flex-direction: column;">
              <strong style="color: #f4c430; font-size: 0.95rem;">${sym.name}</strong>
              <span style="font-size: 0.75rem; color: #d5c8b0;">${sym.prompt}</span>
            </div>
            ${sym.matched ? '<span style="margin-left: auto; color: #2ecc71; font-weight: bold;">✓</span>' : ''}
          </button>
        `;
      });

      html += `</div>`;
      return html;
    };

    const setupActions = () => {
      const container = document.getElementById("puzzle-content");
      if (!container) return;

      container.querySelectorAll(".btn-shiva-match").forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (!this.shivaSymbols[idx].matched) {
            this.shivaSymbols[idx].matched = true;
            sound.playTempleBell(500 + idx * 80);
            particles.spawnSparkles(640, 360, 15, "rgba(244, 196, 48,");
            this.addScore(150);

            const allMatched = this.shivaSymbols.every(s => s.matched);
            if (allMatched) {
              sound.playPuzzleSuccess();
              particles.spawnSparkles(640, 360, 40, "rgba(255, 235, 130,");
              this.game.closePuzzle();

              // Divine Revelation Dialogue & Level Completion
              this.queueDialogue([
                {
                  speaker: "vinayaka",
                  text: "The Ganga, the Crescent Moon, the Damaru, and the Trishula... You are Lord Shiva, Father of the Universe and Lord of Kailash!"
                },
                {
                  speaker: "shiva",
                  text: "Well recognized, my child Vinayaka! Your steadfast sense of duty and piercing wisdom have proven your greatness to all three worlds."
                },
                {
                  speaker: "parvati",
                  text: "Vinayaka has fulfilled his duty with immaculate honor and intellect! He shall forever be known as the Lord of Wisdom and Beginnings."
                },
                {
                  speaker: "vinayaka",
                  text: "With the divine blessings of Mother and Father, my heart is filled with eternal joy!",
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
      title: "Celestial Harmony of Lord Shiva",
      instruction: "Tap each sacred symbol to harmonize the divine elements of Mount Kailash.",
      render: renderPuzzle,
      onOpen: setupActions
    });
  }

  drawSacredGate(ctx) {
    const x = this.gateway.x;
    const y = this.gateway.y;

    ctx.save();
    // Sacred Pillars
    ctx.fillStyle = "#2c3e50";
    ctx.strokeStyle = "#f4c430";
    ctx.lineWidth = 2;

    // Left Pillar
    ctx.fillRect(x - 140, y - 90, 24, 120);
    ctx.strokeRect(x - 140, y - 90, 24, 120);

    // Right Pillar
    ctx.fillRect(x + 116, y - 90, 24, 120);
    ctx.strokeRect(x + 116, y - 90, 24, 120);

    // Archway Beam
    ctx.fillRect(x - 150, y - 110, 300, 22);
    ctx.strokeRect(x - 150, y - 110, 300, 22);

    // Golden Arch Embellishments
    ctx.fillStyle = "#f4c430";
    ctx.font = "bold 16px 'Cinzel', Georgia";
    ctx.textAlign = "center";
    ctx.fillText("॥ ॐ नमः शिवाय ॥", x, y - 93);

    // Glowing Sacred Barrier Shield
    if (!this.gateway.isUnlocked) {
      const shieldGlow = ctx.createLinearGradient(x - 120, y - 80, x + 120, y + 20);
      shieldGlow.addColorStop(0, "rgba(244, 196, 48, 0.4)");
      shieldGlow.addColorStop(0.5, "rgba(230, 126, 34, 0.2)");
      shieldGlow.addColorStop(1, "rgba(244, 196, 48, 0.4)");
      ctx.fillStyle = shieldGlow;
      ctx.fillRect(x - 116, y - 88, 232, 116);
    }

    ctx.restore();
  }

  renderBackground(ctx) {
    // Mount Kailash Snow Peaks & Sacred Twilight Sky
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#0e1830");
    sky.addColorStop(0.45, "#1f335e");
    sky.addColorStop(0.8, "#3d2347");
    sky.addColorStop(1, "#141d33");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Distant Snow Mountains (Kailash)
    ctx.fillStyle = "#2c3e6b";
    ctx.beginPath();
    ctx.moveTo(100, 360);
    ctx.lineTo(GAME_CONFIG.VIRTUAL_WIDTH / 2, 110);
    ctx.lineTo(GAME_CONFIG.VIRTUAL_WIDTH - 100, 360);
    ctx.closePath();
    ctx.fill();

    // Snow Cap on Kailash Peak
    ctx.fillStyle = "#fdfefe";
    ctx.beginPath();
    ctx.moveTo(GAME_CONFIG.VIRTUAL_WIDTH / 2 - 110, 180);
    ctx.lineTo(GAME_CONFIG.VIRTUAL_WIDTH / 2, 110);
    ctx.lineTo(GAME_CONFIG.VIRTUAL_WIDTH / 2 + 110, 180);
    ctx.quadraticCurveTo(GAME_CONFIG.VIRTUAL_WIDTH / 2, 160, GAME_CONFIG.VIRTUAL_WIDTH / 2 - 110, 180);
    ctx.closePath();
    ctx.fill();

    // Sacred Temple Courtyard Ground
    const ground = ctx.createLinearGradient(0, 340, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    ground.addColorStop(0, "#232b3e");
    ground.addColorStop(1, "#111726");
    ctx.fillStyle = ground;
    ctx.fillRect(0, 340, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT - 340);

    // Stone tile pathway lines
    ctx.strokeStyle = "rgba(244, 196, 48, 0.12)";
    ctx.lineWidth = 1.5;
    for (let x = 120; x < GAME_CONFIG.VIRTUAL_WIDTH; x += 180) {
      ctx.beginPath();
      ctx.moveTo(x, 340);
      ctx.lineTo(x, GAME_CONFIG.VIRTUAL_HEIGHT);
      ctx.stroke();
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

  renderForeground(ctx) {
    // Render current active visitor if present
    if (this.activeVisitorEntity && this.phase === "visitor_challenge") {
      Sprites.drawDevotee(ctx, this.activeVisitorEntity.x, this.activeVisitorEntity.y, 1.25, this.activeVisitorEntity.avatar);
    }

    // Render Lord Shiva if in shiva phase
    if (this.shivaEntity && this.phase === "shiva_puzzle") {
      Sprites.drawShiva(ctx, this.shivaEntity.x, this.shivaEntity.y, 1.3);
    }
  }
}
