/**
 * GANESH – THE JOURNEY
 * World 1, Level 5: The Moon's Curse
 * A sacred lesson on humility: moonlit night journey, gentle modak stumble mishap,
 * Chandra's haughty mockery, the dimming of pride, and compassionate redemption.
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level1_5 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.phase = "journey"; // journey -> stumble -> gather -> chandra_laugh -> curse -> redemption -> complete
    this.targetModaks = 6;
    this.moonBrightness = 1.0;
    this.isMoonDimmed = false;
  }

  setupLevel() {
    this.phase = "journey";
    this.modaksCollected = 0;
    this.moonBrightness = 1.0;
    this.isMoonDimmed = false;

    // Start player on the left side of the moonlit forest path
    this.player.x = 180;
    this.player.y = 480;

    // Gentle pebble interactable that triggers the story stumble
    this.pebble = { x: 480, y: 490 };
    this.interactables.push({
      x: this.pebble.x,
      y: this.pebble.y,
      interactionRadius: 80,
      promptText: "Walk along moonlit trail",
      promptOffset: 35,
      onInteract: () => this.triggerStumbleMishap(),
      render: (ctx) => {
        ctx.fillStyle = "#7f8c8d";
        ctx.beginPath();
        ctx.ellipse(this.pebble.x, this.pebble.y, 14, 8, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "The night is quiet and serene under the silver glow of the full moon. Mushika and I carry sacred modaks on our homeward journey."
      }
    ]);
  }

  triggerStumbleMishap() {
    if (this.phase !== "journey") return;

    this.phase = "stumble";
    sound.playMistake();

    // Scatter 6 modaks along the path
    const scatterCoords = [
      { x: 380, y: 420 }, { x: 520, y: 380 }, { x: 620, y: 520 },
      { x: 740, y: 440 }, { x: 860, y: 500 }, { x: 960, y: 400 }
    ];

    scatterCoords.forEach(pos => {
      this.collectibles.push({
        x: pos.x,
        y: pos.y,
        radius: 18,
        type: "modak",
        render: (ctx) => Sprites.drawModak(ctx, pos.x, pos.y, 0.9, Math.sin(this.elapsedTime * 4) * 2)
      });
    });

    this.queueDialogue([
      {
        speaker: "mushika",
        text: "Oops! Squeak! I stumbled over a smooth pebble in the silver grass, and the sweet modaks tumbled away!"
      },
      {
        speaker: "vinayaka",
        text: "Do not worry, dear Mushika. Mishaps happen to everyone. Let us gather the six scattered modaks together.",
        onComplete: () => {
          this.phase = "gather";
          this.objective = `Gather the 6 scattered modaks (${this.modaksCollected}/${this.targetModaks})`;
          this.updateHUD();
        }
      }
    ]);
  }

  updateLevel(dt, input) {
    if (this.phase === "gather") {
      if (this.modaksCollected >= this.targetModaks) {
        this.triggerChandraEncounter();
      }
    } else if (this.phase === "curse") {
      // Gradually dim the moon
      if (this.moonBrightness > 0.15) {
        this.moonBrightness -= 0.6 * dt;
      }
    } else if (this.phase === "redemption") {
      // Soft gentle silver glow returns
      if (this.moonBrightness < 0.75) {
        this.moonBrightness += 0.4 * dt;
      }
    }
  }

  triggerChandraEncounter() {
    this.phase = "chandra_laugh";
    this.objective = "Confront Chandra regarding pride and humility";
    this.updateHUD();

    sound.playTempleBell(440);

    this.queueDialogue([
      {
        speaker: "chandra",
        text: "Hahaha! Look at the little prince and his tiny mouse tripping over a harmless stone! How comical they look while I shine in spotless perfection!"
      },
      {
        speaker: "vinayaka",
        text: "Chandra, beauty and radiance are gifts of the Divine to illuminate the dark, not weapons to mock others in their moments of clumsiness."
      },
      {
        speaker: "vinayaka",
        text: "He who takes pride in superficial glory and laughs at another's honest misstep must learn that all radiant light can vanish!",
        onComplete: () => this.triggerCurseDimming()
      }
    ]);
  }

  triggerCurseDimming() {
    this.phase = "curse";
    sound.playShankha();

    this.queueDialogue([
      {
        speaker: "chandra",
        text: "Oh no! My silver glow... it is fading away! Darkness envelops the celestial skies! What have I done in my foolish arrogance?"
      },
      {
        speaker: "chandra",
        text: "Lord Vinayaka, forgive me! I was blinded by vain pride. Please restore light to the world!",
        onComplete: () => this.triggerPeacefulResolution()
      }
    ]);
  }

  triggerPeacefulResolution() {
    this.phase = "redemption";
    sound.playPuzzleSuccess();
    particles.spawnPetalShower(GAME_CONFIG.VIRTUAL_WIDTH, 30);

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "True greatness lies in humility, compassion, and uplifting others. Since you have recognized your error with a sincere heart, you are forgiven."
      },
      {
        speaker: "vinayaka",
        text: "Henceforth, you shall wax and wane through phases, reminding all beings in the cosmos that pride wanes and humility always restores radiant grace."
      },
      {
        speaker: "chandra",
        text: "I bow to your supreme wisdom and mercy, Lord Ganesha! Blessed are those who walk with humility."
      },
      {
        speaker: "vinayaka",
        text: "Come, Mushika, let us continue our peaceful journey under the gentle starlight.",
        onComplete: () => {
          this.completeLevel(500);
        }
      }
    ]);
  }

  renderBackground(ctx) {
    // Moonlit night sky with variable brightness
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    const alpha = this.moonBrightness;
    sky.addColorStop(0, `rgba(11, 17, 32, 1)`);
    sky.addColorStop(0.5, `rgba(20, 32, 60, ${alpha})`);
    sky.addColorStop(1, `rgba(10, 14, 24, 1)`);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Chandra (The Moon) in the Upper Right Sky
    const moonX = 1050;
    const moonY = 140;

    ctx.save();
    // Moon Aura
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 90);
    moonGlow.addColorStop(0, `rgba(255, 255, 255, ${0.7 * alpha})`);
    moonGlow.addColorStop(0.5, `rgba(214, 234, 248, ${0.3 * alpha})`);
    moonGlow.addColorStop(1, "rgba(214, 234, 248, 0)");
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 90, 0, Math.PI * 2);
    ctx.fill();

    // Silver Full Moon Disc
    ctx.fillStyle = `rgba(244, 246, 247, ${alpha})`;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 34, 0, Math.PI * 2);
    ctx.fill();

    // Subtle lunar craters
    ctx.fillStyle = `rgba(189, 195, 199, ${0.4 * alpha})`;
    ctx.beginPath();
    ctx.arc(moonX - 8, moonY - 6, 6, 0, Math.PI * 2);
    ctx.arc(moonX + 12, moonY + 4, 8, 0, Math.PI * 2);
    ctx.arc(moonX + 4, moonY + 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Forest path ground
    ctx.fillStyle = "#1c2833";
    ctx.fillRect(0, 360, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT - 360);

    // Silver moonlit grass highlight
    ctx.fillStyle = `rgba(93, 109, 126, ${0.3 * alpha})`;
    ctx.fillRect(0, 420, GAME_CONFIG.VIRTUAL_WIDTH, 140);
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

    // Mushika
    Sprites.drawMushika(ctx, this.player.x - 32 * this.player.facing, this.player.y, 1.2, this.player.facing, this.player.isWalking, this.elapsedTime);
  }
}
