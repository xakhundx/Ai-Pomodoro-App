# 🧠 AI-Powered Pomodoro Focus App

Welcome to the **AI-Powered Pomodoro Focus App**! This project was built primarily as an **advanced, personalized tool for studying**. Instead of using standard, basic Pomodoro websites, I wanted a highly customized version that integrates an interactive 3D AI assistant to help me prioritize tasks, stay motivated, and manage my study sessions efficiently.

---

## ✨ Features
- **Smart Task Prioritization:** The built-in AI analyzes your remaining focus time and pending tasks to tell you exactly what to prioritize next.
- **Interactive 3D AI Core:** A floating, responsive 3D sphere that reacts to your interactions and serves as your digital study companion.
- **Bring Your Own Key (BYOK) AI Integration:** Securely input your own Google Gemini API key to unlock dynamic, conversational insights. The key never leaves your browser's local storage.
- **Offline Fallback Mode:** If you don't have an API key, the app gracefully falls back to a built-in offline logic system that still guides you through your Pomodoro sessions flawlessly!
- **Glassmorphism UI:** A sleek, modern user interface designed to be visually non-intrusive yet beautiful.

---

## 🛠️ Built With (Tech Stack)
This application was built using modern web technologies:
- **[React 19](https://react.dev/):** The core framework for the user interface.
- **[Vite](https://vitejs.dev/):** A lightning-fast development server and build tool.
- **[Three.js & React Three Fiber (@react-three/fiber)](https://docs.pmnd.rs/react-three-fiber):** Used to render and animate the 3D AI Core in real-time.
- **[Google Gemini API](https://aistudio.google.com/):** The brain behind the dynamic AI responses.
- **Vanilla CSS:** Custom styling using CSS variables and modern glassmorphism techniques.

---

## 🚀 How to Run Locally

If you'd like to run this app on your own machine, follow these steps:

### Prerequisites:
- Ensure you have **Node.js** installed (version 18+ recommended).

### Setup:
1. **Clone the repository** and navigate to the project directory:
   ```bash
   cd ai_pomodoro_app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:** 
   Navigate to the local URL provided in the terminal (usually `http://localhost:5173`).

### Deployment:
The app is configured for GitHub Pages. To deploy a new version to the live site, simply run:
```bash
npm run deploy
```

---

## 📖 How to Use the App

1. **Setting the Timer:** The app defaults to a 25-minute Work session and a 5-minute Break session. Click "Start Focus" to begin.
2. **Managing Tasks:** Add your study tasks in the "Your Tasks" list on the right. You can check them off as you complete them.
3. **Interacting with the AI:**
   - **Offline Mode:** Simply type your queries in the chat box. The offline core will calculate what you should do based on your timer and tasks.
   - **Advanced Mode:** Paste your **Gemini Free-Tier API Key** into the setup field to unlock conversational AI. It will save locally to your browser securely.
4. **When the Timer Ends:** The AI will automatically analyze your progress and suggest your next move for the upcoming Work or Break block!

Happy Studying! 🚀
