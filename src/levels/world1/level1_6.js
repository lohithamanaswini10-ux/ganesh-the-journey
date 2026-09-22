/**
 * GANESH – THE JOURNEY
 * World 1, Level 6: The Final Journey
 * 5-Phase Grand Culmination of Mythology World:
 * Phase 1: Prepare the Journey
 * Phase 2: Playable Traditional Village Journey (clear fallen branch, help devotee, collect flower)
 * Phase 3: Sacred River Ghat Celebration
 * Phase 4: Peaceful Visarjan into Sacred Waters at Sunset
 * Phase 5: World Completion (MYTHOLOGY WORLD COMPLETE — 6/6 LEVELS, NO LEVEL 7!)
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";
import { saveManager } from "../../storage/saveManager.js";

export class Level1_6 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.phase = "phase1_prep"; // phase1_prep -> phase2_journey -> phase3_celebrate -> phase4_visarjan -> phase5_complete
    this.prepTasks = {
      decorations: false,
      offerings: false,
      meetMushika: false
    };

    this.journeyTasks = {
      pathCleared: false,
      flowerCollected: false,
      devoteeHelped: false
    };

    this.waterRipples = [];
  }

  setupLevel() {
    this.phase = "phase1_prep";
    this.prepTasks = { decorations: false, offerings: false, meetMushika: false };
    this.journeyTasks = { pathCleared: false, flowerCollected: false, devoteeHelped: false };
    this.waterRipples = [];

    this.player.x = 200;
    this.player.y = 480;

    // Phase 1 Setup
    this.setupPhase1();

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "The auspicious time has arrived for the sacred Visarjan journey. Let us complete our preparations in the mandap."
      }
    ]);
  }

  setupPhase1() {
    this.objective = "Phase 1: Prepare decorations, gather offerings, and meet Mushika";
    this.updateHUD();

    // 1. Decorations station
    this.interactables.push({
      x: 320,
      y: 400,
      interactionRadius: 70,
      promptText: "Prepare Traditional Decorations",
      promptOffset: 45,
      onInteract: () => {
        if (!this.prepTasks.decorations) {
          this.prepTasks.decorations = true;
          sound.playTempleBell(523.25);
          particles.spawnSparkles(320, 400, 15);
          this.addScore(150);
          this.checkPhase1Progress();
        }
      },
      render: (ctx) => {
        ctx.fillStyle = this.prepTasks.decorations ? "#27ae60" : "#f39c12";
        ctx.font = "bold 18px Nunito";
        ctx.fillText("🌺 Garlands", 280, 395);
      }
    });

    // 2. Offerings station
    this.interactables.push({
      x: 640,
      y: 380,
      interactionRadius: 70,
      promptText: "Gather Sacred Offerings",
      promptOffset: 45,
      onInteract: () => {
        if (!this.prepTasks.offerings) {
          this.prepTasks.offerings = true;
          sound.playModak();
          particles.spawnSparkles(640, 380, 15);
          this.addScore(150);
          this.checkPhase1Progress();
        }
      },
      render: (ctx) => {
        Sprites.drawModak(ctx, 640, 380, 1.2, 0);
      }
    });

    // 3. Meet Mushika station
    this.interactables.push({
      x: 960,
      y: 440,
      interactionRadius: 70,
      promptText: "Confer with Mushika",
      promptOffset: 45,
      onInteract: () => {
        if (!this.prepTasks.meetMushika) {
          this.prepTasks.meetMushika = true;
          sound.playTempleBell(659.25);
          particles.spawnSparkles(960, 440, 15);
          this.addScore(150);
          this.checkPhase1Progress();
        }
      },
      render: (ctx) => {
        Sprites.drawMushika(ctx, 960, 440, 1.4, -1, false, this.elapsedTime);
      }
    });
  }

  checkPhase1Progress() {
    if (this.prepTasks.decorations && this.prepTasks.offerings && this.prepTasks.meetMushika) {
      this.queueDialogue([
        {
          speaker: "mushika",
          text: "All offerings and decorations are prepared! The devotees eagerly await us along the village path."
        },
        {
          speaker: "vinayaka",
          text: "Let the sacred procession begin! Ganapati Bappa Morya!",
          onComplete: () => this.startPhase2Journey()
        }
      ]);
    }
  }

  startPhase2Journey() {
    this.phase = "phase2_journey";
    this.objective = "Phase 2: Clear the path, collect the fallen flower, and help the pilgrim";
    this.updateHUD();

    sound.playShankha();
    this.interactables = [];
    this.player.x = 140;
    this.player.y = 500;

    // 1. Fallen Branch blocking path
    this.interactables.push({
      x: 440,
      y: 500,
      interactionRadius: 75,
      promptText: "Clear Fallen Branch from Path",
      promptOffset: 40,
      onInteract: () => {
        if (!this.journeyTasks.pathCleared) {
          this.journeyTasks.pathCleared = true;
          sound.playTempleBell(440);
          particles.spawnSparkles(440, 500, 20);
          this.addScore(200);
          this.checkPhase2Progress();
        }
      },
      render: (ctx) => {
        if (!this.journeyTasks.pathCleared) {
          ctx.fillStyle = "#795548";
          ctx.beginPath();
          ctx.rect(410, 480, 60, 18);
          ctx.fill();
        }
      }
    });

    // 2. Fallen Flower to collect
    this.interactables.push({
      x: 680,
      y: 460,
      interactionRadius: 65,
      promptText: "Collect Fallen Sacred Hibiscus",
      promptOffset: 35,
      onInteract: () => {
        if (!this.journeyTasks.flowerCollected) {
          this.journeyTasks.flowerCollected = true;
          sound.playFlower();
          particles.spawnSparkles(680, 460, 15);
          this.addScore(150);
          this.checkPhase2Progress();
        }
      },
      render: (ctx) => {
        if (!this.journeyTasks.flowerCollected) {
          Sprites.drawFlower(ctx, 680, 460, 1.1);
        }
      }
    });

    // 3. Devotee seeking help finding an offering
    this.interactables.push({
      x: 940,
      y: 480,
      interactionRadius: 75,
      promptText: "Help Devotee with Offering",
      promptOffset: 55,
      onInteract: () => {
        if (!this.journeyTasks.devoteeHelped) {
          this.journeyTasks.devoteeHelped = true;
          sound.playPuzzleSuccess();
          particles.spawnSparkles(940, 480, 20, "rgba(46, 204, 113,");
          this.addScore(250);
          this.queueDialogue([
            {
              speaker: "devotee",
              text: "Thank you, beloved Ganesha! With this blessed modak, my family's prayer is complete."
            },
            {
              speaker: "vinayaka",
              text: "Blessings of health, peace, and abundance upon your home!",
              onComplete: () => this.checkPhase2Progress()
            }
          ]);
        }
      },
      render: (ctx) => {
        Sprites.drawDevotee(ctx, 940, 480, 1.25, "devotee");
      }
    });
  }

  checkPhase2Progress() {
    if (this.journeyTasks.pathCleared && this.journeyTasks.flowerCollected && this.journeyTasks.devoteeHelped) {
      this.queueDialogue([
        {
          speaker: "vinayaka",
          text: "The path is clear and hearts are uplifted. Behold, the sacred river ghat shines in the warm sunset!",
          onComplete: () => this.startPhase3Celebration()
        }
      ]);
    }
  }

  startPhase3Celebration() {
    this.phase = "phase3_celebrate";
    this.objective = "Phase 3: Light the farewell lamps at the sacred river ghat";
    this.updateHUD();

    this.interactables = [];
    this.player.x = 340;
    this.player.y = 520;

    // 3 Ghat Lamps to light
    this.ghatLamps = [
      { x: 440, y: 440, lit: false },
      { x: 640, y: 440, lit: false },
      { x: 840, y: 440, lit: false }
    ];

    this.ghatLamps.forEach((lamp, idx) => {
      this.interactables.push({
        x: lamp.x,
        y: lamp.y,
        interactionRadius: 65,
        promptText: `Light Ghat Diya ${idx + 1}/3`,
        promptOffset: 35,
        onInteract: () => {
          if (!lamp.lit) {
            lamp.lit = true;
            sound.playTempleBell(523.25 + idx * 70);
            particles.spawnSparkles(lamp.x, lamp.y, 20);
            this.addScore(150);

            if (this.ghatLamps.every(l => l.lit)) {
              this.queueDialogue([
                {
                  speaker: "vinayaka",
                  text: "The river ghat glows like a constellation of stars on water. The moment of Visarjan has arrived.",
                  onComplete: () => this.startPhase4Visarjan()
                }
              ]);
            }
          }
        },
        render: (ctx) => {
          Sprites.drawDiya(ctx, lamp.x, lamp.y, 1.25, lamp.lit, this.elapsedTime);
        }
      });
    });
  }

  startPhase4Visarjan() {
    this.phase = "phase4_visarjan";
    this.objective = "Phase 4: Perform the sacred, peaceful farewell Visarjan";
    this.updateHUD();

    sound.playShankha();
    sound.playTempleBell(440);
    particles.spawnPetalShower(GAME_CONFIG.VIRTUAL_WIDTH, 45);

    this.interactables = [];
    this.visarjanAltar = { x: 640, y: 460 };

    this.interactables.push({
      x: this.visarjanAltar.x,
      y: this.visarjanAltar.y,
      interactionRadius: 90,
      promptText: "Perform Respectful Visarjan",
      promptOffset: 55,
      onInteract: () => this.triggerPhase5Completion()
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Just as water returns to the sea and earth returns to nature, divine form merges into formless eternity."
      },
      {
        speaker: "vinayaka",
        text: "Pudhchya varshi lavkar ya! (Return early next year, O Lord!)",
        onComplete: () => {
          particles.spawnRipple(640, 520, 90);
        }
      }
    ]);
  }

  triggerPhase5Completion() {
    this.phase = "phase5_complete";
    this.isCompleted = true;
    this.addScore(500);

    saveManager.saveLevelResult(this.id, this.score, 3, Math.floor(this.elapsedTime));
    sound.playWorldComplete();

    const worldProg = saveManager.getWorldProgress(1);

    // Show World Completion Banner (STRICTLY World 1 Complete 6/6, NO LEVEL 7!)
    this.game.showWorldCompleteModal({
      worldId: 1,
      worldTitle: "MYTHOLOGY WORLD COMPLETE — 6/6 LEVELS",
      quote: "Thank you for joining Vinayaka on his journey.",
      levelsDone: "6 / 6",
      totalScore: worldProg.worldScore,
      totalTime: this.formatTime(this.elapsedTime)
    });
  }

  renderBackground(ctx) {
    if (this.phase === "phase1_prep") {
      // Mandap interior
      const grad = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
      grad.addColorStop(0, "#2c1b3a");
      grad.addColorStop(1, "#141124");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

      // Floor
      ctx.fillStyle = "#3a254c";
      ctx.fillRect(0, 420, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT - 420);
    } else if (this.phase === "phase2_journey") {
      // Village tree path
      const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
      sky.addColorStop(0, "#4a235a");
      sky.addColorStop(0.5, "#7d3c98");
      sky.addColorStop(1, "#d35400");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

      // Distant village trees
      ctx.fillStyle = "#1e8449";
      for (let i = 40; i < GAME_CONFIG.VIRTUAL_WIDTH; i += 180) {
        ctx.beginPath();
        ctx.arc(i, 380, 50, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dirt path
      ctx.fillStyle = "#d68910";
      ctx.fillRect(0, 420, GAME_CONFIG.VIRTUAL_WIDTH, 180);
    } else {
      // Sunset Sacred River Ghat
      const sunset = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
      sunset.addColorStop(0, "#2c1844");
      sunset.addColorStop(0.4, "#ba4a00");
      sunset.addColorStop(0.7, "#f39c12");
      sunset.addColorStop(1, "#1a5276");
      ctx.fillStyle = sunset;
      ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

      // Sacred River Waters
      const water = ctx.createLinearGradient(0, 460, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
      water.addColorStop(0, "#1f618d");
      water.addColorStop(0.5, "#154360");
      water.addColorStop(1, "#0e2f44");
      ctx.fillStyle = water;
      ctx.fillRect(0, 460, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT - 460);

      // Water sunset golden shimmer
      ctx.fillStyle = "rgba(244, 196, 48, 0.25)";
      ctx.fillRect(GAME_CONFIG.VIRTUAL_WIDTH / 2 - 140, 460, 280, GAME_CONFIG.VIRTUAL_HEIGHT - 460);
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

    // Mushika accompanies Vinayaka
    Sprites.drawMushika(ctx, this.player.x - 30 * this.player.facing, this.player.y, 1.2, this.player.facing, this.player.isWalking, this.elapsedTime);
  }
}
