/**
 * GANESH – THE JOURNEY
 * Master Game Bootstrapper & Coordinator
 * Orchestrates Canvas 2D Engine, 18 Levels, Multi-Device Adaptation,
 * State Machine, Sound, UI Overlays & Game Loop.
 */

import { GAME_CONFIG, WORLDS_DATA } from "./config.js";
import { sound } from "./audio/soundManager.js";
import { saveManager } from "./storage/saveManager.js";
import { input } from "./input/inputManager.js";
import { particles } from "./graphics/particles.js";
import { Sprites } from "./graphics/sprites.js";
import { MenuManager } from "./ui/menuManager.js";

// Level Imports
import { Level1_1 } from "./levels/world1/level1_1.js";
import { Level1_2 } from "./levels/world1/level1_2.js";
import { Level1_3 } from "./levels/world1/level1_3.js";
import { Level1_4 } from "./levels/world1/level1_4.js";
import { Level1_5 } from "./levels/world1/level1_5.js";
import { Level1_6 } from "./levels/world1/level1_6.js";

import { Level2_1 } from "./levels/world2/level2_1.js";
import { Level2_2 } from "./levels/world2/level2_2.js";
import { Level2_3 } from "./levels/world2/level2_3.js";
import { Level2_4 } from "./levels/world2/level2_4.js";
import { Level2_5 } from "./levels/world2/level2_5.js";
import { Level2_6 } from "./levels/world2/level2_6.js";

import { Level3_1 } from "./levels/world3/level3_1.js";
import { Level3_2 } from "./levels/world3/level3_2.js";
import { Level3_3 } from "./levels/world3/level3_3.js";
import { Level3_4 } from "./levels/world3/level3_4.js";
import { Level3_5 } from "./levels/world3/level3_5.js";
import { Level3_6 } from "./levels/world3/level3_6.js";

class GaneshGame {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    // HiDPI & Responsive Scaling
    this.scale = 1;
    this.virtualWidth = GAME_CONFIG.VIRTUAL_WIDTH;
    this.virtualHeight = GAME_CONFIG.VIRTUAL_HEIGHT;

    // Game States: 'MENU', 'PLAYING', 'PAUSED'
    this.gameState = "MENU";

    // Level Registry (All 18 Levels)
    this.levelClasses = {
      1: Level1_1, 2: Level1_2, 3: Level1_3, 4: Level1_4, 5: Level1_5, 6: Level1_6,
      7: Level2_1, 8: Level2_2, 9: Level2_3, 10: Level2_4, 11: Level2_5, 12: Level2_6,
      13: Level3_1, 14: Level3_2, 15: Level3_3, 16: Level3_4, 17: Level3_5, 18: Level3_6
    };

    this.currentLevel = null;
    this.currentLevelId = 1;

    // UI & Managers
    this.menuManager = new MenuManager(this);

    // DOM UI elements
    this.hudEl = document.getElementById("game-hud");
    this.hudLevelTitle = document.getElementById("hud-level-title");
    this.hudObjective = document.getElementById("hud-objective");
    this.hudScore = document.getElementById("stat-score");
    this.hudTimer = document.getElementById("stat-timer");
    this.hudModaks = document.getElementById("stat-modaks");
    this.hudFlowers = document.getElementById("stat-flowers");
    this.guardianMeterBox = document.getElementById("guardian-meter-container");
    this.meterFill = document.getElementById("meter-fill");
    this.meterVal = document.getElementById("meter-val");

    // Modals
    this.dialogueModal = document.getElementById("modal-dialogue");
    this.dialogueAvatarCanvas = document.getElementById("dialogue-avatar");
    this.dialogueSpeakerName = document.getElementById("dialogue-speaker");
    this.dialogueText = document.getElementById("dialogue-text");
    this.btnDialogueNext = document.getElementById("btn-dialogue-next");
    this.onDialogueComplete = null;

    this.puzzleModal = document.getElementById("modal-puzzle");
    this.puzzleTitle = document.getElementById("puzzle-title");
    this.puzzleInstruction = document.getElementById("puzzle-instruction");
    this.puzzleContent = document.getElementById("puzzle-content");
    this.btnPuzzleClose = document.getElementById("btn-puzzle-close");

    this.pauseModal = document.getElementById("modal-pause");
    this.victoryModal = document.getElementById("modal-victory");
    this.worldCompleteModal = document.getElementById("modal-world-complete");

    // Game loop timing
    this.lastTime = performance.now();

    this.setupResizeListener();
    this.setupDialogueControls();
    this.setupPuzzleModal();

    // Start in Main Menu
    this.menuManager.showMainMenu();

    // Kick off animation loop
    requestAnimationFrame((t) => this.loop(t));
  }

  setupResizeListener() {
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.canvas.width = this.virtualWidth * dpr;
      this.canvas.height = this.virtualHeight * dpr;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;

      this.ctx.resetTransform();
      this.ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", () => setTimeout(resize, 150));
    resize();
  }

  setupDialogueControls() {
    const advanceDialogue = () => {
      if (!this.dialogueModal.classList.contains("hidden") && this.onDialogueComplete) {
        sound.playClick();
        const cb = this.onDialogueComplete;
        this.onDialogueComplete = null;
        cb();
      }
    };

    if (this.btnDialogueNext) {
      this.btnDialogueNext.addEventListener("click", advanceDialogue);
    }
    if (this.dialogueModal) {
      this.dialogueModal.addEventListener("click", (e) => {
        if (e.target === this.dialogueModal || e.target.closest(".dialogue-box")) {
          advanceDialogue();
        }
      });
    }

    // Advance dialogue on Space / Enter
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "KeyE") {
        if (!this.dialogueModal.classList.contains("hidden")) {
          e.preventDefault();
          advanceDialogue();
        }
      }
    });
  }

  setupPuzzleModal() {
    if (this.btnPuzzleClose) {
      this.btnPuzzleClose.addEventListener("click", () => {
        sound.playClick();
        this.closePuzzle();
      });
    }
  }

  startLevel(levelId) {
    this.currentLevelId = levelId;
    const LevelClass = this.levelClasses[levelId];
    if (!LevelClass) {
      console.warn(`Level ${levelId} not found.`);
      return;
    }

    // Find config
    let levelConfig = null;
    for (const w of WORLDS_DATA) {
      const found = w.levels.find(l => l.id === levelId);
      if (found) { levelConfig = found; break; }
    }

    // Hide menus & modals
    this.menuManager.showScreen(null);
    this.pauseModal.classList.add("hidden");
    this.victoryModal.classList.add("hidden");
    this.worldCompleteModal.classList.add("hidden");
    this.dialogueModal.classList.add("hidden");
    this.puzzleModal.classList.add("hidden");

    // Show HUD
    if (this.hudEl) this.hudEl.classList.remove("hidden");

    particles.clear();
    input.reset();

    // Start level instance
    this.currentLevel = new LevelClass(levelConfig, this);
    this.currentLevel.start();
    this.gameState = "PLAYING";

    // Play appropriate ambient music
    const worldTheme = levelId <= 6 ? "kailash" : (levelId <= 12 ? "heritage" : "workshop");
    sound.startAmbientMusic(worldTheme);
  }

  restartCurrentLevel() {
    if (this.currentLevelId) {
      this.startLevel(this.currentLevelId);
    }
  }

  togglePause() {
    if (this.gameState === "PLAYING") {
      this.gameState = "PAUSED";
      if (this.currentLevel) this.currentLevel.isPaused = true;
      this.pauseModal.classList.remove("hidden");
      sound.playClick();
    } else if (this.gameState === "PAUSED") {
      this.gameState = "PLAYING";
      if (this.currentLevel) this.currentLevel.isPaused = false;
      this.pauseModal.classList.add("hidden");
      sound.playClick();
    }
  }

  showDialogue(speaker, text, onComplete) {
    this.dialogueModal.classList.remove("hidden");
    this.dialogueModal.setAttribute("aria-hidden", "false");

    const names = {
      vinayaka: "Lord Vinayaka",
      parvati: "Mother Parvati",
      shiva: "Lord Shiva",
      subrahmanya: "Brother Subrahmanya",
      mushika: "Mushika (Devoted Companion)",
      chandra: "Chandra (The Moon)",
      devotee: "Pilgrim Devotee",
      sage: "Venerable Sage",
      impostor: "Shifty Stranger"
    };

    if (this.dialogueSpeakerName) {
      this.dialogueSpeakerName.innerText = names[speaker] || speaker;
    }

    if (this.dialogueText) {
      this.dialogueText.innerText = text;
    }

    if (this.dialogueAvatarCanvas) {
      Sprites.drawAvatar(this.dialogueAvatarCanvas, speaker);
    }

    this.onDialogueComplete = onComplete;
  }

  hideDialogue() {
    this.dialogueModal.classList.add("hidden");
    this.dialogueModal.setAttribute("aria-hidden", "true");
    this.onDialogueComplete = null;
  }

  openPuzzle({ title, instruction, render, onOpen }) {
    if (this.puzzleTitle) this.puzzleTitle.innerText = title;
    if (this.puzzleInstruction) this.puzzleInstruction.innerText = instruction;
    if (this.puzzleContent) this.puzzleContent.innerHTML = render();

    this.puzzleModal.classList.remove("hidden");
    this.puzzleModal.setAttribute("aria-hidden", "false");

    if (onOpen) onOpen();
  }

  closePuzzle() {
    this.puzzleModal.classList.add("hidden");
    this.puzzleModal.setAttribute("aria-hidden", "true");
    if (this.puzzleContent) this.puzzleContent.innerHTML = "";
  }

  isModalOpen() {
    return !this.dialogueModal.classList.contains("hidden") ||
           !this.puzzleModal.classList.contains("hidden") ||
           !this.pauseModal.classList.contains("hidden") ||
           !this.victoryModal.classList.contains("hidden") ||
           !this.worldCompleteModal.classList.contains("hidden");
  }

  showVictoryModal(data) {
    this.gameState = "LEVEL_COMPLETE";

    const vTitle = document.getElementById("victory-title");
    const vSub = document.getElementById("victory-subtitle");
    const vScore = document.getElementById("v-stat-score");
    const vTime = document.getElementById("v-stat-time");
    const vModaks = document.getElementById("v-stat-modaks");
    const vAcc = document.getElementById("v-stat-accuracy");
    const vNextBtn = document.getElementById("btn-victory-next");

    if (vTitle) vTitle.innerText = `Level ${data.number} Complete!`;
    if (vSub) vSub.innerText = data.title;
    if (vScore) vScore.innerText = data.score;
    if (vTime) vTime.innerText = data.time;
    if (vModaks) vModaks.innerText = data.modaks;
    if (vAcc) vAcc.innerText = data.accuracy;

    // Check if next level is in another world or completed
    if (vNextBtn) {
      if (data.number === 6) {
        // At level 6, do not show Next Level button, next should go to World Map or World Complete
        vNextBtn.style.display = "none";
      } else {
        vNextBtn.style.display = "inline-flex";
      }
    }

    // Update stars
    const starsBox = document.getElementById("victory-stars-box");
    if (starsBox) {
      let starsHtml = "";
      for (let i = 0; i < 3; i++) {
        starsHtml += `<span class="star-item ${i < data.stars ? 'gold' : ''}">★</span>`;
      }
      starsBox.innerHTML = starsHtml;
    }

    this.victoryModal.classList.remove("hidden");
    this.victoryModal.setAttribute("aria-hidden", "false");
  }

  showWorldCompleteModal(data) {
    this.gameState = "WORLD_COMPLETE";

    const banner = document.getElementById("world-comp-banner");
    const quote = document.getElementById("world-comp-desc");
    const scoreEl = document.getElementById("wc-total-score");
    const timeEl = document.getElementById("wc-total-time");

    if (banner) banner.innerText = data.worldTitle;
    if (quote) quote.innerText = `"${data.quote}"`;
    if (scoreEl) scoreEl.innerText = data.totalScore;
    if (timeEl) timeEl.innerText = data.totalTime;

    this.worldCompleteModal.classList.remove("hidden");
    this.worldCompleteModal.setAttribute("aria-hidden", "false");
  }

  showFailureModal(reason, onRetry) {
    this.showDialogue("vinayaka", `${reason} Let us try again with peace and focus.`, onRetry);
  }

  updateHUD({ levelTitle, objective, score, modaks, flowers, hasMeter, guardianMeter }) {
    if (this.hudLevelTitle) this.hudLevelTitle.innerText = levelTitle;
    if (this.hudObjective) this.hudObjective.innerText = objective;
    if (this.hudScore) this.hudScore.innerText = score;
    if (this.hudModaks) this.hudModaks.innerText = modaks;
    if (this.hudFlowers) this.hudFlowers.innerText = flowers;

    if (this.guardianMeterBox) {
      if (hasMeter) {
        this.guardianMeterBox.classList.remove("hidden");
        if (this.meterFill) this.meterFill.style.width = `${guardianMeter}%`;
        if (this.meterVal) this.meterVal.innerText = `${Math.round(guardianMeter)}%`;
      } else {
        this.guardianMeterBox.classList.add("hidden");
      }
    }
  }

  updateHUDTimer(formattedTime) {
    if (this.hudTimer) this.hudTimer.innerText = formattedTime;
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    // Handle global pause trigger
    if (input.isPauseTriggered()) {
      if (this.gameState === "PLAYING" || this.gameState === "PAUSED") {
        this.togglePause();
      }
    }

    input.update();

    if (this.gameState === "PLAYING" && this.currentLevel) {
      this.currentLevel.update(dt, input);
      particles.update(dt);

      // Render Level
      this.ctx.clearRect(0, 0, this.virtualWidth, this.virtualHeight);
      this.currentLevel.render(this.ctx);
      particles.draw(this.ctx);
    } else if (this.gameState === "MENU" || this.gameState === "WORLD_SELECT") {
      // Gentle floating background petals on menu screen
      particles.update(dt);
      if (Math.random() < 0.05) {
        particles.spawnPetalShower(this.virtualWidth, 1);
      }
      this.ctx.clearRect(0, 0, this.virtualWidth, this.virtualHeight);
      this.renderMenuBackdrop();
      particles.draw(this.ctx);
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  renderMenuBackdrop() {
    // Serene Mount Kailash background behind main menu
    const sky = this.ctx.createLinearGradient(0, 0, 0, this.virtualHeight);
    sky.addColorStop(0, "#0c1527");
    sky.addColorStop(0.5, "#1f2a47");
    sky.addColorStop(1, "#0a0e1a");
    this.ctx.fillStyle = sky;
    this.ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);

    // Kailash sacred mountain silhouette
    this.ctx.fillStyle = "#1e2840";
    this.ctx.beginPath();
    this.ctx.moveTo(100, 480);
    this.ctx.lineTo(this.virtualWidth / 2, 140);
    this.ctx.lineTo(this.virtualWidth - 100, 480);
    this.ctx.closePath();
    this.ctx.fill();

    // Snow peak
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    this.ctx.beginPath();
    this.ctx.moveTo(this.virtualWidth / 2 - 90, 210);
    this.ctx.lineTo(this.virtualWidth / 2, 140);
    this.ctx.lineTo(this.virtualWidth / 2 + 90, 210);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

// Boot the game when window loads
window.addEventListener("DOMContentLoaded", () => {
  window.game = new GaneshGame();
});
