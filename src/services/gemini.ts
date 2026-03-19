/// <reference types="vite/client" />

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
  const generateOfflineResponse = () => {
    const isWork = timerState.mode === 'Work';
    const incomplete = tasks.filter(t => !t.completed);
    
    if (prompt.toLowerCase().includes('prioritize') || prompt.toLowerCase().includes('next') || prompt.toLowerCase().includes('what')) {
      if (incomplete.length > 0) {
        return `[Offline Core] I recommend tackling "${incomplete[0].text}" first. Let's make the most of your ${Math.floor(timerState.timeLeft / 60)} minutes of focus.`;
      }
      return `[Offline Core] You have no pending tasks. Add a task so I can help prioritize!`;
    }

    if (isWork) {
      return `[Offline Core] Focus mode is active. Keep working on your tasks. You have ${Math.floor(timerState.timeLeft / 60)} minutes left.`;
    } else {
      return `[Offline Core] Break mode active. Step away from your screen and recharge.`;
    }
  };

  if (tasks.length === 0 && prompt === "") {
    return generateOfflineResponse();
  }

  const systemInstructions = `You are an advanced, professional AI productivity assistant for a Pomodoro focus app. 
Current User Tasks: ${tasks.map(t => `[${t.completed ? 'x' : ' '}] ${t.text}`).join(' | ') || 'No tasks added yet.'}
Current Timer State: ${timerState.mode} mode, ${Math.floor(timerState.timeLeft / 60)}:${(timerState.timeLeft % 60).toString().padStart(2, '0')} remaining.
Your goal is to help the user maximize their productivity. Provide intelligent, highly relevant advice based on the specific tasks they have listed. 
Suggest logically which task they should tackle first based on standard prioritization, encourage them during work blocks, and advise them to detach during breaks. 
Keep your responses professional, concise (1-3 sentences maximum), smart, and motivating.`;

  try {
    const response = await fetch(`/api/gemini`, {
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
    return generateOfflineResponse();
  }
}
