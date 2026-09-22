/**
 * GANESH – THE JOURNEY
 * Save & Progress Manager
 * Handles local storage with robust in-memory fallback for private/sandboxed browsers.
 */

const STORAGE_KEY = "ganesh_journey_save_v1";

class SaveManager {
  constructor() {
    this.memoryData = this.getDefaults();
    this.hasLocalStorage = this.checkStorage();
    this.data = this.load();
  }

  getDefaults() {
    return {
      unlockedLevels: [1], // Level 1 starts unlocked
      completedLevels: {}, // { levelId: { score, stars, time, completedAt } }
      settings: {
        musicVolume: 0.75,
        sfxVolume: 0.85,
        isMuted: false,
        reducedFx: false
      },
      lastPlayedLevel: 1
    };
  }

  checkStorage() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (_) {
      return false;
    }
  }

  load() {
    if (!this.hasLocalStorage) {
      return this.memoryData;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.getDefaults();
      const parsed = JSON.parse(raw);
      return {
        ...this.getDefaults(),
        ...parsed,
        settings: { ...this.getDefaults().settings, ...(parsed.settings || {}) }
      };
    } catch (e) {
      console.warn("Error parsing save data, using defaults:", e);
      return this.getDefaults();
    }
  }

  save() {
    if (!this.hasLocalStorage) {
      this.memoryData = { ...this.data };
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Unable to save to localStorage, saving to memory:", e);
      this.memoryData = { ...this.data };
    }
  }

  isLevelUnlocked(levelId) {
    // Level 1, 7 (World 2 start), 13 (World 3 start) or completed prior
    if (levelId === 1 || levelId === 7 || levelId === 13) return true;
    // Or previous level completed
    const prevId = levelId - 1;
    return !!this.data.completedLevels[prevId] || this.data.unlockedLevels.includes(levelId);
  }

  isLevelCompleted(levelId) {
    return !!this.data.completedLevels[levelId];
  }

  getLevelData(levelId) {
    return this.data.completedLevels[levelId] || null;
  }

  saveLevelResult(levelId, score, stars = 3, timeSeconds = 0) {
    const existing = this.data.completedLevels[levelId];
    const bestScore = existing ? Math.max(existing.score, score) : score;
    const bestStars = existing ? Math.max(existing.stars, stars) : stars;

    this.data.completedLevels[levelId] = {
      score: bestScore,
      stars: bestStars,
      time: timeSeconds,
      completedAt: Date.now()
    };

    // Unlock next level up to 18 (strictly do not unlock 19)
    const nextId = levelId + 1;
    if (nextId <= 18 && !this.data.unlockedLevels.includes(nextId)) {
      this.data.unlockedLevels.push(nextId);
    }

    this.data.lastPlayedLevel = levelId;
    this.save();
  }

  getTotalScore() {
    return Object.values(this.data.completedLevels).reduce((acc, lvl) => acc + (lvl.score || 0), 0);
  }

  getWorldProgress(worldId) {
    // World 1: levels 1-6
    // World 2: levels 7-12
    // World 3: levels 13-18
    const start = (worldId - 1) * 6 + 1;
    const end = start + 5;
    let completedCount = 0;
    let worldScore = 0;

    for (let id = start; id <= end; id++) {
      if (this.data.completedLevels[id]) {
        completedCount++;
        worldScore += this.data.completedLevels[id].score || 0;
      }
    }

    return { completedCount, worldScore, total: 6, isComplete: completedCount === 6 };
  }

  getSettings() {
    return this.data.settings;
  }

  saveSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
  }

  resetAll() {
    this.data = this.getDefaults();
    this.save();
  }
}

export const saveManager = new SaveManager();
