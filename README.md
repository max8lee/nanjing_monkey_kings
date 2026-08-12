# Nanjing Monkey Kings - Website

Official Website for the **Nanjing Monkey Kings** Basketball Team.

---

## Official Google Sheets

- **Stat Sheet**: [https://docs.google.com/spreadsheets/d/1UH-fB1CdLIRuflL2v5otKHnVSRjmzEqdhQwOEVZeo1k/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1UH-fB1CdLIRuflL2v5otKHnVSRjmzEqdhQwOEVZeo1k/edit?usp=sharing)
- **Uniform Order Sheet**: [https://docs.google.com/spreadsheets/d/1kpLDmHAjoflvm1lReZViyH_agV7BXeEfjGqA99-KA3w/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1kpLDmHAjoflvm1lReZViyH_agV7BXeEfjGqA99-KA3w/edit?usp=sharing)

---

## How to Run the App (Vite + React)

1. Open your terminal in this workspace directory:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   **`http://localhost:3000`**

---

## Contributing (For Teammates)

Want to update the schedule, add new game films, or tweak the codebase? Follow these steps:

1. **Clone the Code**: Clone the GitHub repository to your local machine.
2. **Install Dependencies**: Run `npm install` in your terminal to install the necessary packages.
3. **Test Locally**: Run `npm run dev` and open `http://localhost:3000` in your browser to verify your changes work perfectly before submitting.
4. **Make a Pull Request (PR)**: Push your changes to a new branch on GitHub and open a Pull Request against the `main` branch.
5. **Automatic Live Deployment**: Once your Pull Request is reviewed and **merged into `main`**, our Firebase CI/CD GitHub Action will automatically build and re-deploy your changes to the live website!

---

## Key Features

- **Modern React + Vite Architecture**: Pure state management with dynamic component resizing across desktop, tablet, and mobile viewports.
- **Teammate Registration & Player Claiming**: Teammates sign up with Full Name, Phone Number, Email, and Password. Selects and claims their roster player with lock protection (`CLAIMED BY [Teammate]`).
- **Custom Profile Editor**: Teammates customize their Nickname, Position, Height, Weight, College, Photo, and Custom Biography Paragraph. Official game stats remain strictly protected.
- **Match Center**: Game pages (`#game/game-1`, `#game/game-2`, `#game/game-3`) featuring team scoreboards, team shooting breakdowns, and player box scores.
- **Full Browser History & Hash Routing**: Seamless browser Back (←) and Forward (→) navigation across `#home`, `#schedule`, `#roster`, `#stats`, `#standings`, `#film`, `#player-props`, `#player-bio/slug`, and `#game/slug`.
