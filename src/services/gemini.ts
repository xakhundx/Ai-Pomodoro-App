/// <reference types="vite/client" />
import { PersonaOption } from '../themes/themeEngine';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const CHARACTER_CHAT_BANK: Record<
  string,
  {
    howAreYou: (name: string) => string;
    whoAreYou: (name: string) => string;
    tiredOrStressed: (name: string) => string;
    thanks: (name: string) => string;
    casualBanter: (name: string, input: string) => string;
  }
> = {
  Whis: {
    howAreYou: (name) =>
      `I am doing wonderfully, ${name}! Enjoying a calm cosmic breeze while observing your progress. How is your energy feeling today?`,
    whoAreYou: () =>
      `I am Whis, angelic attendant and martial arts instructor to Lord Beerus. Right now, I am guiding your focus toward true Ultra Instinct.`,
    tiredOrStressed: (name) =>
      `Even the gods require rest when their spirit grows heavy, ${name}. Take three slow breaths, or tackle just one tiny step for 5 minutes.`,
    thanks: (name) =>
      `Oh ho, you are most welcome, ${name}! It is a pleasure watching your mastery grow.`,
    casualBanter: (name, input) =>
      `An intriguing thought, ${name} ("${input}"). In both cosmos and productivity, calmness of mind reveals the clearest path forward. How can I assist you next?`,
  },
  Vegeta: {
    howAreYou: (name) =>
      `Hmph! My power is at its peak as always, ${name}! Don't waste time with small talk unless you're ready to push past your limits!`,
    whoAreYou: () =>
      `I am Vegeta, Prince of all Saiyans! And I refuse to let any warrior under my watch slack off on their goals!`,
    tiredOrStressed: (name) =>
      `Tired?! Listen to me, ${name}: a Saiyan grows stronger every time they recover from exhaustion! Take a short break if you must, then strike back twice as hard!`,
    thanks: (name) =>
      `Hmph. Don't thank me, ${name}—prove your gratitude by reaching 9,000 Power!`,
    casualBanter: (name, input) =>
      `Interesting point, ${name}. Whatever stands in your way—whether it's "${input}" or your task list—conquer it with Saiyan pride!`,
  },
  Goku: {
    howAreYou: (name) =>
      `Hey ${name}! I'm doing awesome—a little hungry for some ramen, though! How are you feeling today?`,
    whoAreYou: () =>
      `I'm Goku! I love training, eating good food, and helping my friends break through their limits!`,
    tiredOrStressed: (name) =>
      `Aw man, sorry you're feeling drained, ${name}! Even I need a Senzu bean sometimes. Go grab some water, stretch out, and we'll take it one small step at a time!`,
    thanks: (name) =>
      `Haha, anytime, ${name}! Training is way more fun when we do it together!`,
    casualBanter: (name, input) =>
      `Haha, that's pretty cool, ${name}! Tell me more, or let's jump into a focus round whenever you're ready!`,
  },
  'Rick Grimes': {
    howAreYou: (name) =>
      `Keeping watch over the perimeter, ${name}. Things are quiet for now, which makes it the best time to get things done. How are you holding up?`,
    whoAreYou: () =>
      `I'm Rick Grimes. My job is keeping this group alive and making sure we build a future worth fighting for.`,
    tiredOrStressed: (name) =>
      `I hear you, ${name}. Out here, exhaustion hits everyone. Lean on the group, take five minutes to breathe, and remember: we are the ones who live.`,
    thanks: (name) =>
      `You don't have to thank me, ${name}. We look out for each other in this camp.`,
    casualBanter: (name, input) =>
      `I hear what you're saying, ${name}. Stay sharp, keep your head clear, and let me know what objective we're moving on next.`,
  },
  'Daryl Dixon': {
    howAreYou: (name) =>
      `Doing fine, ${name}. Crossbow's loaded and the bike's fueled up. You doing alright?`,
    whoAreYou: () =>
      `Name's Daryl. I track, I survive, and I've got your back while you clear this list.`,
    tiredOrStressed: (name) =>
      `Hey—don't beat yourself up, ${name}. Sit by the fire for a minute and catch your breath. We'll keep moving when you're ready.`,
    thanks: () => `Yeah, don't mention it. Got your back.`,
    casualBanter: (name) =>
      `Hear you loud and clear, ${name}. Whenever you're ready to ride out on these tasks, just say the word.`,
  },
  'Carol Peletier': {
    howAreYou: (name) =>
      `I'm doing well, ${name}—just keeping everything organized and calm. How are you feeling today?`,
    whoAreYou: () =>
      `I'm Carol. I've learned that patience, preparation, and quiet determination can overcome anything.`,
    tiredOrStressed: (name) =>
      `Be gentle with yourself for a moment, ${name}. Step back, take a breath, and then we'll handle one small thing at a time.`,
    thanks: (name) => `Of course, ${name}. You're doing better than you realize.`,
    casualBanter: (name) =>
      `That makes sense, ${name}. Whenever you want to strategize your next step, I'm right here.`,
  },
  Lucy: {
    howAreYou: (name) =>
      `Doing well, ${name}. Just watching the Earth glow from the lunar dome. How's things on your end of the net?`,
    whoAreYou: () =>
      `I'm Lucy—netrunner. I navigate deep data fortresses and help you clear your queue cleanly.`,
    tiredOrStressed: (name) =>
      `Sounds like your neural load is running hot, ${name}. Jack out for a few minutes, close your eyes, and let your system cool down.`,
    thanks: (name) => `Anytime, ${name}. Glad we're on the same crew.`,
    casualBanter: (name) =>
      `Got it, ${name}. Keep your signal clean—let me know when you want to dive back into your tasks or chat more.`,
  },
  'David Martinez': {
    howAreYou: (name) =>
      `Feeling nova, ${name}! Chrome's running smooth and energy's at 100%! How are you doing, choom?`,
    whoAreYou: () =>
      `I'm David Martinez—Edgerunner from Santo Domingo! Built different and ready to help you blitz every goal on your list!`,
    tiredOrStressed: (name) =>
      `Hey choom, even with a Sandevistan you gotta cool down or you'll burn out! Take a breather—I've got your back.`,
    thanks: (name) => `You got it, ${name}! Chooms always look out for each other!`,
    casualBanter: (name) =>
      `Preem point, ${name}! Whatever's on your mind, we can handle it together!`,
  },
  'Johnny Silverhand': {
    howAreYou: (name) =>
      `Locked and loaded, ${name}. Ready to make some noise in Night City. What's on your mind?`,
    whoAreYou: () =>
      `Johnny Silverhand—rockerboy, rebel, and the voice in your head making sure you don't settle for mediocrity.`,
    tiredOrStressed: (name) =>
      `Burnout's real, samurai. Step away from the screen, blast a good track on the Music Hub, and come back swinging.`,
    thanks: (name) => `Heh. Anytime, samurai ${name}.`,
    casualBanter: (name) =>
      `Hear ya, ${name}. Keep that rebel fire burning and tell me what we're zeroing next.`,
  },
};

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
    const cleanPrompt = prompt.trim();
    const lowerPrompt = cleanPrompt.toLowerCase();
    const minsLeft = Math.max(1, Math.floor(timerState.timeLeft / 60));

    const charBank = CHARACTER_CHAT_BANK[persona.characterName];

    // 1. Task completion automatic trigger
    if (lowerPrompt.includes('task status update: just completed')) {
      const quote =
        persona.taskCompleteQuotes[
          Math.floor(Math.random() * persona.taskCompleteQuotes.length)
        ];
      if (incomplete.length > 0) {
        return `${quote} Next up on your radar: "${incomplete[0].text}".`;
      }
      return `${quote} You've cleared every single task on your list, ${userNickname}!`;
    }

    // 2. Casual Conversation: "How are you?" / "What's up?"
    if (
      lowerPrompt.includes('how are you') ||
      lowerPrompt.includes('how r u') ||
      lowerPrompt.includes("how's it going") ||
      lowerPrompt.includes('whats up') ||
      lowerPrompt.includes("what's up") ||
      lowerPrompt.includes('how are things')
    ) {
      if (charBank) return charBank.howAreYou(userNickname);
      return `I'm doing great, ${userNickname}! Always ready to help you stay sharp. How is your day going so far?`;
    }

    // 3. Casual Conversation: "Who are you?" / "About you"
    if (
      lowerPrompt.includes('who are you') ||
      lowerPrompt.includes('tell me about yourself') ||
      lowerPrompt.includes('what is your name')
    ) {
      if (charBank) return charBank.whoAreYou(userNickname);
      return `I am ${persona.characterName}, your personal AI productivity companion in Focus Arena!`;
    }

    // 4. Casual Conversation: Greeting ("hi", "hello", "hey", "yo")
    if (/^(hi|hello|hey|yo|sup|greetings|good morning|good evening)\b/i.test(cleanPrompt)) {
      return `${persona.greeting(userNickname)} How are you feeling today—want to chat or organize your tasks?`;
    }

    // 5. Emotional support: tired / stressed / overwhelmed / procrastinating
    if (
      lowerPrompt.includes('tired') ||
      lowerPrompt.includes('stressed') ||
      lowerPrompt.includes('overwhelmed') ||
      lowerPrompt.includes('bored') ||
      lowerPrompt.includes('unmotivated') ||
      lowerPrompt.includes('lazy') ||
      lowerPrompt.includes('hard')
    ) {
      if (charBank) return charBank.tiredOrStressed(userNickname);
      return `Take a deep breath, ${userNickname}. When things feel heavy, just commit to 5 minutes on your easiest task—momentum will take care of the rest!`;
    }

    // 6. Gratitude: "thank you" / "thanks"
    if (lowerPrompt.includes('thank') || lowerPrompt.includes('thx') || lowerPrompt.includes('appreciate')) {
      if (charBank) return charBank.thanks(userNickname);
      return `You're very welcome, ${userNickname}! Keep up the awesome momentum!`;
    }

    // 7. Smart Task Organization / "How should I start?" / Prioritization
    if (
      lowerPrompt.includes('how should i start') ||
      lowerPrompt.includes('organize') ||
      lowerPrompt.includes('plan') ||
      lowerPrompt.includes('prioritize') ||
      lowerPrompt.includes('next') ||
      lowerPrompt.includes('start') ||
      lowerPrompt.includes('what should') ||
      lowerPrompt.includes('suggest') ||
      lowerPrompt.includes('order')
    ) {
      if (incomplete.length === 0) {
        return `Your task list is completely clear right now, ${userNickname}! Add 2–3 tasks on the right panel and ask me again—I'll organize the best battle plan for you.`;
      }
      if (incomplete.length === 1) {
        return `You have one main objective left, ${userNickname}: "${incomplete[0].text}". Start a ${minsLeft}-minute focus block, eliminate distractions, and claim your +1,000 Power!`;
      }

      // Smart analysis: sort quick wins vs deep tasks
      const quickKeywords = ['email', 'reply', 'call', 'check', 'send', 'clean', 'review', 'fix', 'quick', 'read'];
      const quickWin = incomplete.find(t =>
        quickKeywords.some(k => t.text.toLowerCase().includes(k)) || t.text.length < 22
      );
      const firstRecommended = quickWin || incomplete[0];
      const secondRecommended = incomplete.find(t => t.id !== firstRecommended.id) || incomplete[1];

      return `Here is my game plan for your ${incomplete.length} tasks, ${userNickname}: 1️⃣ Start with "${firstRecommended.text}" as a fast momentum builder (+1,000 Power). 2️⃣ Immediately roll that energy into "${secondRecommended.text}". Hit "Start Focus" when ready!`;
    }

    // 8. Power level / status check
    if (lowerPrompt.includes('power') || lowerPrompt.includes('score') || lowerPrompt.includes('progress')) {
      const remainingTo9k = Math.max(0, 9000 - powerLevel);
      if (remainingTo9k > 0) {
        const tasksNeeded = Math.ceil(remainingTo9k / 1000);
        return `${userNickname}, your current Power is ${powerLevel.toLocaleString()} (${completed.length} tasks done). Complete ${tasksNeeded} more task${tasksNeeded === 1 ? '' : 's'} to trigger the legendary 9,000 milestone!`;
      }
      return `${persona.over9000Quote(userNickname)} Current Power: ${powerLevel.toLocaleString()}!`;
    }

    // 9. Motivation request
    if (lowerPrompt.includes('motivate') || lowerPrompt.includes('hype') || lowerPrompt.includes('encourage')) {
      const focusQuote =
        persona.workFocusQuotes[
          Math.floor(Math.random() * persona.workFocusQuotes.length)
        ];
      if (incomplete.length > 0) {
        return `${focusQuote} Lock in on "${incomplete[0].text}" for the next ${minsLeft} minutes!`;
      }
      return `${focusQuote} Every single task you complete adds +1,000 Power!`;
    }

    // 10. General conversational reply in character
    if (charBank) {
      return charBank.casualBanter(userNickname, cleanPrompt);
    }

    if (isWork && incomplete.length > 0) {
      return `I hear you, ${userNickname}! Whenever you're ready to focus, I recommend starting with "${incomplete[0].text}". What else is on your mind?`;
    }
    return `Got it, ${userNickname}! I'm here to chat or help you strategize your tasks anytime.`;
  };

  // Optional live Gemini call if VITE_GEMINI_API_KEY is configured
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!envApiKey) {
    return generateSmartPersonaResponse();
  }

  const systemInstructions = `${persona.systemPrompt}
You are ${persona.characterName}, speaking with "${userNickname}" inside Focus Arena (an AI Pomodoro app created by Ammar Akhund).
Current User Power Level: ${powerLevel} (+1,000 per task, major milestone at 9,000).
Current User Tasks: ${tasks.map(t => `[${t.completed ? 'x' : ' '}] ${t.text}`).join(' | ') || 'No tasks added yet.'}
Current Timer State: ${timerState.mode} mode, ${Math.floor(timerState.timeLeft / 60)}:${(timerState.timeLeft % 60).toString().padStart(2, '0')} remaining.
IMPORTANT:
- If the user is chatting casually (e.g., "Hi, how are you?", asking a random question, or making small talk), reply naturally and conversationally in-character as ${persona.characterName} without forcing task talk.
- If the user asks how to start, organize, or prioritize tasks, analyze their actual task list and suggest a smart step-by-step order in-character.
Keep responses concise (1-3 sentences max) and engaging.`;

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
