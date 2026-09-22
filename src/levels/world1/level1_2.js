/**
 * GANESH – THE JOURNEY
 * World 1, Level 2: Mushikasura
 * Clue investigation, chase sequence with obstacle dodging, peaceful outsmarting,
 * divine mouse transformation, and Mushika narrow burrow mini-game.
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level1_2 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.phase = "investigate"; // investigate -> chase -> outsmart -> transform -> burrow_minigame -> complete
    this.cluesFound = 0;
    this.chaseDistance = 0;
    this.chaseGoal = 1000;
    this.obstacles = [];
    this.obstacleSpawnTimer = 0;

    // Mini-game burrow state
    this.mushikaPos = { x: 200, y: 360 };
    this.burrowTarget = { x: 1080, y: 360 };
  }

  setupLevel() {
    this.phase = "investigate";
    this.cluesFound = 0;
    this.chaseDistance = 0;
    this.obstacles = [];
    this.obstacleSpawnTimer = 0;

    // 3 Clues to discover
    this.clues = [
      {
        x: 260,
        y: 380,
        name: "Nibbled Modak Crumbs",
        desc: "Fragrant sweet crumbs scattered along the grass.",
        found: false
      },
      {
        x: 640,
        y: 520,
        name: "Giant Footprints",
        desc: "Heavy claw marks in the soft mountain earth leading east.",
        found: false
      },
      {
        x: 1040,
        y: 400,
        name: "Disrupted Hibiscus Branch",
        desc: "Broken red blossoms rustled by a scurrying giant.",
        found: false
      }
    ];

    // Create interactables for each clue
    this.clues.forEach((clue, idx) => {
      this.interactables.push({
        x: clue.x,
        y: clue.y,
        interactionRadius: 75,
        promptText: `Inspect Clue: ${clue.name}`,
        promptOffset: 45,
        onInteract: () => this.inspectClue(idx),
        render: (ctx) => {
          if (!clue.found) {
            ctx.save();
            ctx.fillStyle = "rgba(244, 196, 48, 0.3)";
            ctx.strokeStyle = "#f4c430";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(clue.x, clue.y, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.font = "bold 16px Nunito";
            ctx.fillStyle = "#fff9e6";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🔍", clue.x, clue.y);
            ctx.restore();
          }
        }
      });
    });

    // Modaks to collect
    this.collectibles.push(
      { x: 420, y: 440, radius: 18, type: "modak", render: (ctx) => Sprites.drawModak(ctx, 420, 440, 0.9, Math.sin(this.elapsedTime * 4) * 2) },
      { x: 860, y: 360, radius: 18, type: "modak", render: (ctx) => Sprites.drawModak(ctx, 860, 360, 0.9, Math.cos(this.elapsedTime * 4) * 2) }
    );

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Something has disrupted the serenity of Kailash's gardens. Let me investigate the surroundings and find 3 clues."
      }
    ]);
  }

  inspectClue(idx) {
    const clue = this.clues[idx];
    if (clue.found) return;

    clue.found = true;
    this.cluesFound++;
    this.addScore(200);
    sound.playPuzzleSuccess();
    particles.spawnSparkles(clue.x, clue.y, 20, "rgba(93, 173, 226,");

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: `Found Clue (${this.cluesFound}/3): ${clue.name}! ${clue.desc}`,
        onComplete: () => {
          if (this.cluesFound >= 3) {
            this.startChaseSequence();
          }
        }
      }
    ]);
  }

  startChaseSequence() {
    this.phase = "chase";
    this.objective = "Chase Mushikasura! Dodge rocks and boulders (Arrow Keys/WASD)";
    this.updateHUD();

    sound.playShankha();

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "There he is! The rampaging giant Mushikasura dashes across the mountain path. Let's pursue him with agility!"
      }
    ]);
  }

  updateLevel(dt, input) {
    if (this.phase === "chase") {
      this.chaseDistance += 180 * dt;
      this.obstacleSpawnTimer += dt;

      // Spawn rolling rocks/boulders
      if (this.obstacleSpawnTimer > 1.2) {
        this.obstacleSpawnTimer = 0;
        this.obstacles.push({
          x: GAME_CONFIG.VIRTUAL_WIDTH + 40,
          y: 300 + Math.random() * 260,
          radius: 20 + Math.random() * 14,
          speed: 280 + Math.random() * 120,
          rot: 0
        });
      }

      // Update obstacles
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= obs.speed * dt;
        obs.rot += 5 * dt;

        // Collision check with player
        const dist = Math.hypot(this.player.x - obs.x, this.player.y - obs.y);
        if (dist < this.player.radius + obs.radius) {
          sound.playMistake();
          this.reduceGuardianMeter(15);
          particles.spawnSparkles(this.player.x, this.player.y, 10, "rgba(231, 76, 60,");
          this.obstacles.splice(i, 1);
          continue;
        }

        if (obs.x < -50) {
          this.obstacles.splice(i, 1);
        }
      }

      // Check if chase distance reached
      if (this.chaseDistance >= this.chaseGoal) {
        this.obstacles = [];
        this.startOutsmartSequence();
      }
    } else if (this.phase === "burrow_minigame") {
      // Guide Mushika through narrow path
      const move = input.getMovementVector();
      if (move.x !== 0 || move.y !== 0) {
        this.mushikaPos.x += move.x * 220 * dt;
        this.mushikaPos.y += move.y * 220 * dt;

        // Clamp to narrow burrow channel
        this.mushikaPos.x = Math.max(160, Math.min(1120, this.mushikaPos.x));
        this.mushikaPos.y = Math.max(300, Math.min(420, this.mushikaPos.y));
      }

      // Check if target amulet reached
      const dist = Math.hypot(this.mushikaPos.x - this.burrowTarget.x, this.mushikaPos.y - this.burrowTarget.y);
      if (dist < 35) {
        this.finishBurrowMiniGame();
      }
    }
  }

  startOutsmartSequence() {
    this.phase = "outsmart";
    this.objective = "Offer the sacred modak to outsmart Mushikasura peacefully";
    this.updateHUD();

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "True victory does not come from force, but from wisdom and love. Let me offer this fragrant modak."
      },
      {
        speaker: "vinayaka",
        text: "Mushikasura ceases his rampaging! The aroma of devotion fills his heart with peace.",
        onComplete: () => this.startTransformation()
      }
    ]);
  }

  startTransformation() {
    this.phase = "transform";
    sound.playTempleBell(587.33);
    particles.spawnSparkles(640, 440, 40, "rgba(255, 235, 130,");

    this.queueDialogue([
      {
        speaker: "mushika",
        text: "Lord Vinayaka! Your divine benevolence has dissolved all pride and chaos from my soul."
      },
      {
        speaker: "mushika",
        text: "Please accept me as your loyal vehicle and humble companion forever!"
      },
      {
        speaker: "vinayaka",
        text: "Welcome, dear Mushika! Together we shall overcome every obstacle in the universe.",
        onComplete: () => this.startBurrowMiniGame()
      }
    ]);
  }

  startBurrowMiniGame() {
    this.phase = "burrow_minigame";
    this.objective = "Guide little Mushika through the narrow crevice to retrieve the Sacred Amulet!";
    this.updateHUD();

    this.mushikaPos = { x: 200, y: 360 };

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Look, a golden sacred amulet has slipped into this narrow mountain crevice! Mushika, your swift size can reach it. Lead the way!"
      }
    ]);
  }

  finishBurrowMiniGame() {
    this.phase = "complete";
    sound.playPuzzleSuccess();
    particles.spawnSparkles(this.burrowTarget.x, this.burrowTarget.y, 35, "rgba(244, 196, 48,");

    this.queueDialogue([
      {
        speaker: "mushika",
        text: "I retrieved the Sacred Amulet, Lord Vinayaka! My heart rejoices to serve you."
      },
      {
        speaker: "vinayaka",
        text: "Well done, faithful companion! Our eternal journey begins.",
        onComplete: () => {
          this.completeLevel(500);
        }
      }
    ]);
  }

  renderBackground(ctx) {
    // Kailash rocky pine mountain path
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#192a48");
    sky.addColorStop(0.5, "#2a3d60");
    sky.addColorStop(1, "#141d33");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Mountain path ground
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 280, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT - 280);

    // Path dirt strip
    ctx.fillStyle = "#34495e";
    ctx.beginPath();
    ctx.rect(0, 320, GAME_CONFIG.VIRTUAL_WIDTH, 180);
    ctx.fill();

    // If in burrow mini-game, draw narrow crevice channel
    if (this.phase === "burrow_minigame") {
      ctx.fillStyle = "rgba(10, 15, 26, 0.92)";
      ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

      // Lighted burrow path
      ctx.strokeStyle = "#f4c430";
      ctx.lineWidth = 3;
      ctx.fillStyle = "#1b263b";
      ctx.beginPath();
      ctx.roundRect(140, 280, 1000, 160, 20);
      ctx.fill();
      ctx.stroke();

      // Golden Amulet Target
      ctx.save();
      ctx.fillStyle = "#f4d03f";
      ctx.beginPath();
      ctx.arc(this.burrowTarget.x, this.burrowTarget.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "bold 16px Nunito";
      ctx.fillStyle = "#141d33";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🪔", this.burrowTarget.x, this.burrowTarget.y);
      ctx.restore();
    }
  }

  renderPlayer(ctx) {
    if (this.phase === "burrow_minigame") {
      // Draw Mushika in burrow
      Sprites.drawMushika(ctx, this.mushikaPos.x, this.mushikaPos.y, 1.8, 1, true, this.elapsedTime);
    } else {
      Sprites.drawVinayaka(
        ctx,
        this.player.x,
        this.player.y,
        1.2,
        this.player.facing,
        this.player.isWalking,
        this.player.walkTime
      );

      // If transformed, draw Mushika following Vinayaka
      if (this.phase === "outsmart" || this.phase === "transform" || this.phase === "complete") {
        Sprites.drawMushika(ctx, this.player.x - 35 * this.player.facing, this.player.y, 1.2, this.player.facing, this.player.isWalking, this.elapsedTime);
      }
    }
  }

  renderForeground(ctx) {
    // Render rolling obstacles during chase
    if (this.phase === "chase") {
      for (const obs of this.obstacles) {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.rotate(obs.rot);

        ctx.fillStyle = "#7f8c8d";
        ctx.strokeStyle = "#566573";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      // Draw Mushikasura fleeing ahead
      Sprites.drawMushika(ctx, GAME_CONFIG.VIRTUAL_WIDTH - 120, 390 + Math.sin(this.elapsedTime * 12) * 6, 2.8, -1, true, this.elapsedTime);
    }
  }
}
