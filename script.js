/* ==========================================================================
   WEB DEV TUTORIAL STUDIO - MAIN JAVASCRIPT ENGINE (script.js)
   ========================================================================== */

// LESSON CODE PRESETS
const LESSON_PRESETS = {
    1: {
        title: "Lesson 1: HTML Structural Basics",
        guide: "HTML (HyperText Markup Language) is the backbone of your web page. It defines elements like titles <code>&lt;h1&gt;</code>, paragraphs <code>&lt;p&gt;</code>, images <code>&lt;img&gt;</code>, and buttons <code>&lt;button&gt;</code>.",
        html: `<!DOCTYPE html>
<html>
<head>
    <title>My First Team Page</title>
</head>
<body style="font-family: sans-serif; padding: 20px; background: #0B132B; color: #fff;">

    <!-- 1. Team Header -->
    <h1>🏀 NANJING MONKEY KINGS</h1>
    <p>Welcome to the official beginner site for our basketball team!</p>

    <!-- 2. Action Button -->
    <button onclick="alert('Roar of the Monkey Kings!')" style="padding: 10px 20px; background: #FFB703; border: none; font-weight: bold; border-radius: 6px; cursor: pointer;">
        Cheer for Team!
    </button>

</body>
</html>`,
        css: `/* CSS adds styles like colors, spacing, and fonts! */
body {
    background-color: #0B132B;
    color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
}

h1 {
    color: #FFB703;
}`,
        js: `// JavaScript adds interactivity!
console.log("Welcome to Nanjing Monkey Kings Web Tutorial!");`
    },

    2: {
        title: "Lesson 2: CSS Styling & Cards",
        guide: "CSS (Cascading Style Sheets) turns plain text into a beautiful layout. Here we create styled team badges, gradient cards, and smooth hover animations.",
        html: `<div class="team-card">
    <div class="badge">CBA BASKETBALL</div>
    <h2>Nanjing Monkey Kings</h2>
    <p>City: Nanjing, Jiangsu, China</p>
    <p>Home Arena: Wutaishan Sports Center</p>
    <button class="btn-primary">View Match Tickets</button>
</div>`,
        css: `body {
    background-color: #0A0F1D;
    color: #ffffff;
    font-family: 'Segoe UI', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
}

.team-card {
    background: linear-gradient(135deg, #1C2541, #0B132B);
    border: 2px solid #FFB703;
    border-radius: 16px;
    padding: 30px;
    max-width: 380px;
    box-shadow: 0 10px 30px rgba(255, 183, 3, 0.2);
    text-align: center;
    transition: transform 0.3s ease;
}

.team-card:hover {
    transform: translateY(-8px);
}

.badge {
    background: #7209B7;
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
    display: inline-block;
    margin-bottom: 12px;
}

h2 {
    color: #FFB703;
    margin-bottom: 8px;
}

p {
    color: #94A3B8;
    font-size: 0.95rem;
    margin-bottom: 8px;
}

.btn-primary {
    margin-top: 15px;
    background: #FFB703;
    color: #0B132B;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
}`,
        js: `// Add dynamic hover log
console.log("Card initialized!");`
    },

    3: {
        title: "Lesson 3: JavaScript Interactivity",
        guide: "JavaScript lets users interact with your page in real-time! In this lesson, we build a working Live Score Counter for the Monkey Kings.",
        html: `<div class="scoreboard">
    <h3>🏀 LIVE SCOREBOARD</h3>
    <div id="score" class="score-num">0</div>
    <div class="buttons">
        <button onclick="addPoints(1)">+1 Free Throw</button>
        <button onclick="addPoints(2)">+2 Field Goal</button>
        <button onclick="addPoints(3)">+3 Three-Pointer</button>
        <button onclick="resetScore()" class="btn-reset">Reset</button>
    </div>
</div>`,
        css: `body {
    background: #0B132B;
    color: white;
    font-family: sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
}

.scoreboard {
    background: #1C2541;
    border: 2px solid #4CC9F0;
    padding: 30px;
    border-radius: 16px;
    text-align: center;
    min-width: 300px;
}

.score-num {
    font-size: 5rem;
    font-weight: 900;
    color: #FFB703;
    margin: 10px 0;
}

.buttons button {
    background: #7209B7;
    color: white;
    border: none;
    padding: 8px 14px;
    margin: 4px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
}

.buttons .btn-reset {
    background: #e74c3c;
}`,
        js: `let currentScore = 0;

function addPoints(pts) {
    currentScore += pts;
    document.getElementById('score').innerText = currentScore;
}

function resetScore() {
    currentScore = 0;
    document.getElementById('score').innerText = currentScore;
}`
    },

    4: {
        title: "Lesson 4: Full Sports Team App",
        guide: "Combine HTML, CSS, and JS into a complete interactive experience with player roster filtering, schedule, and live cheer wall!",
        html: `<div style="text-align: center; padding: 20px; font-family: sans-serif; color: white; background: #0B132B; min-height: 100vh;">
    <h2 style="color: #FFB703;">👥 Player Roster Filter</h2>
    <div style="margin-bottom: 20px;">
        <button onclick="filterPos('all')" style="padding: 8px 16px; margin: 4px; border-radius: 20px; border: none; background: #FFB703; cursor: pointer; font-weight: bold;">All</button>
        <button onclick="filterPos('guard')" style="padding: 8px 16px; margin: 4px; border-radius: 20px; border: none; background: #7209B7; color: white; cursor: pointer;">Guards</button>
        <button onclick="filterPos('forward')" style="padding: 8px 16px; margin: 4px; border-radius: 20px; border: none; background: #7209B7; color: white; cursor: pointer;">Forwards</button>
    </div>

    <div id="roster" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <div class="card guard" style="background: #1C2541; padding: 20px; border-radius: 12px; border: 1px solid #4CC9F0; width: 180px;">
            <h3 style="color: #FFB703;">Lin Wei</h3>
            <p style="color: #4CC9F0;">Point Guard #1</p>
        </div>
        <div class="card forward" style="background: #1C2541; padding: 20px; border-radius: 12px; border: 1px solid #4CC9F0; width: 180px;">
            <h3 style="color: #FFB703;">Wang Lanfeng</h3>
            <p style="color: #4CC9F0;">Small Forward #9</p>
        </div>
        <div class="card guard" style="background: #1C2541; padding: 20px; border-radius: 12px; border: 1px solid #4CC9F0; width: 180px;">
            <h3 style="color: #FFB703;">Blakeney</h3>
            <p style="color: #4CC9F0;">Shooting Guard #0</p>
        </div>
    </div>
</div>`,
        css: `/* Lesson 4 CSS Styles */
body { margin: 0; background: #0B132B; }`,
        js: `function filterPos(pos) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (pos === 'all' || card.classList.contains(pos)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}`
    }
};

// CURRENT STATE
let currentLessonId = 1;
let currentTab = 'html';

// DOM ELEMENTS
const htmlEditor = document.getElementById('code-html');
const cssEditor = document.getElementById('code-css');
const jsEditor = document.getElementById('code-js');
const sandboxIframe = document.getElementById('sandbox-iframe');

// INITIALIZE APP
window.addEventListener('DOMContentLoaded', () => {
    loadLesson(1);
    
    // Auto-update iframe when typing in editor
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.addEventListener('input', runSandboxCode);
    });
});

// MODE SWITCHER
function switchMode(mode) {
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.view-container').forEach(view => view.classList.remove('active'));

    document.getElementById(`btn-mode-${mode}`).classList.add('active');
    document.getElementById(`view-${mode}`).classList.add('active');
}

// LESSON SWITCHER
function loadLesson(lessonId) {
    currentLessonId = lessonId;
    
    // Update sidebar UI
    const items = document.querySelectorAll('.lesson-item');
    items.forEach((item, idx) => {
        if (idx + 1 === lessonId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    const lesson = LESSON_PRESETS[lessonId];
    document.getElementById('guide-title').innerText = lesson.title;
    document.getElementById('guide-text').innerHTML = lesson.guide;

    loadLessonPreset();
}

// LOAD PRESET CODE INTO EDITORS
function loadLessonPreset() {
    const lesson = LESSON_PRESETS[currentLessonId];
    htmlEditor.value = lesson.html;
    cssEditor.value = lesson.css;
    jsEditor.value = lesson.js;
    
    runSandboxCode();
}

// SWITCH CODE EDITOR TAB
function switchEditorTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.code-textarea').forEach(ta => ta.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(`code-${tab}`).classList.add('active');
}

// RUN CODE IN SANDBOX IFRAME
function runSandboxCode() {
    const html = htmlEditor.value;
    const css = cssEditor.value;
    const js = jsEditor.value;

    const iframeDoc = sandboxIframe.contentDocument || sandboxIframe.contentWindow.document;

    const combinedContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}<\/script>
        </body>
        </html>
    `;

    iframeDoc.open();
    iframeDoc.write(combinedContent);
    iframeDoc.close();
}

// RESET EDITOR
function resetEditor() {
    loadLessonPreset();
}

// TOGGLE PREVIEW VIEWPORT
function setPreviewViewport(viewport) {
    const wrapper = document.getElementById('sandbox-wrapper');
    document.querySelectorAll('.vp-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (viewport === 'mobile') {
        wrapper.classList.add('mobile');
    } else {
        wrapper.classList.remove('mobile');
    }
}
