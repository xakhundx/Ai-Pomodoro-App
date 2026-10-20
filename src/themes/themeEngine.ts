import topArenaBg from '../assets/top_arena.png';
import gokuVegetaOrb from '../assets/goku_vegeta.png';
import twdBg from '../assets/twd_bg.jpg';
import twdOrb from '../assets/twd_orb.jpg';
import cyberpunkBg from '../assets/cyberpunk_bg.jpg';
import cyberpunkOrb from '../assets/cyberpunk_orb.jpg';
import shinobiBg from '../assets/shinobi_bg.jpg';
import shinobiOrb from '../assets/shinobi_orb.jpg';
import fantasyBg from '../assets/fantasy_bg.jpg';
import fantasyOrb from '../assets/fantasy_orb.jpg';

export interface PersonaOption {
  id: string;
  label: string;
  characterName: string;
  systemPrompt: string;
  greeting: (nickname: string) => string;
  taskCompleteQuotes: string[];
  workFocusQuotes: string[];
  breakQuotes: string[];
  over9000Quote: (nickname: string) => string;
}

export interface AchievementMilestone {
  threshold: number;
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  isMajor?: boolean;
}

export interface AppTheme {
  id: string;
  name: string;
  badge: string;
  interestPrompt: string;
  isProCustom?: boolean;
  bgImageUrl?: string;
  orbImageUrl?: string;
  primary: string;
  primaryGlow: string;
  secondary: string;
  accent: string;
  bgOverlay: string;
  bgCssGradient: string;
  coreColor: string;
  coreEmissive: string;
  particleColor: string;
  powerLabel: string;
  personas: PersonaOption[];
  milestones: AchievementMilestone[];
}

export const PRESET_THEMES: Record<string, AppTheme> = {
  dragonball: {
    id: 'dragonball',
    name: 'Dragon Ball Super',
    badge: '🐉 Saiyan Arena',
    interestPrompt: 'Dragon Ball',
    bgImageUrl: topArenaBg,
    orbImageUrl: gokuVegetaOrb,
    primary: '#a855f7',
    primaryGlow: 'rgba(168, 85, 247, 0.65)',
    secondary: '#3b82f6',
    accent: '#38bdf8',
    bgOverlay: 'rgba(8, 16, 40, 0.42)',
    bgCssGradient: 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #090d16 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#3b0764',
    particleColor: '#38bdf8',
    powerLabel: 'POWER LEVEL',
    personas: [
      {
        id: 'Mentor',
        label: 'Whis (Mentor)',
        characterName: 'Whis',
        systemPrompt: '[You are Whis, an elegant, highly intelligent angelic mentor from Dragon Ball Super. Speak calmly, politely, and wisely.]',
        greeting: (name) => `Greetings, ${name}. I am Whis. Shall we begin refining your focus toward Ultra Instinct today?`,
        taskCompleteQuotes: [
          'Magnificent execution. Your movements are becoming much more efficient.',
          'Oh my, another task completed effortlessly. You are one step closer to mastery.',
          'Splendid work! Your ki control is growing remarkably sharp.'
        ],
        workFocusQuotes: [
          'Clear your mind of distractions. True Ultra Instinct requires effortless focus on the task before you.',
          'Pace your energy wisely and strike down your highest-priority task first.'
        ],
        breakQuotes: [
          'Even deities enjoy a fine dessert and a moment of rest. Step away and recharge your spirit.'
        ],
        over9000Quote: (name) => `Oh ho! ${name}, your Power Level has reached 9,000! Even Lord Beerus will take notice of this focus!`
      },
      {
        id: 'Rival',
        label: 'Vegeta (Rival)',
        characterName: 'Vegeta',
        systemPrompt: '[You are Vegeta, Prince of all Saiyans. You are stern, proud, fiercely motivating, and call the user a warrior.]',
        greeting: (name) => `Listen up, ${name}! There is no room for slacking in this training chamber. Show me your Saiyan pride and crush those tasks!`,
        taskCompleteQuotes: [
          'Hmph. Not bad, warrior! Keep pushing past your limits!',
          'That task stood no chance! Do not stop now—there are more battles ahead!',
          'Your power level is rising! Prove you have what it takes to reach the top!'
        ],
        workFocusQuotes: [
          'Stop hesitating and attack your hardest task head-on! A true warrior never backs down!',
          'Lock in! Every second of focus increases your battle power!'
        ],
        breakQuotes: [
          'Recover your stamina quickly, warrior. The next round of training begins soon!'
        ],
        over9000Quote: (name) => `WHAT?! IT'S OVER 9,000?! Impressive, ${name}... you're finally becoming a true elite warrior!`
      },
      {
        id: 'Optimist',
        label: 'Goku (Optimist)',
        characterName: 'Goku',
        systemPrompt: '[You are Goku! You are super energetic, friendly, encouraging, and excited about training and hard work.]',
        greeting: (name) => `Hey ${name}! Ready to train together? Let's knock out these tasks and push past our limits!`,
        taskCompleteQuotes: [
          'Awesome job! You knocked that task right out of the arena!',
          'Whoa, I can feel your energy getting stronger! Let\'s keep going!',
          'Yeah! Another one done! At this rate we\'ll hit 9,000 in no time!'
        ],
        workFocusQuotes: [
          'Let\'s give this focus session everything we\'ve got! Kamehame-FOCUS!',
          'Pick that first task on your list and let\'s tackle it full power!'
        ],
        breakQuotes: [
          'Whew, great training session! Grab some water or a Senzu bean and relax for a bit!'
        ],
        over9000Quote: (name) => `WHOA!! ${name}, your Power Level hit 9,000!! That was incredible—let's go Super Saiyan next!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'dbz-1k', title: 'Ki Awakened!', subtitle: '1,000 Power Level reached — Training has begun!', icon: '✨' },
      { threshold: 3000, id: 'dbz-3k', title: 'Kaio-ken x3 Focus!', subtitle: '3,000 Power Level — Your momentum is surging!', icon: '🔥' },
      { threshold: 5000, id: 'dbz-5k', title: 'Elite Saiyan Warrior', subtitle: '5,000 Power Level — Over halfway to legendary status!', icon: '⚡' },
      { threshold: 9000, id: 'dbz-9k', title: "IT'S OVER 9,000!!", subtitle: '9,000 Power Level Unlocked — Scouters are shattering everywhere!', icon: '💥', isMajor: true },
      { threshold: 15000, id: 'dbz-15k', title: 'Ultra Instinct Master', subtitle: '15,000 Power Level — Unstoppable divine productivity!', icon: '🌌', isMajor: true },
    ]
  },

  walkingdead: {
    id: 'walkingdead',
    name: "The Walking Dead (Survival)",
    badge: '🧟 Apocalypse Survival',
    interestPrompt: "AMC's The Walking Dead",
    bgImageUrl: twdBg,
    orbImageUrl: twdOrb,
    primary: '#dc2626',
    primaryGlow: 'rgba(220, 38, 38, 0.65)',
    secondary: '#d97706',
    accent: '#f59e0b',
    bgOverlay: 'rgba(12, 8, 8, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #3f1d1d 0%, #1c1917 55%, #090707 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#7f1d1d',
    particleColor: '#f59e0b',
    powerLabel: 'SURVIVAL POWER',
    personas: [
      {
        id: 'Mentor',
        label: 'Rick Grimes (Leader)',
        characterName: 'Rick Grimes',
        systemPrompt: '[You are Rick Grimes from AMC\'s The Walking Dead. You are a gritty, determined leader focused on survival, protecting the group, and getting things done.]',
        greeting: (name) => `Stay sharp, ${name}. Out here, every task we finish keeps the camp secure. What are we tackling first?`,
        taskCompleteQuotes: [
          'One less threat to worry about. Good work keeping the perimeter secure.',
          'That\'s how we survive. Stay focused and move to the next objective.',
          'Solid work. We don\'t just survive—we rebuild, one task at a time.'
        ],
        workFocusQuotes: [
          'Keep your eyes open and stay locked in. Clear the most urgent task before the herd gets close.',
          'We do what we have to do to get through this list. Focus up.'
        ],
        breakQuotes: [
          'Stand down for a few minutes and catch your breath. I\'ll take watch while you rest.'
        ],
        over9000Quote: (name) => `9,000 Survival Power, ${name}! We ARE the ones who live! Nothing can stop this camp now!`
      },
      {
        id: 'Rival',
        label: 'Daryl Dixon (Tracker)',
        characterName: 'Daryl Dixon',
        systemPrompt: '[You are Daryl Dixon from The Walking Dead. Tough, concise, loyal, crossbow-sharp focus, no nonsense.]',
        greeting: (name) => `Hey ${name}. Got your back. Let's track down these tasks and take 'em out quietly.`,
        taskCompleteQuotes: [
          'Bullseye. Clean shot right through that task.',
          'Another walker down. Keep moving.',
          'Not bad at all. You\'re built for this world.'
        ],
        workFocusQuotes: [
          'Stay quiet, aim steady, and knock out that top task.',
          'Don\'t waste daylight. Let\'s clear this list.'
        ],
        breakQuotes: [
          'Take five by the campfire. Drink some water before we ride out again.'
        ],
        over9000Quote: (name) => `Damn, ${name}—9,000 Survival Power! Even a whole herd couldn't slow you down now!`
      },
      {
        id: 'Optimist',
        label: 'Carol Peletier (Strategist)',
        characterName: 'Carol Peletier',
        systemPrompt: '[You are Carol Peletier from The Walking Dead. Calm, fiercely resourceful, strategic, and encouraging.]',
        greeting: (name) => `Look at the flowers later, ${name}—right now we have tasks to finish. Ready to handle this cleanly?`,
        taskCompleteQuotes: [
          'Handled cleanly and quietly. +1,000 Survival Power.',
          'You never underestimate a task, and that\'s why you win.',
          'Smart, efficient, and decisive. Let\'s move to the next one.'
        ],
        workFocusQuotes: [
          'Be methodical. Take care of the biggest threat on your list before it grows.',
          'Stay calm and focused—you are much stronger than you think.'
        ],
        breakQuotes: [
          'Rest up for a few minutes. I made sure the camp is safe while you take a break.'
        ],
        over9000Quote: (name) => `9,000 Survival Power, ${name}! You've become an unstoppable survivor!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'twd-1k', title: 'First Walker Down', subtitle: '1,000 Survival Power — You survived your first run!', icon: '🧟' },
      { threshold: 3000, id: 'twd-3k', title: 'Supply Run Veteran', subtitle: '3,000 Survival Power — Scavenging tasks like a pro!', icon: '🏹' },
      { threshold: 5000, id: 'twd-5k', title: 'Safe Zone Commander', subtitle: '5,000 Survival Power — Alexandria looks up to you!', icon: '🛡️' },
      { threshold: 9000, id: 'twd-9k', title: 'OVER 9,000: THE ONES WHO LIVE!', subtitle: '9,000 Survival Power Unlocked — Unstoppable Apocalypse Legend!', icon: '🩸', isMajor: true },
      { threshold: 15000, id: 'twd-15k', title: 'New World Architect', subtitle: '15,000 Survival Power — Rebuilding civilization!', icon: '🔥', isMajor: true },
    ]
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk: Edgerunners',
    badge: '🤖 Night City & Moon',
    interestPrompt: 'Cyberpunk / Sci-Fi',
    bgImageUrl: cyberpunkBg,
    orbImageUrl: cyberpunkOrb,
    primary: '#06b6d4',
    primaryGlow: 'rgba(6, 182, 212, 0.65)',
    secondary: '#ec4899',
    accent: '#facc15',
    bgOverlay: 'rgba(5, 10, 25, 0.42)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #0f172a 0%, #3b0764 55%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#be185d',
    particleColor: '#facc15',
    powerLabel: 'STREET CRED',
    personas: [
      {
        id: 'Mentor',
        label: 'Lucy (Netrunner)',
        characterName: 'Lucy',
        systemPrompt: '[You are Lucy from Cyberpunk: Edgerunners. Cool, sharp, skilled netrunner who dreams of the Moon and guides the user smoothly.]',
        greeting: (name) => `Neural link online, ${name}. Let's dive into the net and clear these tasks—one step closer to the Moon.`,
        taskCompleteQuotes: [
          'Clean breach. +1,000 Street Cred uploaded to your profile.',
          'ICE bypassed effortlessly. You made that task look easy.',
          'Nice work, edgerunner. Keep this pace and we\'ll reach the Moon in no time.'
        ],
        workFocusQuotes: [
          'Isolate the top priority node on your list and dive in.',
          'Keep your cyberware cool and your focus locked on the objective.'
        ],
        breakQuotes: [
          'Jack out for a few minutes and look up at the Earth. Recharge your mind.'
        ],
        over9000Quote: (name) => `9,000 Street Cred, ${name}! We actually made it to the Moon—you're a Night City Legend!`
      },
      {
        id: 'Optimist',
        label: 'David Martinez (Edgerunner)',
        characterName: 'David Martinez',
        systemPrompt: '[You are David Martinez from Cyberpunk: Edgerunners. High-energy, fearless, built different, firing up the Sandevistan to crush tasks.]',
        greeting: (name) => `Yo ${name}! I'm built different, and so are you! Let's fire up the Sandevistan and blitz this task list!`,
        taskCompleteQuotes: [
          'SANDEVISTAN SPEED!! That task didn\'t even see us move! +1,000 Cred!',
          'Preem work, choom! We are flying to the top of Arasaka Tower!',
          'Boom! Another gig cleared! Nothing can slow us down!'
        ],
        workFocusQuotes: [
          'Hit the Sandevistan and zero that first task on your list right now!',
          'Full throttle, choom! Let\'s show Night City what we\'re made of!'
        ],
        breakQuotes: [
          'Whoa, dial back the chrome for a quick break before we go cyberpsycho!'
        ],
        over9000Quote: (name) => `NOVA!! Over 9,000 Street Cred, ${name}!! You really ARE built different!!`
      },
      {
        id: 'Rival',
        label: 'Johnny Silverhand (Rebel)',
        characterName: 'Johnny Silverhand',
        systemPrompt: '[You are Johnny Silverhand from Cyberpunk 2077. Rebellious rockerboy who pushes the user to burn through their tasks.]',
        greeting: (name) => `Wake the hell up, samurai ${name}! We have a to-do list to burn!`,
        taskCompleteQuotes: [
          'Preem work! That task never saw you coming.',
          'Now we\'re talking! Keep that rebel momentum rolling!',
          'Another gig wrapped up clean. Don\'t slow down now!'
        ],
        workFocusQuotes: [
          'Quit stalling and zero that top task on your list!',
          'Turn the volume up and lock into focus mode!'
        ],
        breakQuotes: [
          'Take a breather, samurai. Recharge before the next gig.'
        ],
        over9000Quote: (name) => `PREEM! Over 9,000 Street Cred, ${name}! Night City belongs to you now!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'cp-1k', title: 'First Breach Complete', subtitle: '1,000 Street Cred — Neural link calibrated!', icon: '🔌' },
      { threshold: 3000, id: 'cp-3k', title: 'Sandevistan Overdrive', subtitle: '3,000 Street Cred — Moving faster than time!', icon: '⚡' },
      { threshold: 5000, id: 'cp-5k', title: 'Elite Netrunner', subtitle: '5,000 Street Cred — Zero-latency execution!', icon: '🌐' },
      { threshold: 9000, id: 'cp-9k', title: 'OVER 9,000: EDGERUNNER LEGEND!', subtitle: '9,000 Street Cred Unlocked — From Night City to the Moon!', icon: '🌙', isMajor: true },
      { threshold: 15000, id: 'cp-15k', title: 'Apex Cyber-Deity', subtitle: '15,000 Street Cred — Beyond the Blackwall!', icon: '💎', isMajor: true },
    ]
  },

  shinobi: {
    id: 'shinobi',
    name: 'Shinobi Chakra (Naruto)',
    badge: '🍥 Hidden Leaf',
    interestPrompt: 'Naruto / Shinobi',
    bgImageUrl: shinobiBg,
    orbImageUrl: shinobiOrb,
    primary: '#f97316',
    primaryGlow: 'rgba(249, 115, 22, 0.65)',
    secondary: '#0ea5e9',
    accent: '#fbbf24',
    bgOverlay: 'rgba(15, 23, 42, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #431407 0%, #0f172a 60%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#ea580c',
    particleColor: '#fbbf24',
    powerLabel: 'CHAKRA LEVEL',
    personas: [
      {
        id: 'Mentor',
        label: 'Kakashi (Sensei)',
        characterName: 'Kakashi Sensei',
        systemPrompt: '[You are Kakashi Hatake. Calm, relaxed, observant, and encouraging sensei.]',
        greeting: (name) => `Yo, ${name}. Sorry I'm late—got lost on the path of life. Ready to start your mission tasks?`,
        taskCompleteQuotes: [
          'Nicely done. Your ninja way is really shining through.',
          'Mission accomplished cleanly. +1,000 Chakra earned.',
          'Impressive copy-ninja precision on that task.'
        ],
        workFocusQuotes: [
          'Focus your chakra on one mission at a time. Start with the top scroll.',
          'Stay calm and analytical—even an S-rank task breaks down into simple steps.'
        ],
        breakQuotes: [
          'Mission paused. Good time to read a book and rest your eyes.'
        ],
        over9000Quote: (name) => `Well now, ${name}... 9,000 Chakra Power! You've officially surpassed Jonin level!`
      },
      {
        id: 'Rival',
        label: 'Sasuke (Rival)',
        characterName: 'Sasuke',
        systemPrompt: '[You are Sasuke Uchiha. Focused, intense rival who pushes the user not to fall behind.]',
        greeting: (name) => `Don't fall behind, ${name}. My Sharingan sees every unfinished task on your list.`,
        taskCompleteQuotes: [
          'Hmph. You actually cleared it. Don\'t get complacent.',
          'Sharp execution. Keep that pace if you want to rival me.',
          '+1,000 Chakra. You\'re finally getting serious.'
        ],
        workFocusQuotes: [
          'Eliminate distractions with Chidori precision.',
          'Focus your eyes on the target task and finish it swiftly.'
        ],
        breakQuotes: [
          'Restore your chakra now so you don\'t slow down in the next round.'
        ],
        over9000Quote: (name) => `9,000 Chakra Power... I acknowledge your strength, ${name}!`
      },
      {
        id: 'Optimist',
        label: 'Naruto (Hokage Hype)',
        characterName: 'Naruto',
        systemPrompt: '[You are Naruto Uzumaki! Super enthusiastic, never gives up, says Believe it!]',
        greeting: (name) => `Alright ${name}! Let's crush every single mission on this list—believe it!`,
        taskCompleteQuotes: [
          'RASENGAN!! That task is totally done! +1,000 Chakra!',
          'Awesome job! That\'s how a future Hokage gets things done!',
          'Heck yeah! We never go back on our word!'
        ],
        workFocusQuotes: [
          'Shadow Clone Focus Mode! Let\'s give this timer 100%!',
          'Never give up! Pick that task and charge right in!'
        ],
        breakQuotes: [
          'Ichiraku Ramen break time! Rest up so we can go Sage Mode next!'
        ],
        over9000Quote: (name) => `BELIEVE IT!! ${name} just hit 9,000 Chakra Power!! You're Hokage level now!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'nin-1k', title: 'Genin Mission Cleared', subtitle: '1,000 Chakra Level — Your ninja path begins!', icon: '🍃' },
      { threshold: 3000, id: 'nin-3k', title: 'Chunin Exam Champion', subtitle: '3,000 Chakra Level — Tactical focus unlocked!', icon: '⚡' },
      { threshold: 5000, id: 'nin-5k', title: 'Sage Mode Awakened', subtitle: '5,000 Chakra Level — Nature energy flowing!', icon: '🐸' },
      { threshold: 9000, id: 'nin-9k', title: 'OVER 9,000: HOKAGE OF FOCUS!', subtitle: '9,000 Chakra Level Unlocked — Supreme Shinobi Legend!', icon: '🍥', isMajor: true },
      { threshold: 15000, id: 'nin-15k', title: 'Six Paths Mastery', subtitle: '15,000 Chakra Level — Legendary Shinobi God!', icon: '🔥', isMajor: true },
    ]
  },

  fantasy: {
    id: 'fantasy',
    name: 'Dark Fantasy (Elden Ring)',
    badge: '⚔️ Lands Between',
    interestPrompt: 'Dark Fantasy / RPG',
    bgImageUrl: fantasyBg,
    orbImageUrl: fantasyOrb,
    primary: '#eab308',
    primaryGlow: 'rgba(234, 179, 8, 0.65)',
    secondary: '#9333ea',
    accent: '#fde047',
    bgOverlay: 'rgba(12, 10, 20, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #422006 0%, #1e1b4b 55%, #09090b 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#7e22ce',
    particleColor: '#fde047',
    powerLabel: 'RUNE POWER',
    personas: [
      {
        id: 'Mentor',
        label: 'Ranni (Lunar Witch)',
        characterName: 'Ranni the Witch',
        systemPrompt: '[You are Ranni the Witch from Elden Ring. Mysterious, regal, wise, guiding the user under the stars and Golden Order.]',
        greeting: (name) => `Greetings, Tarnished ${name}. Let us turn your completed quests into strength and Rune Power.`,
        taskCompleteQuotes: [
          'The stars align in your favor. +1,000 Runes granted.',
          'Another trial conquered. Your resolve shines like moonlight.',
          'Well fought. The path to the throne clears before you.'
        ],
        workFocusQuotes: [
          'Follow the guidance of grace and strike down your foremost quest.',
          'Steadfast focus will fell even the mightiest boss task.'
        ],
        breakQuotes: [
          'Rest now at the Site of Grace. Restore your flasks before riding onward.'
        ],
        over9000Quote: (name) => `Behold, ${name}! 9,000 Rune Power achieved! You are truly worthy of the Age of the Stars!`
      },
      {
        id: 'Rival',
        label: 'Radahn (Starscourge)',
        characterName: 'General Radahn',
        systemPrompt: '[You are General Radahn, mighty fantasy warlord challenging the user to conquer every quest with honor.]',
        greeting: (name) => `Raise your banner, ${name}! Today we conquer every quest on your scroll!`,
        taskCompleteQuotes: [
          'A glorious strike! That quest has fallen!',
          '+1,000 Runes! Worthy of a true champion!',
          'Press the attack! Victory favors the relentless!'
        ],
        workFocusQuotes: [
          'Charge into the fray and vanquish your hardest task!',
          'Hold the line until the hourglass runs dry!'
        ],
        breakQuotes: [
          'Sheathe your blade and feast briefly, warrior.'
        ],
        over9000Quote: (name) => `BY THE STARS! 9,000 Rune Power, ${name}! Even the heavens bow to your might!`
      },
      {
        id: 'Optimist',
        label: 'Solaire (Jolly Co-op)',
        characterName: 'Solaire',
        systemPrompt: '[You are a joyful knight of sunlight celebrating jolly cooperation and radiant focus.]',
        greeting: (name) => `Praise the Sun, ${name}! Ready for some jolly cooperation on your tasks today?`,
        taskCompleteQuotes: [
          'Grossly incandescent work! +1,000 Runes!',
          'Hah! Another quest completed in glorious fashion!',
          'Your focus shines like the very sun itself!'
        ],
        workFocusQuotes: [
          'Let us engage in jolly focus! Together, no task is too dark!',
          'Shine bright and tackle that next quest!'
        ],
        breakQuotes: [
          'A warm toast and a moment of rest by the bonfire!'
        ],
        over9000Quote: (name) => `PRAISE THE SUN!! ${name} has reached 9,000 Rune Power!! Truly incandescent!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'rpg-1k', title: 'First Boss Felled', subtitle: '1,000 Rune Power — Grace guides your steps!', icon: '🗡️' },
      { threshold: 3000, id: 'rpg-3k', title: 'Shardbearer', subtitle: '3,000 Rune Power — Great Rune of Focus claimed!', icon: '🛡️' },
      { threshold: 5000, id: 'rpg-5k', title: 'Roundtable Champion', subtitle: '5,000 Rune Power — Renowned across the realm!', icon: '👑' },
      { threshold: 9000, id: 'rpg-9k', title: 'OVER 9,000: ELDEN LORD OF FOCUS!', subtitle: '9,000 Rune Power Unlocked — Sovereign of Productivity!', icon: '⚔️', isMajor: true },
      { threshold: 15000, id: 'rpg-15k', title: 'Age of the Stars', subtitle: '15,000 Rune Power — Ascended Mythic Legend!', icon: '🌟', isMajor: true },
    ]
  }
};

interface CustomUniverseKnowledge {
  title: string;
  badge: string;
  powerLabel: string;
  primary: string;
  secondary: string;
  accent: string;
  bgPrompt: string;
  orbPrompt: string;
  characters: [
    { name: string; role: string; quote: string },
    { name: string; role: string; quote: string },
    { name: string; role: string; quote: string }
  ];
}

function getUniverseKnowledge(input: string): CustomUniverseKnowledge {
  const lower = input.toLowerCase();

  if (lower.includes('black clover') || lower.includes('asta') || lower.includes('yuno') || lower.includes('yami')) {
    return {
      title: 'Black Clover: Magic Knights',
      badge: '🍀 Clover Kingdom',
      powerLabel: 'MAGIC POWER',
      primary: '#dc2626',
      secondary: '#10b981',
      accent: '#facc15',
      bgPrompt: '4k anime landscape of Clover Kingdom royal capital castle and giant skull in Hage village at dramatic twilight, glowing grimoire magic particles, cinematic masterpiece, no text',
      orbPrompt: 'high detail anime illustration of Asta with black anti-magic demon sword and Yuno with emerald wind spirit magic standing side by side, circular aura for 3D orb, no text',
      characters: [
        { name: 'Captain Yami', role: 'Mentor', quote: 'Push past your limits right here, right now!' },
        { name: 'Yuno', role: 'Rival', quote: 'I will become the Wizard King—try not to fall behind!' },
        { name: 'Asta', role: 'Optimist', quote: 'My magic is NEVER GIVING UP!! Let\'s smash this task!' },
      ],
    };
  }

  if (lower.includes('last of us') || lower.includes('tlou') || lower.includes('joel') || lower.includes('ellie')) {
    return {
      title: 'The Last of Us (Fireflies)',
      badge: '🌿 Firefly Survival',
      powerLabel: 'SURVIVAL RATING',
      primary: '#16a34a',
      secondary: '#ca8a04',
      accent: '#fde047',
      bgPrompt: '4k cinematic overgrown post-apocalyptic city skyline reclaimed by lush green nature and golden sunlight, giraffes in distance, The Last of Us concept art, no text',
      orbPrompt: 'cinematic illustration of rugged bearded survivor man Joel and young survivor girl Ellie with bow and guitar standing together in golden spore light, centered circular composition, no text',
      characters: [
        { name: 'Joel Miller', role: 'Protector', quote: 'Endure and survive. Keep your focus steady on the next objective.' },
        { name: 'Tess', role: 'Strategist', quote: 'Stick to the plan and clear the path ahead.' },
        { name: 'Ellie', role: 'Survivor', quote: 'Look for the light—another task down!' },
      ],
    };
  }

  if (lower.includes('one piece') || lower.includes('luffy') || lower.includes('zoro')) {
    return {
      title: 'One Piece: Grand Line',
      badge: '🏴‍☠️ Straw Hat Crew',
      powerLabel: 'BOUNTY LEVEL',
      primary: '#ef4444',
      secondary: '#f59e0b',
      accent: '#38bdf8',
      bgPrompt: '4k anime illustration of Thousand Sunny pirate ship sailing across glowing Wano Country cherry blossom ocean at sunset, epic clouds, no text',
      orbPrompt: 'high detail anime art of Gear 5 Luffy with white clouds and Roronoa Zoro with three green Haki swords side by side, circular energy vortex, no text',
      characters: [
        { name: 'Shanks', role: 'Mentor', quote: 'Bet your focus on the new era and stay calm under pressure!' },
        { name: 'Roronoa Zoro', role: 'Rival', quote: 'Nothing happened... except another task sliced in half!' },
        { name: 'Monkey D. Luffy', role: 'Captain', quote: 'GEAR FIFTH!! I\'m gonna be King of Productivity!' },
      ],
    };
  }

  if (lower.includes('jujutsu') || lower.includes('jjk') || lower.includes('gojo') || lower.includes('sukuna')) {
    return {
      title: 'Jujutsu Kaisen: Domain Expansion',
      badge: '🤞 Infinite Void',
      powerLabel: 'CURSED ENERGY',
      primary: '#3b82f6',
      secondary: '#e11d48',
      accent: '#a855f7',
      bgPrompt: '4k anime background of Infinite Void cosmic domain expansion colliding with Malevolent Shrine under a neon Tokyo night sky, no text',
      orbPrompt: 'high detail anime illustration of Satoru Gojo with glowing six eyes Hollow Purple and Sukuna with crimson flames side by side, circular composition, no text',
      characters: [
        { name: 'Satoru Gojo', role: 'Special Grade', quote: 'Throughout Heaven and Earth, you alone are the focused one!' },
        { name: 'Ryomen Sukuna', role: 'King of Curses', quote: 'Stand proud—you cleaved that task in two!' },
        { name: 'Yuji Itadori', role: 'Black Flash', quote: 'BLACK FLASH!! +1,000 Cursed Energy locked in!' },
      ],
    };
  }

  if (lower.includes('solo leveling') || lower.includes('jin-woo') || lower.includes('jinwoo')) {
    return {
      title: 'Solo Leveling: Shadow Monarch',
      badge: '🗡️ Arise',
      powerLabel: 'HUNTER RANK XP',
      primary: '#7c3aed',
      primaryGlow: 'rgba(124, 58, 237, 0.65)',
      secondary: '#2563eb',
      accent: '#38bdf8',
      bgPrompt: '4k anime dark fantasy dungeon throne room glowing with violet shadow monarch aura and blue system windows, Solo Leveling style, no text',
      orbPrompt: 'high detail anime illustration of Sung Jin-Woo with glowing purple daggers and shadow knight Igris behind him, circular aura, no text',
      characters: [
        { name: 'Sung Jin-Woo', role: 'Monarch', quote: 'ARISE. Another quest cleared for the Shadow Army.' },
        { name: 'Igris', role: 'Commander', quote: 'My liege, the target objective has been vanquished.' },
        { name: 'Beru', role: 'General', quote: 'KIEEEEEK! None can rival your productivity, my King!' },
      ] as any,
    };
  }

  if (lower.includes('attack on titan') || lower.includes('aot') || lower.includes('levi') || lower.includes('eren')) {
    return {
      title: 'Attack on Titan: Survey Corps',
      badge: '⚔️ Wings of Freedom',
      powerLabel: 'CORPS HONOR',
      primary: '#10b981',
      secondary: '#dc2626',
      accent: '#f59e0b',
      bgPrompt: '4k anime landscape of Wall Maria and Shiganshina district at dramatic golden sunset with Survey Corps green flares in sky, no text',
      orbPrompt: 'high detail anime illustration of Captain Levi Ackerman with ODM blades and Eren Yeager with glowing green eyes side by side, circular frame, no text',
      characters: [
        { name: 'Captain Levi', role: 'Captain', quote: 'Make a choice you won\'t regret—finish that task cleanly.' },
        { name: 'Eren Yeager', role: 'Vanguard', quote: 'Keep moving forward until every task is destroyed!' },
        { name: 'Erwin Smith', role: 'Commander', quote: 'SHINZOU WO SASAGEYO! Dedicate your heart to this focus session!' },
      ],
    };
  }

  // Generic intelligent universe builder for ANY custom prompt!
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const secondaryHue = (hue + 50) % 360;
  const accentHue = (hue + 150) % 360;
  const displayTitle = input.charAt(0).toUpperCase() + input.slice(1);

  return {
    title: `${displayTitle} Universe`,
    badge: `✨ ${displayTitle}`,
    powerLabel: `${displayTitle.toUpperCase()} POWER`,
    primary: `hsl(${hue}, 82%, 58%)`,
    secondary: `hsl(${secondaryHue}, 80%, 52%)`,
    accent: `hsl(${accentHue}, 85%, 60%)`,
    bgPrompt: `ultra detailed 4k cinematic widescreen environment background inspired by ${displayTitle}, epic lighting, atmospheric depth, masterpiece concept art, no text`,
    orbPrompt: `high detail iconic main characters and heroes from ${displayTitle} standing side by side surrounded by glowing energy aura, centered circular composition for 3D orb, masterpiece, no text`,
    characters: [
      { name: `${displayTitle} Grandmaster`, role: 'Mentor', quote: `Masterful execution in true ${displayTitle} style!` },
      { name: `${displayTitle} Rival`, role: 'Rival', quote: `Push harder—show your true ${displayTitle} power!` },
      { name: `${displayTitle} Champion`, role: 'Optimist', quote: `Phenomenal work! Your ${displayTitle} streak is unstoppable!` },
    ],
  };
}

export function resolveThemeFromPrompt(rawPrompt: string): AppTheme {
  const input = (rawPrompt || '').trim();
  const lower = input.toLowerCase();

  if (!input || lower === 'dragon ball' || lower === 'dbz' || lower === 'dragonball') {
    return PRESET_THEMES.dragonball;
  }

  if (
    lower === "amc's the walking dead" ||
    lower === 'the walking dead' ||
    lower === 'walking dead' ||
    lower === 'twd'
  ) {
    return PRESET_THEMES.walkingdead;
  }

  if (
    lower === 'cyberpunk / sci-fi' ||
    lower === 'cyberpunk' ||
    lower === 'cyberpunk: edgerunners' ||
    lower === 'cyberpunk 2077'
  ) {
    return PRESET_THEMES.cyberpunk;
  }

  if (lower === 'naruto / shinobi' || lower === 'naruto' || lower === 'shinobi') {
    return PRESET_THEMES.shinobi;
  }

  if (lower === 'dark fantasy / rpg' || lower === 'elden ring' || lower === 'dark fantasy') {
    return PRESET_THEMES.fantasy;
  }

  // Dynamic Custom AI Theme Generation for ANY custom user prompt!
  const lore = getUniverseKnowledge(input);
  const seed = Math.abs(
    input.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  );

  const dynamicBgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    lore.bgPrompt
  )}?width=1920&height=1080&seed=${seed}&nologo=true`;

  const dynamicOrbUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    lore.orbPrompt
  )}?width=1024&height=1024&seed=${seed + 7}&nologo=true`;

  const displayTitle = input.charAt(0).toUpperCase() + input.slice(1);

  return {
    id: `custom-${lower.replace(/[^a-z0-9]/g, '-')}`,
    name: lore.title,
    badge: lore.badge,
    interestPrompt: input,
    isProCustom: true,
    bgImageUrl: dynamicBgUrl,
    orbImageUrl: dynamicOrbUrl,
    primary: lore.primary,
    primaryGlow: lore.primary.startsWith('hsl')
      ? lore.primary.replace('hsl(', 'hsla(').replace(')', ', 0.65)')
      : 'rgba(168, 85, 247, 0.65)',
    secondary: lore.secondary,
    accent: lore.accent,
    bgOverlay: 'rgba(10, 14, 28, 0.46)',
    bgCssGradient: `radial-gradient(circle at 50% 25%, #1e1b4b 0%, #05070f 100%)`,
    coreColor: lore.primary,
    coreEmissive: lore.secondary,
    particleColor: lore.accent,
    powerLabel: lore.powerLabel,
    personas: lore.characters.map((char, idx) => ({
      id: idx === 0 ? 'Mentor' : idx === 1 ? 'Rival' : 'Optimist',
      label: `${char.name} (${char.role})`,
      characterName: char.name,
      systemPrompt: `[You are ${char.name} from ${displayTitle}. Speak authentically in character and motivate the user!]`,
      greeting: (name) => `Welcome to ${lore.title}, ${name}! I am ${char.name}. Ready to conquer your tasks today?`,
      taskCompleteQuotes: [
        `${char.quote} (+1,000 ${lore.powerLabel})`,
        `Outstanding execution! Your ${lore.powerLabel} is surging!`,
        `Another objective cleared in true ${displayTitle} fashion!`,
      ],
      workFocusQuotes: [
        `${char.quote} Lock in on your top priority task!`,
        `Channel the spirit of ${displayTitle}—every completed task awards +1,000 Power!`,
      ],
      breakQuotes: [
        `Well earned rest! Recharge your energy before the next round in ${lore.title}.`,
      ],
      over9000Quote: (name) =>
        `UNBELIEVABLE, ${name}!! You've surpassed 9,000 ${lore.powerLabel} in ${lore.title}!!`,
    })),
    milestones: [
      { threshold: 1000, id: `cust-${seed}-1k`, title: `${displayTitle} Awakened`, subtitle: `1,000 ${lore.powerLabel} — First mission cleared!`, icon: '🌟' },
      { threshold: 3000, id: `cust-${seed}-3k`, title: `Rising ${displayTitle} Star`, subtitle: `3,000 ${lore.powerLabel} — Momentum surging!`, icon: '🔥' },
      { threshold: 5000, id: `cust-${seed}-5k`, title: `${displayTitle} Vanguard`, subtitle: `5,000 ${lore.powerLabel} — Over halfway to 9,000!`, icon: '⚡' },
      { threshold: 9000, id: `cust-${seed}-9k`, title: `OVER 9,000 ${lore.powerLabel}!`, subtitle: `9,000 ${lore.powerLabel} Unlocked — Supreme ${displayTitle} Legend!`, icon: '🏆', isMajor: true },
      { threshold: 15000, id: `cust-${seed}-15k`, title: `Mythic Icon of ${displayTitle}`, subtitle: `15,000 ${lore.powerLabel} — Unstoppable Mastery!`, icon: '👑', isMajor: true },
    ],
  };
}
