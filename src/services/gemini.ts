/// <reference types="vite/client" />
import { PersonaOption } from '../themes/themeEngine';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export async function askGemini(
  prompt: string,
  tasks: Task[],
  timerState: { mode: string; timeLeft: number },
  persona: PersonaOption,
  userNickname: string,
  powerLevel: number
): Promise<string> {
  const generateSmartPersonaResponse = (): string => {
    const isWork = timerState.mode === 'Work';
    const incomplete = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    const lowerPrompt = prompt.toLowerCase();
    const minsLeft = Math.max(1, Math.floor(timerState.timeLeft / 60));

    // Task completion celebration
    if (lowerPrompt.includes('just completed')) {
      const quote =
        persona.taskCompleteQuotes[
          Math.floor(Math.random() * persona.taskCompleteQuotes.length)
        ];
      if (incomplete.length > 0) {
        return `${quote} Next up on your radar: "${incomplete[0].text}".`;
      }
      return `${quote} You've cleared every task on your list, ${userNickname}!`;
    }

    // Prioritization / what to do next
    if (
      lowerPrompt.includes('prioritize') ||
      lowerPrompt.includes('next') ||
      lowerPrompt.includes('start') ||
      lowerPrompt.includes('what should') ||
      lowerPrompt.includes('suggest')
    ) {
      if (incomplete.length > 0) {
        const focusQuote =
          persona.workFocusQuotes[
            Math.floor(Math.random() * persona.workFocusQuotes.length)
          ];
        return `${focusQuote} Start with "${incomplete[0].text}" (${incomplete.length} remaining, +1,000 Power on completion).`;
      }
      return `Your task queue is completely clear, ${userNickname}! Add a new objective to earn +1,000 Power toward your next milestone.`;
    }

    // Power level / status check
    if (lowerPrompt.includes('power') || lowerPrompt.includes('score') || lowerPrompt.includes('progress')) {
      const remainingTo9k = Math.max(0, 9000 - powerLevel);
      if (remainingTo9k > 0) {
        const tasksNeeded = Math.ceil(remainingTo9k / 1000);
        return `${userNickname}, your current Power is ${powerLevel.toLocaleString()} (${completed.length} tasks done). Complete ${tasksNeeded} more task${tasksNeeded === 1 ? '' : 's'} to trigger the 9,000 milestone!`;
      }
      return `${ persona.over9000Quote(userNickname) } Current Power: ${powerLevel.toLocaleString()}!`;
    }

    // Greeting / hello
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('hey')) {
      return persona.greeting(userNickname);
    }

    // Default contextual response for Work vs Break
    if (isWork) {
      const focusQuote =
        persona.workFocusQuotes[
          Math.floor(Math.random() * persona.workFocusQuotes.length)
        ];
      if (incomplete.length > 0) {
        return `${focusQuote} Lock in on "${incomplete[0].text}" for the next ${minsLeft} minutes!`;
      }
      return `${focusQuote} Add a task to your list and earn +1,000 Power when you finish it!`;
    } else {
      return persona.breakQuotes[
        Math.floor(Math.random() * persona.breakQuotes.length)
      ];
    }
  };

  // Optional env key if developer configured VITE_GEMINI_API_KEY
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!envApiKey) {
    return generateSmartPersonaResponse();
  }

  const systemInstructions = `${persona.systemPrompt}
You are assisting "${userNickname}" inside a gamified Pomodoro productivity app.
Current User Power Level: ${powerLevel} (+1,000 per task, major milestone at 9,000).
Current User Tasks: ${tasks.map(t => `[${t.completed ? 'x' : ' '}] ${t.text}`).join(' | ') || 'No tasks added yet.'}
Current Timer State: ${timerState.mode} mode, ${Math.floor(timerState.timeLeft / 60)}:${(timerState.timeLeft % 60).toString().padStart(2, '0')} remaining.
Stay in character as ${persona.characterName} while giving concise (1-2 sentences max), motivating, task-aware advice.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${envApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstructions}\n\nUser: ${prompt}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    if (data.error || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return generateSmartPersonaResponse();
    }
    return data.candidates[0].content.parts[0].text;
  } catch {
    return generateSmartPersonaResponse();
  }
}
