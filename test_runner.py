"""
GANESH – THE JOURNEY: Automated QA & Integrity Test Suite
Verifies all 3 Worlds, 18 Levels, Assets, Config, HTML/CSS, and Web Server Functionality.
"""

import os
import sys
import re
import http.server
import socketserver
import threading
import urllib.request
import time

def print_header(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def test_file_existence():
    print_header("1. Testing File & Module Integrity")
    base_dir = os.path.dirname(os.path.abspath(__file__))

    required_files = [
        "index.html",
        "style.css",
        "README.md",
        "DEPLOYMENT.md",
        ".nojekyll",
        ".gitignore",
        "src/main.js",
        "src/config.js",
        "src/audio/soundManager.js",
        "src/storage/saveManager.js",
        "src/input/inputManager.js",
        "src/graphics/sprites.js",
        "src/graphics/particles.js",
        "src/ui/menuManager.js",
        "src/levels/levelBase.js",
        # World 1 (Mythology)
        "src/levels/world1/level1_1.js",
        "src/levels/world1/level1_2.js",
        "src/levels/world1/level1_3.js",
        "src/levels/world1/level1_4.js",
        "src/levels/world1/level1_5.js",
        "src/levels/world1/level1_6.js",
        # World 2 (History)
        "src/levels/world2/level2_1.js",
        "src/levels/world2/level2_2.js",
        "src/levels/world2/level2_3.js",
        "src/levels/world2/level2_4.js",
        "src/levels/world2/level2_5.js",
        "src/levels/world2/level2_6.js",
        # World 3 (Sculpture)
        "src/levels/world3/level3_1.js",
        "src/levels/world3/level3_2.js",
        "src/levels/world3/level3_3.js",
        "src/levels/world3/level3_4.js",
        "src/levels/world3/level3_5.js",
        "src/levels/world3/level3_6.js",
    ]

    all_exist = True
    for rel_path in required_files:
        full_path = os.path.join(base_dir, rel_path)
        if os.path.exists(full_path):
            size = os.path.getsize(full_path)
            print(f"  [PASS] {rel_path} ({size} bytes)")
        else:
            print(f"  [FAIL] Missing: {rel_path}")
            all_exist = False

    return all_exist

def test_world_and_level_bounds():
    print_header("2. Verifying 3 Worlds and Strict 18-Level Bounds")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(base_dir, "src", "config.js")

    with open(config_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Verify MAX_WORLDS = 3, LEVELS_PER_WORLD = 6, TOTAL_LEVELS = 18
    assert "MAX_WORLDS: 3" in content, "MAX_WORLDS must be 3"
    assert "LEVELS_PER_WORLD: 6" in content, "LEVELS_PER_WORLD must be 6"
    assert "TOTAL_LEVELS: 18" in content, "TOTAL_LEVELS must be 18"
    print("  [PASS] Config constants confirmed: 3 Worlds, 6 Levels/World, 18 Total.")

    # Verify no level 7 in World 1
    assert "id: 7" in content
    # Ensure level 7 is in World 2, NOT World 1
    w1_match = re.search(r'key:\s*"mythology".*?levels:\s*\[(.*?)\]\s*\},', content, re.DOTALL)
    assert w1_match, "Could not extract World 1 levels"
    w1_content = w1_match.group(1)

    assert "number: 6" in w1_content, "Level 6 must be in World 1"
    assert "number: 7" not in w1_content, "Level 7 must NOT exist in World 1!"
    print("  [PASS] World 1 ends strictly at Level 6 (No Level 7 in World 1).")

    # Verify World 1 Completion Banner
    assert "MYTHOLOGY WORLD COMPLETE — 6/6 LEVELS" in content
    print("  [PASS] World 1 completion banner verified: 'MYTHOLOGY WORLD COMPLETE — 6/6 LEVELS'.")

    # Verify World 2 Completion Banner
    assert "HISTORY WORLD COMPLETE — 6/6 LEVELS" in content
    print("  [PASS] World 2 completion banner verified: 'HISTORY WORLD COMPLETE — 6/6 LEVELS'.")

    # Verify World 3 Completion Banner
    assert "SCULPTURE WORLD COMPLETE — 6/6 LEVELS" in content
    print("  [PASS] World 3 completion banner verified: 'SCULPTURE WORLD COMPLETE — 6/6 LEVELS'.")

    return True

def test_html_ui_components():
    print_header("3. Verifying HTML & UI Elements")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(base_dir, "index.html")

    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    elements = [
        ("Game Canvas", 'id="game-canvas"'),
        ("Game HUD", 'id="game-hud"'),
        ("Touch Controls", 'id="touch-controls"'),
        ("Touch D-Pad", 'id="touch-dpad"'),
        ("Touch Action Button", 'id="touch-btn-interact"'),
        ("Main Menu Screen", 'id="screen-main-menu"'),
        ("World Selection Screen", 'id="screen-worlds"'),
        ("How to Play Screen", 'id="screen-howto"'),
        ("Settings Screen", 'id="screen-settings"'),
        ("Credits Screen", 'id="screen-credits"'),
        ("Dialogue Modal", 'id="modal-dialogue"'),
        ("Puzzle Modal", 'id="modal-puzzle"'),
        ("Pause Modal", 'id="modal-pause"'),
        ("Victory Modal", 'id="modal-victory"'),
        ("World Complete Modal", 'id="modal-world-complete"')
    ]

    for label, pattern in elements:
        if pattern in html:
            print(f"  [PASS] UI Element Found: {label}")
        else:
            print(f"  [FAIL] Missing UI Element: {label}")
            return False

    return True

def test_http_server():
    print_header("4. Testing Web Server & Asset Loading")
    base_dir = os.path.dirname(os.path.abspath(__file__))

    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass

    port = 8765
    server = socketserver.TCPServer(("127.0.0.1", port), QuietHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()

    time.sleep(0.3)

    urls_to_test = [
        f"http://127.0.0.1:{port}/index.html",
        f"http://127.0.0.1:{port}/style.css",
        f"http://127.0.0.1:{port}/src/main.js",
        f"http://127.0.0.1:{port}/src/config.js",
        f"http://127.0.0.1:{port}/src/audio/soundManager.js",
        f"http://127.0.0.1:{port}/src/storage/saveManager.js",
        f"http://127.0.0.1:{port}/src/input/inputManager.js",
        f"http://127.0.0.1:{port}/src/graphics/sprites.js",
        f"http://127.0.0.1:{port}/src/graphics/particles.js",
        f"http://127.0.0.1:{port}/src/levels/world1/level1_1.js",
        f"http://127.0.0.1:{port}/src/levels/world2/level2_1.js",
        f"http://127.0.0.1:{port}/src/levels/world3/level3_1.js"
    ]

    all_http_pass = True
    for url in urls_to_test:
        try:
            req = urllib.request.urlopen(url, timeout=3)
            code = req.getcode()
            if code == 200:
                print(f"  [PASS] HTTP 200 OK: {url.split('/')[-1]}")
            else:
                print(f"  [FAIL] HTTP {code}: {url}")
                all_http_pass = False
        except Exception as e:
            print(f"  [FAIL] Error requesting {url}: {e}")
            all_http_pass = False

    server.shutdown()
    return all_http_pass

if __name__ == "__main__":
    t1 = test_file_existence()
    t2 = test_world_and_level_bounds()
    t3 = test_html_ui_components()
    t4 = test_http_server()

    if t1 and t2 and t3 and t4:
        print_header("ALL 4 QA TEST SUITES PASSED PERFECTLY!")
        sys.exit(0)
    else:
        print_header("SOME TESTS FAILED")
        sys.exit(1)
