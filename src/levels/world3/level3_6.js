/**
 * GANESH – THE JOURNEY
 * World 3, Level 6: Completed Creation
 * Grand Finale of Sculpture World and the entire 18-Level Journey:
 * Divine Darshan of the handcrafted eco-friendly murti, Aarti ceremony,
 * temple bell chime, flower shower, and SCULPTURE WORLD COMPLETE — 6/6 LEVELS!
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";
import { saveManager } from "../../storage/saveManager.js";

export class Level3_6 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.phase = "ceremony"; // ceremony -> aarti -> blessing -> world_complete
    this.aartiCircles = 0;
    this.targetAartiCircles = 3;
  }

  setupLevel() {
    this.phase = "ceremony";
    this.aartiCircles = 0;
    this.player.x = 260;
    this.player.y = 520;

    // Altar Centerpiece
    this.altar = { x: 640, y: 380 };

    // Interactable: Aarti Lamp
    this.interactables.push({
      x: this.altar.x,
      y: this.altar.y,
      interactionRadius: 90,
      promptText: "Perform Divine Aarti & Flower Shower",
      promptOffset: 65,
      onInteract: () => this.performAarti(),
      render: (ctx) => {
        // Draw illuminated altar
        ctx.save();
        ctx.fillStyle = "rgba(244, 196, 48, 0.2)";
        ctx.strokeStyle = "#f4c430";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.altar.x, this.altar.y, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = "28px Nunito";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🪔", this.altar.x, this.altar.y);
        ctx.restore();
      }
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "Behold! Your eco-friendly Shaadu clay Ganesha murti sits in peaceful majesty upon the altar."
      },
      {
        speaker: "vinayaka",
        text: "Approach the altar and wave the sacred Aarti lamp to receive divine blessings of wisdom, health, and peace."
      }
    ]);
  }

  performAarti() {
    if (this.phase !== "ceremony") return;
    this.phase = "aarti";

    sound.playShankha();
    sound.playTempleBell(523.25);
    particles.spawnPetalShower(GAME_CONFIG.VIRTUAL_WIDTH, 50);

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "॥ जय गणेश, जय गणेश, जय गणेश देवा । माता जाकी पार्वती, पिता महादेवा ॥"
      },
      {
        speaker: "vinayaka",
        text: "The sacred camphor flame warms the sanctum! With bells ringing and flowers showering, the creation is consecrated."
      },
      {
        speaker: "parvati",
        text: "Beloved seeker, through clay, history, and mythology, you have walked with pure devotion and respect."
      },
      {
        speaker: "shiva",
        text: "May Lord Ganesha's grace remove all obstacles from your life journey and illuminate your path with eternal wisdom!",
        onComplete: () => this.completeWorld3()
      }
    ]);
  }

  completeWorld3() {
    this.phase = "world_complete";
    this.isCompleted = true;
    this.addScore(500);

    saveManager.saveLevelResult(this.id, this.score, 3, Math.floor(this.elapsedTime));
    sound.playWorldComplete();

    const worldProg = saveManager.getWorldProgress(3);

    this.game.showWorldCompleteModal({
      worldId: 3,
      worldTitle: "SCULPTURE WORLD COMPLETE — 6/6 LEVELS",
      quote: "From sacred earth sculpted with love, to divine blessings bestowed on all beings.",
      levelsDone: "6 / 6",
      totalScore: worldProg.worldScore,
      totalTime: this.formatTime(this.elapsedTime)
    });
  }

  renderBackground(ctx) {
    // Divine Glowing Sanctum
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#2c1527");
    sky.addColorStop(0.5, "#4d1d40");
    sky.addColorStop(1, "#1c0d19");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Divine Radiance behind the Murti
    const aura = ctx.createRadialGradient(640, 290, 20, 640, 290, 160);
    aura.addColorStop(0, "rgba(255, 235, 130, 0.6)");
    aura.addColorStop(0.6, "rgba(244, 196, 48, 0.25)");
    aura.addColorStop(1, "rgba(244, 196, 48, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(640, 290, 160, 0, Math.PI * 2);
    ctx.fill();

    // Sacred Altar Table
    ctx.fillStyle = "#3d1833";
    ctx.strokeStyle = "#f4c430";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(380, 240, 520, 160, 12);
    ctx.fill();
    ctx.stroke();

    // Handcrafted Murti in center of Altar
    Sprites.drawVinayaka(ctx, 640, 290, 1.45, 1, false, 0);

    // Flanking Lamps
    Sprites.drawDiya(ctx, 430, 340, 1.4, true, this.elapsedTime);
    Sprites.drawDiya(ctx, 850, 340, 1.4, true, this.elapsedTime);

    // Plate of Modaks
    Sprites.drawModak(ctx, 640, 365, 1.3, 0);

    // Floor
    ctx.fillStyle = "#271021";
    ctx.fillRect(0, 420, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT - 420);
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
