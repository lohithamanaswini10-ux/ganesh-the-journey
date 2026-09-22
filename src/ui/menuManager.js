/**
 * GANESH – THE JOURNEY
 * Menu Manager: Navigation, World Map, Level Selection & Settings UI
 */

import { WORLDS_DATA } from "../config.js";
import { saveManager } from "../storage/saveManager.js";
import { sound } from "../audio/soundManager.js";
import { particles } from "../graphics/particles.js";

export class MenuManager {
  constructor(game) {
    this.game = game;

    this.currentWorldId = 1;
    this.selectedLevelId = 1;

    // DOM Screen Elements
    this.screenMainMenu = document.getElementById("screen-main-menu");
    this.screenWorlds = document.getElementById("screen-worlds");
    this.screenHowTo = document.getElementById("screen-howto");
    this.screenSettings = document.getElementById("screen-settings");
    this.screenCredits = document.getElementById("screen-credits");

    // Modal Elements
    this.modalPause = document.getElementById("modal-pause");
    this.modalVictory = document.getElementById("modal-victory");
    this.modalWorldComplete = document.getElementById("modal-world-complete");
    this.modalDialogue = document.getElementById("modal-dialogue");
    this.modalPuzzle = document.getElementById("modal-puzzle");

    // HUD
    this.gameHud = document.getElementById("game-hud");

    this.initEventListeners();
  }

  initEventListeners() {
    // 1. Main Menu Buttons
    this.bindClick("btn-menu-play", () => {
      sound.playTempleBell(523.25);
      this.showWorldSelect();
    });

    this.bindClick("btn-menu-worlds", () => {
      sound.playClick();
      this.showWorldSelect();
    });

    this.bindClick("btn-menu-howto", () => {
      sound.playClick();
      this.showScreen(this.screenHowTo);
    });

    this.bindClick("btn-menu-settings", () => {
      sound.playClick();
      this.syncSettingsUI();
      this.showScreen(this.screenSettings);
    });

    this.bindClick("btn-menu-credits", () => {
      sound.playClick();
      this.showScreen(this.screenCredits);
    });

    // 2. Back Buttons
    this.bindClick("btn-worlds-back", () => {
      sound.playClick();
      this.showMainMenu();
    });

    this.bindClick("btn-howto-back", () => {
      sound.playClick();
      this.showMainMenu();
    });

    this.bindClick("btn-settings-back", () => {
      sound.playClick();
      this.showMainMenu();
    });

    this.bindClick("btn-credits-back", () => {
      sound.playClick();
      this.showMainMenu();
    });

    // 3. World Tabs
    const tabs = document.querySelectorAll(".world-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        sound.playClick();
        tabs.forEach(t => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        this.currentWorldId = parseInt(tab.dataset.world, 10);
        this.renderLevelsForWorld(this.currentWorldId);
      });
    });

    // 4. Begin Journey Button
    this.bindClick("btn-begin-journey", () => {
      sound.playShankha();
      this.game.startLevel(this.selectedLevelId);
    });

    // 5. Settings Inputs
    const sliderMusic = document.getElementById("slider-music");
    const valMusic = document.getElementById("val-music");
    if (sliderMusic) {
      sliderMusic.addEventListener("input", (e) => {
        const val = e.target.value / 100;
        if (valMusic) valMusic.innerText = `${e.target.value}%`;
        sound.setMusicVolume(val);
        saveManager.saveSettings({ musicVolume: val });
      });
    }

    const sliderSfx = document.getElementById("slider-sfx");
    const valSfx = document.getElementById("val-sfx");
    if (sliderSfx) {
      sliderSfx.addEventListener("input", (e) => {
        const val = e.target.value / 100;
        if (valSfx) valSfx.innerText = `${e.target.value}%`;
        sound.setSfxVolume(val);
        saveManager.saveSettings({ sfxVolume: val });
      });
    }

    const chkMute = document.getElementById("chk-mute");
    if (chkMute) {
      chkMute.addEventListener("change", (e) => {
        sound.setMute(e.target.checked);
        saveManager.saveSettings({ isMuted: e.target.checked });
      });
    }

    const chkReducedFx = document.getElementById("chk-reduced-fx");
    if (chkReducedFx) {
      chkReducedFx.addEventListener("change", (e) => {
        particles.setReducedEffects(e.target.checked);
        saveManager.saveSettings({ reducedFx: e.target.checked });
      });
    }

    const btnResetSave = document.getElementById("btn-reset-save");
    if (btnResetSave) {
      btnResetSave.addEventListener("click", () => {
        if (confirm("Reset all saved progress and high scores?")) {
          saveManager.resetAll();
          this.syncSettingsUI();
          this.updateWorldProgressIndicators();
          alert("All progress has been reset.");
        }
      });
    }

    // 6. Pause Modal Buttons
    this.bindClick("btn-hud-pause", () => this.game.togglePause());
    this.bindClick("btn-pause-resume", () => this.game.togglePause());
    this.bindClick("btn-pause-restart", () => this.game.restartCurrentLevel());
    this.bindClick("btn-pause-howto", () => {
      this.game.togglePause();
      this.showScreen(this.screenHowTo);
    });
    this.bindClick("btn-pause-worlds", () => {
      this.game.togglePause();
      this.showWorldSelect();
    });
    this.bindClick("btn-pause-menu", () => {
      this.game.togglePause();
      this.showMainMenu();
    });

    // 7. Victory Modal Buttons
    this.bindClick("btn-victory-replay", () => {
      this.modalVictory.classList.add("hidden");
      this.game.restartCurrentLevel();
    });

    this.bindClick("btn-victory-next", () => {
      this.modalVictory.classList.add("hidden");
      const nextId = this.selectedLevelId + 1;
      if (nextId <= 18) {
        this.game.startLevel(nextId);
      } else {
        this.showWorldSelect();
      }
    });

    this.bindClick("btn-victory-worlds", () => {
      this.modalVictory.classList.add("hidden");
      this.showWorldSelect();
    });

    this.bindClick("btn-victory-menu", () => {
      this.modalVictory.classList.add("hidden");
      this.showMainMenu();
    });

    // 8. World Complete Modal Buttons
    this.bindClick("btn-world-comp-replay", () => {
      this.modalWorldComplete.classList.add("hidden");
      this.game.restartCurrentLevel();
    });

    this.bindClick("btn-world-comp-worlds", () => {
      this.modalWorldComplete.classList.add("hidden");
      // Advance to next world tab
      const nextWorld = Math.min(3, this.currentWorldId + 1);
      this.showWorldSelect(nextWorld);
    });

    this.bindClick("btn-world-comp-menu", () => {
      this.modalWorldComplete.classList.add("hidden");
      this.showMainMenu();
    });
  }

  bindClick(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        callback();
      });
    }
  }

  showScreen(targetScreen) {
    // Hide all full-screen overlays
    const screens = [
      this.screenMainMenu,
      this.screenWorlds,
      this.screenHowTo,
      this.screenSettings,
      this.screenCredits
    ];
    screens.forEach(s => {
      if (s) s.classList.add("hidden");
    });

    if (targetScreen) {
      targetScreen.classList.remove("hidden");
    }

    // Hide in-game HUD when in menus
    if (this.gameHud) this.gameHud.classList.add("hidden");
  }

  showMainMenu() {
    this.showScreen(this.screenMainMenu);
    sound.startAmbientMusic("kailash");
  }

  showWorldSelect(preferredWorldId = null) {
    if (preferredWorldId) this.currentWorldId = preferredWorldId;
    this.showScreen(this.screenWorlds);

    // Update total stars and progress
    const totalScoreEl = document.getElementById("worlds-total-score");
    if (totalScoreEl) totalScoreEl.innerText = saveManager.getTotalScore();

    this.updateWorldProgressIndicators();

    // Select active tab
    const tabs = document.querySelectorAll(".world-tab");
    tabs.forEach(t => {
      const isTarget = parseInt(t.dataset.world, 10) === this.currentWorldId;
      t.classList.toggle("active", isTarget);
      t.setAttribute("aria-selected", isTarget ? "true" : "false");
    });

    this.renderLevelsForWorld(this.currentWorldId);
  }

  updateWorldProgressIndicators() {
    for (let w = 1; w <= 3; w++) {
      const prog = saveManager.getWorldProgress(w);
      const el = document.getElementById(`tab-prog-${w}`);
      if (el) {
        el.innerText = `${prog.completedCount}/6`;
        if (prog.isComplete) el.style.color = "#4caf50";
        else el.style.color = "";
      }
    }
  }

  renderLevelsForWorld(worldId) {
    const worldData = WORLDS_DATA.find(w => w.id === worldId);
    if (!worldData) return;

    // Update World Intro Card
    const titleEl = document.getElementById("world-card-title");
    const descEl = document.getElementById("world-card-desc");
    if (titleEl) titleEl.innerText = worldData.title;
    if (descEl) descEl.innerText = worldData.description;

    // Render 6 Level Cards
    const container = document.getElementById("levels-container");
    if (!container) return;
    container.innerHTML = "";

    worldData.levels.forEach(lvl => {
      const isCompleted = saveManager.isLevelCompleted(lvl.id);
      const isUnlocked = saveManager.isLevelUnlocked(lvl.id);
      const lvlData = saveManager.getLevelData(lvl.id);
      const isSelected = lvl.id === this.selectedLevelId;

      const card = document.createElement("div");
      card.className = `level-card ${isCompleted ? 'completed' : ''} ${isSelected ? 'selected' : ''}`;
      card.dataset.id = lvl.id;

      let starsHtml = "";
      if (isCompleted && lvlData) {
        for (let s = 0; s < 3; s++) {
          starsHtml += s < lvlData.stars ? "★" : "☆";
        }
      }

      card.innerHTML = `
        <div class="card-top">
          <span class="card-num">Level ${lvl.number}</span>
          <span class="card-stars">${starsHtml}</span>
        </div>
        <h4 class="card-title">${lvl.title}</h4>
        <p class="card-desc">${lvl.description}</p>
        ${lvlData ? `<span class="card-best-score">Best Score: ${lvlData.score}</span>` : ''}
      `;

      card.addEventListener("click", () => {
        sound.playClick();
        document.querySelectorAll(".level-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        this.selectLevel(lvl);
      });

      container.appendChild(card);
    });

    // Default select first level of this world if current selected not in this world
    const currentLvlInWorld = worldData.levels.find(l => l.id === this.selectedLevelId);
    if (!currentLvlInWorld) {
      this.selectLevel(worldData.levels[0]);
    } else {
      this.selectLevel(currentLvlInWorld);
    }
  }

  selectLevel(lvl) {
    this.selectedLevelId = lvl.id;

    const numEl = document.getElementById("selected-level-number");
    const nameEl = document.getElementById("selected-level-name");
    const descEl = document.getElementById("selected-level-desc");

    if (numEl) numEl.innerText = `World ${lvl.worldId} • Level ${lvl.number}`;
    if (nameEl) nameEl.innerText = lvl.title;
    if (descEl) descEl.innerText = lvl.description;

    // Update active highlight in DOM
    document.querySelectorAll(".level-card").forEach(card => {
      card.classList.toggle("selected", parseInt(card.dataset.id, 10) === lvl.id);
    });
  }

  syncSettingsUI() {
    const s = saveManager.getSettings();

    const sliderMusic = document.getElementById("slider-music");
    const valMusic = document.getElementById("val-music");
    if (sliderMusic) sliderMusic.value = Math.round(s.musicVolume * 100);
    if (valMusic) valMusic.innerText = `${Math.round(s.musicVolume * 100)}%`;

    const sliderSfx = document.getElementById("slider-sfx");
    const valSfx = document.getElementById("val-sfx");
    if (sliderSfx) sliderSfx.value = Math.round(s.sfxVolume * 100);
    if (valSfx) valSfx.innerText = `${Math.round(s.sfxVolume * 100)}%`;

    const chkMute = document.getElementById("chk-mute");
    if (chkMute) chkMute.checked = s.isMuted;

    const chkReducedFx = document.getElementById("chk-reduced-fx");
    if (chkReducedFx) chkReducedFx.checked = s.reducedFx;
  }
}
