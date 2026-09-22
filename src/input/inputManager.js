/**
 * GANESH – THE JOURNEY
 * Input Manager: Multi-Device Input Orchestration
 * Handles Keyboard, Mouse clicks/drags, and On-Screen Touch D-Pad seamlessly.
 */

class InputManager {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this.isTouchDevice = false;

    // Movement vector: -1 to 1
    this.movement = { x: 0, y: 0 };

    // Mouse / Touch interaction pointer in virtual canvas coordinates
    this.pointer = {
      x: 0,
      y: 0,
      isDown: false,
      justClicked: false,
      targetObject: null
    };

    // Virtual D-pad state
    this.dpadState = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    // Interactivity flags
    this.interactRequested = false;
    this.pauseRequested = false;

    this.setupKeyboard();
    this.setupTouch();
    this.setupMouse();
  }

  setupKeyboard() {
    window.addEventListener("keydown", (e) => {
      // Prevent default page scroll on game controls
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }

      if (!this.keys[e.code]) {
        this.justPressed[e.code] = true;
      }
      this.keys[e.code] = true;

      if (e.code === "Escape") {
        this.pauseRequested = true;
      }

      if (e.code === "Space" || e.code === "KeyE" || e.code === "Enter") {
        this.interactRequested = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
      this.justPressed[e.code] = false;
    });
  }

  setupTouch() {
    // Detect touch capability
    const enableTouch = () => {
      this.isTouchDevice = true;
      const touchOverlay = document.getElementById("touch-controls");
      if (touchOverlay) {
        touchOverlay.classList.remove("hidden");
        touchOverlay.setAttribute("aria-hidden", "false");
      }
      window.removeEventListener("touchstart", enableTouch);
    };

    window.addEventListener("touchstart", enableTouch, { passive: true });
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      enableTouch();
    }

    // D-Pad buttons
    const dpadBtns = document.querySelectorAll(".dpad-btn");
    dpadBtns.forEach(btn => {
      const key = btn.getAttribute("data-key");
      const handlePress = (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.add("active");
        if (key === "ArrowUp") this.dpadState.up = true;
        if (key === "ArrowDown") this.dpadState.down = true;
        if (key === "ArrowLeft") this.dpadState.left = true;
        if (key === "ArrowRight") this.dpadState.right = true;
      };

      const handleRelease = (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.remove("active");
        if (key === "ArrowUp") this.dpadState.up = false;
        if (key === "ArrowDown") this.dpadState.down = false;
        if (key === "ArrowLeft") this.dpadState.left = false;
        if (key === "ArrowRight") this.dpadState.right = false;
      };

      btn.addEventListener("touchstart", handlePress, { passive: false });
      btn.addEventListener("touchend", handleRelease, { passive: false });
      btn.addEventListener("mousedown", handlePress);
      btn.addEventListener("mouseup", handleRelease);
      btn.addEventListener("mouseleave", handleRelease);
    });

    // Touch Action (Interact) Button
    const interactBtn = document.getElementById("touch-btn-interact");
    if (interactBtn) {
      const triggerInteract = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.interactRequested = true;
      };
      interactBtn.addEventListener("touchstart", triggerInteract, { passive: false });
      interactBtn.addEventListener("mousedown", triggerInteract);
    }
  }

  setupMouse() {
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;

    const updatePointerPos = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = 1280 / rect.width;
      const scaleY = 720 / rect.height;

      this.pointer.x = (clientX - rect.left) * scaleX;
      this.pointer.y = (clientY - rect.top) * scaleY;
    };

    canvas.addEventListener("mousemove", (e) => {
      updatePointerPos(e.clientX, e.clientY);
    });

    canvas.addEventListener("mousedown", (e) => {
      updatePointerPos(e.clientX, e.clientY);
      this.pointer.isDown = true;
      this.pointer.justClicked = true;
    });

    canvas.addEventListener("mouseup", () => {
      this.pointer.isDown = false;
    });

    // Mobile tap on canvas
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
        this.pointer.isDown = true;
        this.pointer.justClicked = true;
      }
    }, { passive: true });

    canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    canvas.addEventListener("touchend", () => {
      this.pointer.isDown = false;
    });
  }

  /**
   * Update and compute combined movement vector (-1 to 1) from all devices
   */
  update() {
    let dx = 0;
    let dy = 0;

    // Keyboard
    if (this.keys["ArrowLeft"] || this.keys["KeyA"] || this.dpadState.left) dx -= 1;
    if (this.keys["ArrowRight"] || this.keys["KeyD"] || this.dpadState.right) dx += 1;
    if (this.keys["ArrowUp"] || this.keys["KeyW"] || this.dpadState.up) dy -= 1;
    if (this.keys["ArrowDown"] || this.keys["KeyS"] || this.dpadState.down) dy += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const invLen = 1 / Math.SQRT2;
      dx *= invLen;
      dy *= invLen;
    }

    this.movement.x = dx;
    this.movement.y = dy;
  }

  getMovementVector() {
    return this.movement;
  }

  isInteractTriggered() {
    const val = this.interactRequested;
    this.interactRequested = false;
    return val;
  }

  isPauseTriggered() {
    const val = this.pauseRequested;
    this.pauseRequested = false;
    return val;
  }

  isClickTriggered() {
    const val = this.pointer.justClicked;
    this.pointer.justClicked = false;
    return val;
  }

  getPointer() {
    return this.pointer;
  }

  reset() {
    this.keys = {};
    this.justPressed = {};
    this.interactRequested = false;
    this.pauseRequested = false;
    this.pointer.justClicked = false;
    this.pointer.isDown = false;
    this.dpadState = { up: false, down: false, left: false, right: false };
    this.movement = { x: 0, y: 0 };
  }
}

export const input = new InputManager();
