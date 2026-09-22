# Deployment Guide: GANESH – THE JOURNEY

Congratulations on creating **GANESH – THE JOURNEY**!

Since this game is built entirely with pure HTML5, CSS3, ES6 JavaScript, Canvas 2D, and the Web Audio API, **it requires zero build steps and zero server-side setup**. It can be hosted on any static hosting provider.

---

## 🚀 1. GitHub & GitHub Pages (Recommended)

Your GitHub username is: **`lohithamanaswini10-ux`**

### Step A: Create a New Repository on GitHub
1. Log in to [GitHub](https://github.com).
2. Click the **+** (plus) icon at the top right and select **New repository**.
3. Name your repository: `ganesh-the-journey`.
4. Choose **Public**.
5. Leave "Add a README file" unchecked (we already have a comprehensive README).
6. Click **Create repository**.

### Step B: Upload or Push the Code
If Git is installed on your computer:
```bash
cd "c:\Users\LOHITHAMANASWINI\OneDrive\Documents\Custom Office Templates\ganesh-the-journey"
git init
git add .
git commit -m "Initial release: GANESH – THE JOURNEY (All 3 Worlds, 18 Levels)"
git branch -M main
git remote add origin https://github.com/lohithamanaswini10-ux/ganesh-the-journey.git
git push -u origin main
```

*Alternative (Web Upload without terminal)*:
1. In your new GitHub repository, click **Upload files**.
2. Drag and drop all files and folders inside the `ganesh-the-journey` folder.
3. Click **Commit changes**.

### Step C: Activate GitHub Pages
1. Go to your repository's **Settings** tab.
2. In the left sidebar, click **Pages**.
3. Under **Branch**, select `main` and keep the root `/` directory.
4. Click **Save**.
5. Within 1–2 minutes, your game is live at:  
   **`https://lohithamanaswini10-ux.github.io/ganesh-the-journey/`**

---

## ⚡ 2. Instant Free Hosting (Netlify Drop)
If you want an instant HTTPS link in 10 seconds:
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `ganesh-the-journey` folder onto the page.
3. Netlify will instantly provide a live public HTTPS link (e.g., `https://ganesh-the-journey.netlify.app`)!

---

## 🕹️ 3. Itch.io (Free Game Community)
1. Zip the contents of `ganesh-the-journey/`.
2. Go to [itch.io](https://itch.io) and create a **New Project**.
3. Set **Kind of project** to **HTML** (playable in browser).
4. Upload the `.zip` file and check "This file will be played in the browser".
5. Set viewport to 1280x720 (it will automatically scale responsively on mobile!).
6. Publish as Public!
