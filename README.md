# 🐋 Fierce Orcas — Coach's Playbook

A complete volleyball coaching toolkit built for a 7th–9th grade travel team. 10 interactive web-based tools covering every aspect of the season — no installation, no account, no internet required. Just open a file in any browser and coach.

---

## 🚀 Quick Start

**Open `dashboard.html` in any web browser.** That's it. The dashboard gives you access to all 10 tools from one screen.

> Works in Chrome, Firefox, Safari, and Edge. No server needed — everything runs locally.

---

## 📂 What's Included

| File | Tool | Category |
|------|------|----------|
| `dashboard.html` | **Coach Dashboard** — home screen with navigation to all tools, practice timer, and tip of the day | Home |
| `volleyball-season-plan.html` | **Season Practice Plan** — 12-week plan with 4 phases and 60-min session breakdowns | Planning |
| `drill-board.html` | **Drill Board** — 24 GMS drills with video links, filters, timer, and favorites | Planning |
| `volleyball-eval-system.html` | **Player Evaluation System** — score players across 4 pillars with radar charts | Evaluation |
| `tryout-drill-system.html` | **Tryout Drill System** — 7 measurable stations with live scoring and rankings | Evaluation |
| `rotation-iq.html` | **RotationIQ** — build your starting 6 and all 6 rotations using eval scores | Evaluation |
| `volleyball-fix-serve-receive.html` | **Fix: Serve Receive & Ball Fear** — targeted drills for footwork and ball-fear | Skill Training |
| `jump-training.html` | **Jump Higher Program** — 12-week plyometric program with progress tracker | Skill Training |
| `volleyball-blocking-guide.html` | **Teaching Blocking** — complete blocking guide with technique, footwork, and 8 drills | Skill Training |
| `volleyball-transition-guide.html` | **Coaching Transition** — the 5 phases of transition with drills and 4-week plan | Skill Training |
| `62-rotation-academy.html` | **6-2 Rotation Academy** — interactive game for players: 6 lessons + 12 drag-and-drop questions | Game Systems |

---

## 🎮 Tool Details

### 📅 Season Practice Plan
- 12-week season broken into 4 training phases
- Every practice timed to the minute (60-min format)
- Foundation → System Building → Game Intensity → Peak & Compete
- Click any phase to expand weekly breakdowns

### 🏐 Drill Board
- 24 Gold Medal Squared drills with direct video links
- Filter by category: Warm-Up, Passing, Setting, Attacking, Team, Compete
- Search by drill name, skill, or keyword
- Built-in practice timer with preset durations
- Star your favorite drills — saves between sessions

### 📊 Player Evaluation System
- Score players 1–10 across 4 pillars: Passing, Hitting, Pressure, Chemistry
- Position-specific bonus metrics (setters, liberos, OHs, MBs each get unique criteria)
- Live radar chart updates as you score
- Overall rating auto-calculated and saved to browser
- Navigate Prev/Next through players quickly

### 📋 Tryout Drill System
- 7 measurable drill stations with a 1–5 rubric per station
- Stations: Serve Receive, Zone Serving, Setting Accuracy, Hitting Efficiency, Read & React Digging, Block Footwork, Live Scrimmage
- Live score entry with per-player notes during tryouts
- Full sortable leaderboard — click any column to re-rank
- Tap any player row for their full individual breakdown

### 🧠 RotationIQ — Starting Lineup Builder
- Built around the 5-1 system (1 Setter, 2 OH, 2 MB, 1 OPP, 1 Libero)
- Pulls player scores from eval to recommend best fit per position
- Build all 6 rotations with a live court diagram
- Auto-fill by score with one click
- Analysis tab: team pillar ratings, serve order recommendation, and coaching insights

### 🦶 Fix: Serve Receive & Ball Fear
- 4 footwork drills targeting late movement and wrong body angles
- 4-stage ball fear desensitization progression (F1–F4)
- Integration drill combining both problems at game speed
- 6-week insertion schedule that fits into existing 60-min practices
- Coaching cues for what to say (and what NOT to say) to scared players

### ⬆️ Jump Higher Program
- 12-week program across 4 phases: Foundation → Explosive → Power Transfer → Peak
- 16 exercises: plyometric, strength, technique, and mobility
- Day-by-day weekly schedule with exercise assignments
- Progress tracker: enter standing reach and jump reach at each checkpoint
- Vertical jump gain calculated and visualized across the season

### ✋ Teaching Blocking
- 8 chapters: why blocking matters, technique, footwork, reading, team blocking, drills, mistakes, 4-week plan
- 3 footwork patterns: Step-Close, Crossover, Step-Hop — when to use each
- SVG court diagrams for hand position and team block coverage
- 8 progressive drills from Hand Check (no ball) to full Block-Defense System
- 8 common mistakes with exact wrong behavior and specific fix for each

### 🔄 Coaching Transition
- The 5 phases: Dig → Setter First Step → Net Exit → Attack → Reset
- Drop step footwork for blockers exiting the net
- Approach timing timeline: wrong / better / correct triggers
- 8 transition-specific drills (Shoulder Read → Wash Drill → Transition Kill Challenge)
- 4-week practice insertion plan

### 🎮 6-2 Rotation Academy (Player Game)
- Give this to your players — it's a game, not a lecture
- 6 progressive lessons covering all rotations with live court diagrams
- 12 questions: 4 drag-and-drop challenges + 8 multiple choice
- Drag-and-drop works on both mobile (touch) and desktop (mouse)
- Scoring system with letter grades and confetti on correct answers
- Full results breakdown at the end

---

## 🌐 Hosting on GitHub Pages (Free)

Want to share the tools with players or assistant coaches via a link? Enable GitHub Pages:

1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main branch** and click **Save**
4. Your dashboard will be live at: `https://YOUR-USERNAME.github.io/fierce-orcas-playbook/dashboard.html`

Players can then open the **6-2 Rotation Academy** on their phones directly:
`https://YOUR-USERNAME.github.io/fierce-orcas-playbook/62-rotation-academy.html`

---

## 💾 Data & Privacy

All data (player names, scores, favorites, progress) is stored in **your browser's localStorage only**. Nothing is sent anywhere. No accounts, no cloud, no tracking.

To back up player data: use your browser's developer tools to export localStorage, or simply note that clearing browser data will erase scores.

---

## 📱 Mobile Use

All tools are mobile-responsive. The **6-2 Rotation Academy** drag-and-drop works on touch screens. The **Drill Board** timer vibrates your phone when time is up (if vibration is enabled).

Best experience: save `dashboard.html` to your phone's home screen as a web app for instant access during practice.

---

## 🛠 Tech Stack

Pure HTML, CSS, and vanilla JavaScript. No frameworks, no build tools, no dependencies. Every file is self-contained and works offline.

---

## 📋 File Reference

```
fierce-orcas-playbook/
├── dashboard.html                    ← START HERE
├── volleyball-season-plan.html
├── drill-board.html
├── volleyball-eval-system.html
├── tryout-drill-system.html
├── rotation-iq.html
├── volleyball-fix-serve-receive.html
├── jump-training.html
├── volleyball-blocking-guide.html
├── volleyball-transition-guide.html
├── 62-rotation-academy.html
└── README.md
```

---

*Built for the Fierce Orcas · Grades 7–9 · Season Coaching Toolkit*
