/// <reference types="vite/client" />
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export async function askGemini(
  prompt: string, 
  tasks: Task[], 
  timerState: { mode: string, timeLeft: number }
) {
  if (!API_KEY) {
    return "API key is missing! Please make sure you provided it properly.";
  }

  const systemInstructions = `You are an advanced, professional AI productivity assistant for a Pomodoro focus app. 
Current User Tasks: ${tasks.map(t => `[${t.completed ? 'x' : ' '}] ${t.text}`).join(' | ') || 'No tasks added yet.'}
Current Timer State: ${timerState.mode} mode, ${Math.floor(timerState.timeLeft / 60)}:${(timerState.timeLeft % 60).toString().padStart(2, '0')} remaining.
Your goal is to help the user maximize their productivity. Provide intelligent, highly relevant advice based on the specific tasks they have listed. 
Suggest logically which task they should tackle first based on standard prioritization, encourage them during work blocks, and advise them to detach during breaks. 
Keep your responses professional, concise (1-3 sentences maximum), smart, and motivating.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${systemInstructions}\n\nUser: ${prompt}` }] }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my brain right now, but you got this!";
  }
}
