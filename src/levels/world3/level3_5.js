/**
 * GANESH – THE JOURNEY
 * World 3, Level 5: Prepare the Celebration
 * Sanctifying the home altar:
 * 1. Mango Leaf Toran & Banana Stems
 * 2. Flickering Brass Diyas
 * 3. Fresh Hibiscus & 21 Durva Blades
 * 4. Plate of 21 Sacred Modaks
 * 5. Fragrant Sandalwood Incense
 */

import { LevelBase } from "../levelBase.js";
import { Sprites } from "../../graphics/sprites.js";
import { sound } from "../../audio/soundManager.js";
import { particles } from "../../graphics/particles.js";
import { GAME_CONFIG } from "../../config.js";

export class Level3_5 extends LevelBase {
  constructor(config, game) {
    super(config, game);

    this.itemsPlaced = {
      toran: false,
      diyas: false,
      durva: false,
      modaks: false,
      incense: false
    };

    this.altarStations = [
      { id: "toran", name: "Mango Leaf Toran", x: 640, y: 160, icon: "🍃" },
      { id: "diyas", name: "Twin Brass Diyas", x: 440, y: 380, icon: "🪔" },
      { id: "durva", name: "21 Durva & Hibiscus Garland", x: 640, y: 340, icon: "🌺" },
      { id: "modaks", name: "Plate of 21 Modaks", x: 640, y: 440, icon: "🥟" },
      { id: "incense", name: "Fragrant Sandalwood Incense", x: 840, y: 380, icon: "💨" }
    ];
  }

  setupLevel() {
    this.itemsPlaced = { toran: false, diyas: false, durva: false, modaks: false, incense: false };
    this.player.x = 240;
    this.player.y = 520;

    this.altarStations.forEach(st => {
      this.interactables.push({
        x: st.x,
        y: st.y,
        interactionRadius: 75,
        promptText: `Place ${st.name}`,
        promptOffset: 45,
        onInteract: () => this.placeAltarItem(st),
        render: (ctx) => {
          const placed = this.itemsPlaced[st.id];
          ctx.save();
          ctx.fillStyle = placed ? "rgba(46, 204, 113, 0.25)" : "rgba(244, 196, 48, 0.25)";
          ctx.strokeStyle = placed ? "#2ecc71" : "#f4c430";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(st.x, st.y, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.font = "22px Nunito";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(st.icon, st.x, st.y);
          ctx.restore();
        }
      });
    });

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "The sacred murti is complete! Now we sanctify the festive altar with five traditional offerings before the divine invocation."
      }
    ]);
  }

  placeAltarItem(st) {
    if (this.itemsPlaced[st.id]) return;

    this.itemsPlaced[st.id] = true;
    sound.playTempleBell(523.25 + Object.values(this.itemsPlaced).filter(v => v).length * 60);
    particles.spawnSparkles(st.x, st.y, 20, "rgba(244, 196, 48,");
    this.addScore(200);

    const count = Object.values(this.itemsPlaced).filter(v => v).length;
    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: `Arranged ${st.name}! (${count}/5 offerings placed).`,
        onComplete: () => {
          if (count >= 5) {
            this.finishAltarSetup();
          }
        }
      }
    ]);
  }

  finishAltarSetup() {
    sound.playShankha();
    particles.spawnPetalShower(GAME_CONFIG.VIRTUAL_WIDTH, 40);

    this.queueDialogue([
      {
        speaker: "vinayaka",
        text: "The sanctum is filled with sacred fragrance, golden lamp glow, and pure devotion!"
      },
      {
        speaker: "vinayaka",
        text: "Step forward into the final ceremony: Completed Creation and Divine Darshan!",
        onComplete: () => {
          this.completeLevel(500);
        }
      }
    ]);
  }

  renderBackground(ctx) {
    // Sanctum altar room
    const sky = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.VIRTUAL_HEIGHT);
    sky.addColorStop(0, "#2c1527");
    sky.addColorStop(0.5, "#4d1d40");
    sky.addColorStop(1, "#1c0d19");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);

    // Altar Table
    ctx.fillStyle = "#3d1833";
    ctx.strokeStyle = "#f4c430";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(380, 260, 520, 160, 12);
    ctx.fill();
    ctx.stroke();

    // Finished Sculpture sitting on altar
    Sprites.drawVinayaka(ctx, 640, 310, 1.25, 1, false, 0);

    // Render placed Diyas if placed
    if (this.itemsPlaced.diyas) {
      Sprites.drawDiya(ctx, 440, 370, 1.3, true, this.elapsedTime);
      Sprites.drawDiya(ctx, 840, 370, 1.3, true, this.elapsedTime);
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

    Sprites.drawMushika(ctx, this.player.x - 30 * this.player.facing, this.player.y, 1.2, this.player.facing, this.player.isWalking, this.elapsedTime);
  }
}
