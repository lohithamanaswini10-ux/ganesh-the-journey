/**
 * GANESH – THE JOURNEY
 * LevelBase: Core Foundation for All 18 Playable Levels
 */

import { GAME_CONFIG } from "../config.js";
import { sound } from "../audio/soundManager.js";
import { particles } from "../graphics/particles.js";
import { saveManager } from "../storage/saveManager.js";

export class LevelBase {
  constructor(config, game) {
    this.config = config;
    this.game = game;

    this.id = config.id;
    this.worldId = config.worldId;
    this.number = config.number;
    this.title = config.title;
    this.subtitle = config.subtitle;
    this.objective = config.objective;

    // Runtime Gameplay State
    this.score = 0;
    this.elapsedTime = 0;
    this.isPaused = false;
    this.isCompleted = false;
    this.isFailed = false;

    // Standard Counters
    this.modaksCollected = 0;
    this.targetModaks = config.targetModaks || 0;
    this.flowersCollected = 0;
    this.targetFlowers = config.targetFlowers || 0;

    // Guardian Meter
    this.hasMeter = !!config.hasMeter;
    this.guardianMeter = 100;

    // Player (Vinayaka) Avatar State
    this.player = {
      x: GAME_CONFIG.VIRTUAL_WIDTH / 2,
      y: GAME_CONFIG.VIRTUAL_HEIGHT * 0.7,
      radius: 22,
      speed: GAME_CONFIG.PLAYER_SPEED,
      facing: 1,
      isWalking: false,
      walkTime: 0
    };

    // Dialogue Queue
    this.dialogueQueue = [];
    this.currentDialogue = null;

    // Interactive Items / Collectibles in Level
    this.collectibles = [];
    this.interactables = [];
  }

  /**
   * Called when level is loaded and started
   */
  start() {
    this.score = 0;
    this.elapsedTime = 0;
    this.isPaused = false;
    this.isCompleted = false;
    this.isFailed = false;
    this.guardianMeter = 100;
    this.modaksCollected = 0;
    this.flowersCollected = 0;
    this.collectibles = [];
    this.interactables = [];
    this.dialogueQueue = [];
    this.currentDialogue = null;

    // Reset player position
    this.player.x = GAME_CONFIG.VIRTUAL_WIDTH / 2;
    this.player.y = GAME_CONFIG.VIRTUAL_HEIGHT * 0.7;
    this.player.facing = 1;
    this.player.isWalking = false;
    this.player.walkTime = 0;

    this.updateHUD();
    this.setupLevel();
  }

  /**
   * Overridden by child levels to place items, NPCs, and initial dialogue
   */
  setupLevel() {
    // Child implementations
  }

  update(dt, input) {
    if (this.isPaused || this.isCompleted || this.isFailed) return;

    // If dialogue or puzzle modal is active, pause movement
    if (this.currentDialogue || this.game.isModalOpen()) {
      this.player.isWalking = false;
      return;
    }

    this.elapsedTime += dt;
    this.updateHUDTimer();

    // 1. Player Movement
    const move = input.getMovementVector();
    this.player.isWalking = (move.x !== 0 || move.y !== 0);

    if (this.player.isWalking) {
      this.player.x += move.x * this.player.speed * dt;
      this.player.y += move.y * this.player.speed * dt;
      this.player.walkTime += dt;

      if (move.x > 0.05) this.player.facing = 1;
      else if (move.x < -0.05) this.player.facing = -1;

      // Keep player inside playable stage bounds
      this.clampPlayer();
    }

    // 2. Collectibles check
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const item = this.collectibles[i];
      const dist = Math.hypot(this.player.x - item.x, this.player.y - item.y);
      if (dist < this.player.radius + item.radius) {
        this.collectItem(item, i);
      }
    }

    // 3. Interactables check
    if (input.isInteractTriggered() || input.isClickTriggered()) {
      this.checkInteractions();
    }

    // Specific level logic tick
    this.updateLevel(dt, input);
  }

  clampPlayer(minX = 60, maxX = GAME_CONFIG.VIRTUAL_WIDTH - 60, minY = 160, maxY = GAME_CONFIG.VIRTUAL_HEIGHT - 60) {
    this.player.x = Math.max(minX, Math.min(maxX, this.player.x));
    this.player.y = Math.max(minY, Math.min(maxY, this.player.y));
  }

  collectItem(item, index) {
    this.collectibles.splice(index, 1);
    if (item.type === "modak") {
      this.modaksCollected++;
      this.addScore(150);
      sound.playModak();
      particles.spawnSparkles(item.x, item.y, 14, "rgba(255, 235, 130,");
    } else if (item.type === "flower") {
      this.flowersCollected++;
      this.addScore(100);
      sound.playFlower();
      particles.spawnSparkles(item.x, item.y, 10, "rgba(231, 76, 60,");
    } else if (item.type === "clue") {
      this.addScore(200);
      sound.playPuzzleSuccess();
      particles.spawnSparkles(item.x, item.y, 16, "rgba(93, 173, 226,");
      if (item.onCollect) item.onCollect();
    }
    this.updateHUD();
  }

  checkInteractions() {
    for (const obj of this.interactables) {
      const dist = Math.hypot(this.player.x - obj.x, this.player.y - obj.y);
      if (dist < (obj.interactionRadius || 70)) {
        if (obj.onInteract) {
          sound.playClick();
          obj.onInteract();
          break;
        }
      }
    }
  }

  updateLevel(dt, input) {
    // Child implementation
  }

  render(ctx) {
    // 1. Draw level background
    this.renderBackground(ctx);

    // 2. Draw interactables
    for (const obj of this.interactables) {
      if (obj.render) obj.render(ctx);
      // Draw interaction prompt if player is close
      const dist = Math.hypot(this.player.x - obj.x, this.player.y - obj.y);
      if (dist < (obj.interactionRadius || 70)) {
        this.renderInteractionPrompt(ctx, obj.x, obj.y - (obj.promptOffset || 40), obj.promptText || "Interact");
      }
    }

    // 3. Draw collectibles
    for (const item of this.collectibles) {
      if (item.render) item.render(ctx);
    }

    // 4. Draw player (Vinayaka)
    this.renderPlayer(ctx);

    // 5. Draw specific foreground objects & effects
    this.renderForeground(ctx);
  }

  renderBackground(ctx) {
    // Default serene backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    grad.addColorStop(0, "#141d33");
    grad.addColorStop(1, "#090e1a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
  }

  renderPlayer(ctx) {
    // Drawn via Sprites class
  }

  renderForeground(ctx) {
    // Child implementation
  }

  renderInteractionPrompt(ctx, x, y, text) {
    ctx.save();
    ctx.font = "bold 13px Nunito, sans-serif";
    const width = ctx.measureText(text).width + 24;

    ctx.fillStyle = "rgba(14, 20, 36, 0.85)";
    ctx.strokeStyle = "#f4c430";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(x - width / 2, y - 14, width, 26, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff9e6";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`✨ ${text}`, x, y);
    ctx.restore();
  }

  addScore(points) {
    this.score += points;
    this.updateHUD();
  }

  reduceGuardianMeter(amount) {
    this.guardianMeter = Math.max(0, this.guardianMeter - amount);
    sound.playMistake();
    this.updateHUD();

    if (this.guardianMeter <= 0) {
      this.failLevel("Guardian Honor depleted. Respectfully retry the challenge.");
    }
  }

  queueDialogue(dialogues) {
    this.dialogueQueue.push(...dialogues);
    if (!this.currentDialogue) {
      this.showNextDialogue();
    }
  }

  showNextDialogue() {
    if (this.dialogueQueue.length === 0) {
      this.currentDialogue = null;
      this.game.hideDialogue();
      return;
    }

    this.currentDialogue = this.dialogueQueue.shift();
    this.game.showDialogue(this.currentDialogue.speaker, this.currentDialogue.text, () => {
      if (this.currentDialogue && this.currentDialogue.onComplete) {
        this.currentDialogue.onComplete();
      }
      this.showNextDialogue();
    });
  }

  completeLevel(bonus = 300) {
    if (this.isCompleted) return;
    this.isCompleted = true;
    this.addScore(bonus);

    // Calculate stars
    let stars = 3;
    if (this.hasMeter && this.guardianMeter < 70) stars = 2;
    if (this.hasMeter && this.guardianMeter < 40) stars = 1;

    saveManager.saveLevelResult(this.id, this.score, stars, Math.floor(this.elapsedTime));
    sound.playLevelComplete();

    this.game.showVictoryModal({
      levelId: this.id,
      worldId: this.worldId,
      number: this.number,
      title: this.title,
      score: this.score,
      time: this.formatTime(this.elapsedTime),
      modaks: `${this.modaksCollected}/${this.targetModaks || this.modaksCollected}`,
      accuracy: this.hasMeter ? `${this.guardianMeter}%` : "100%",
      stars
    });
  }

  failLevel(reason) {
    if (this.isFailed) return;
    this.isFailed = true;
    sound.playMistake();
    this.game.showFailureModal(reason, () => {
      this.start();
    });
  }

  updateHUD() {
    this.game.updateHUD({
      levelTitle: `Level ${this.number}: ${this.title}`,
      objective: `Objective: ${this.objective}`,
      score: this.score,
      modaks: this.modaksCollected,
      flowers: this.flowersCollected,
      hasMeter: this.hasMeter,
      guardianMeter: this.guardianMeter
    });
  }

  updateHUDTimer() {
    this.game.updateHUDTimer(this.formatTime(this.elapsedTime));
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
}
