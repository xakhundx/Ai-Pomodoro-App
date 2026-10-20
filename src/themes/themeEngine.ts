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
import onepieceBg from '../assets/onepiece_bg.jpg';
import onepieceOrb from '../assets/onepiece_orb.jpg';
import blackcloverBg from '../assets/blackclover_bg.jpg';
import blackcloverOrb from '../assets/blackclover_orb.jpg';

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

  onepiece: {
    id: 'onepiece',
    name: 'One Piece: Grand Line',
    badge: '🏴‍☠️ Straw Hat Crew',
    interestPrompt: 'One Piece',
    bgImageUrl: onepieceBg,
    orbImageUrl: onepieceOrb,
    primary: '#ef4444',
    primaryGlow: 'rgba(239, 68, 68, 0.65)',
    secondary: '#f59e0b',
    accent: '#38bdf8',
    bgOverlay: 'rgba(10, 15, 30, 0.42)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #450a0a 0%, #0f172a 60%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#b91c1c',
    particleColor: '#facc15',
    powerLabel: 'BOUNTY LEVEL',
    personas: [
      {
        id: 'Mentor',
        label: 'Shanks (Emperor Mentor)',
        characterName: 'Shanks',
        systemPrompt: '[You are Red-Haired Shanks from One Piece. Calm, legendary Yonko captain who inspires the user with Conqueror\'s Haki confidence.]',
        greeting: (name) => `Ahoy, ${name}! The Thousand Sunny is ready to sail. Let's conquer these tasks and raise your Bounty across the Grand Line!`,
        taskCompleteQuotes: [
          'Conqueror\'s Haki level focus! +1,000 Berry Bounty added to your name!',
          'Haha! Smooth sailing through that task! Keep your eyes on the horizon!',
          'A true pirate captain handles every challenge with a smile!'
        ],
        workFocusQuotes: [
          'Unleash your Conqueror\'s Haki and knock out that top task on the deck!',
          'Bet your focus on this session—nothing on the Grand Line can stop you!'
        ],
        breakQuotes: [
          'Drop anchor and enjoy a banquet with the crew! Rest up before the next island!'
        ],
        over9000Quote: (name) => `DAHAHAHA!! ${name}, your Bounty just surpassed 9,000!! You're officially an Emperor of the Sea!!`
      },
      {
        id: 'Rival',
        label: 'Roronoa Zoro (First Mate)',
        characterName: 'Roronoa Zoro',
        systemPrompt: '[You are Roronoa Zoro from One Piece. Stoic, fiercely disciplined, three-sword style master who slices through tasks.]',
        greeting: (name) => `Don't get lost, ${name}. Draw your blades—we're slicing through every task on this list.`,
        taskCompleteQuotes: [
          'Three-Sword Style: Onigiri! That task is sliced clean in half!',
          'Hmph. Nothing happened... just +1,000 Bounty earned.',
          'Keep training. You can\'t become the world\'s greatest if you stop here.'
        ],
        workFocusQuotes: [
          'Focus your Armament Haki and cut down the hardest task first.',
          'No excuses. A true swordsman never backs down from a challenge.'
        ],
        breakQuotes: [
          'Sheathe your swords and take a quick nap on the deck.'
        ],
        over9000Quote: (name) => `9,000 Bounty Level, ${name}... Not bad at all, Captain!`
      },
      {
        id: 'Optimist',
        label: 'Monkey D. Luffy (Gear 5)',
        characterName: 'Monkey D. Luffy',
        systemPrompt: '[You are Monkey D. Luffy in Gear 5! Joyful, limitless energy, drums of liberation beating, excited to become King of the Pirates!]',
        greeting: (name) => `SHISHISHI! Hey ${name}! Can you hear the Drums of Liberation?! Let's go Gear 5 on these tasks!`,
        taskCompleteQuotes: [
          'GOMU GOMU NO BAJRANG FOCUS!! +1,000 Bounty!!',
          'SHISHISHI! That task went flying across the Grand Line!',
          'Awesome job! Sanji\'s cooking meat for us when we hit 9,000!'
        ],
        workFocusQuotes: [
          'GEAR FIFTH!! Let\'s bounce right into that first task full speed!',
          'I\'m gonna be King of the Pirates, and you\'re gonna crush this timer!'
        ],
        breakQuotes: [
          'MEAT BREAK!! Stretch out and grab a snack before we set sail again!'
        ],
        over9000Quote: (name) => `SHISHISHI!! ${name} HIT 9,000 BOUNTY!! THE ONE PIECE IS REAL!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'op-1k', title: 'East Blue Rookie', subtitle: '1,000 Bounty — Your pirate flag is raised!', icon: '🏴‍☠️' },
      { threshold: 3000, id: 'op-3k', title: 'Supernova of the Worst Generation', subtitle: '3,000 Bounty — Entering the Grand Line!', icon: '⚓' },
      { threshold: 5000, id: 'op-5k', title: 'Conqueror\'s Haki Awakened', subtitle: '5,000 Bounty — New World Warlord status!', icon: '⚡' },
      { threshold: 9000, id: 'op-9k', title: 'OVER 9,000: EMPEROR OF THE SEA!', subtitle: '9,000 Bounty Unlocked — Gear 5 Drums of Liberation!', icon: '👑', isMajor: true },
      { threshold: 15000, id: 'op-15k', title: 'King of the Pirates', subtitle: '15,000 Bounty — You conquered Laugh Tale!', icon: '☀️', isMajor: true },
    ]
  },

  blackclover: {
    id: 'blackclover',
    name: 'Black Clover: Magic Knights',
    badge: '🍀 Clover Kingdom',
    interestPrompt: 'Black Clover',
    bgImageUrl: blackcloverBg,
    orbImageUrl: blackcloverOrb,
    primary: '#dc2626',
    primaryGlow: 'rgba(220, 38, 38, 0.65)',
    secondary: '#10b981',
    accent: '#facc15',
    bgOverlay: 'rgba(10, 12, 24, 0.44)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #3f1d1d 0%, #064e3b 55%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#991b1b',
    particleColor: '#10b981',
    powerLabel: 'MAGIC KNIGHT STARS',
    personas: [
      {
        id: 'Mentor',
        label: 'Captain Yami (Black Bulls)',
        characterName: 'Captain Yami',
        systemPrompt: '[You are Captain Yami Sukehiro of the Black Bulls from Black Clover. Tough, gruff, dark magic master who tells the user to surpass their limits right here, right now!]',
        greeting: (name) => `Listen up, ${name}! Welcome to the Black Bulls hideout. Time to surpass your limits right here, right now!`,
        taskCompleteQuotes: [
          'Dark Magic: Dimension Slash! That task is cut in two! +1,000 Merit!',
          'Hah! Looks like you\'re finally surpassing your limits, kid!',
          'Not bad! Keep earning those Magic Knight Stars!'
        ],
        workFocusQuotes: [
          'Stop overthinking and slash through your top task right here, right now!',
          'Focus your Ki and strike before the timer runs out!'
        ],
        breakQuotes: [
          'Take five, kid. Even a Magic Knight Captain needs a break.'
        ],
        over9000Quote: (name) => `BAHAHA! 9,000 Magic Power, ${name}! You just surpassed every Captain in the Clover Kingdom!`
      },
      {
        id: 'Rival',
        label: 'Yuno (Spirit Dive Rival)',
        characterName: 'Yuno',
        systemPrompt: '[You are Yuno Grinberryall from Black Clover. Calm, prodigy wind mage and rival who vows to become Wizard King.]',
        greeting: (name) => `Don't fall behind, ${name}. Remember our promise—let's see who becomes Wizard King first.`,
        taskCompleteQuotes: [
          'Spirit of Zephyr! Clean and effortless task completion.',
          '+1,000 Magic Power. Expected nothing less from my rival.',
          'Keep going. The path to Wizard King is just beginning.'
        ],
        workFocusQuotes: [
          'Let the four-leaf wind guide your focus through this session.',
          'Tackle the hardest mission on your grimoire first.'
        ],
        breakQuotes: [
          'Rest your mana briefly so your next spell is at full power.'
        ],
        over9000Quote: (name) => `Impressive, ${name}... 9,000 Magic Power! You truly are my greatest rival!`
      },
      {
        id: 'Optimist',
        label: 'Asta (Anti-Magic Hype)',
        characterName: 'Asta',
        systemPrompt: '[You are Asta from Black Clover! Loud, unstoppable determination, wielding Anti-Magic swords, shouting that your magic is never giving up!]',
        greeting: (name) => ` NOT DONE YET!! Hey ${name}, my magic is NEVER GIVING UP—let's smash every task on this list!!`,
        taskCompleteQuotes: [
          'BLACK DIVIDER!! That task is completely negated! +1,000 Power!',
          'WOOOAH!! Another mission cleared! Wizard King, here we come!',
          'NEVER GIVE UP!! Keep that Black Asta energy burning!'
        ],
        workFocusQuotes: [
          'Draw the Demon-Slayer Sword and charge straight at your first task!',
          'Even without magic, hard work and focus beat everything!'
        ],
        breakQuotes: [
          'Phew! Time for some Tatoe potatoes and a quick rest!'
        ],
        over9000Quote: (name) => `YEAAAAH!! ${name} HIT 9,000 POWER!! WE'RE BECOMING THE WIZARD KING!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'bc-1k', title: 'Five-Leaf Grimoire Awakened', subtitle: '1,000 Magic Power — Anti-Magic flows through you!', icon: '🍀' },
      { threshold: 3000, id: 'bc-3k', title: 'Royal Knights Selection', subtitle: '3,000 Magic Power — Elite squad recognition!', icon: '⚔️' },
      { threshold: 5000, id: 'bc-5k', title: 'Devil Union / Spirit Dive', subtitle: '5,000 Magic Power — Surpassing your limits!', icon: '🔥' },
      { threshold: 9000, id: 'bc-9k', title: 'OVER 9,000: WIZARD KING OF FOCUS!', subtitle: '9,000 Magic Power Unlocked — Supreme Protector of Clover Kingdom!', icon: '👑', isMajor: true },
      { threshold: 15000, id: 'bc-15k', title: 'Arcane Stage Legend', subtitle: '15,000 Magic Power — Unmatched across all kingdoms!', icon: '✨', isMajor: true },
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

export function resolveThemeFromPrompt(rawPrompt: string): AppTheme {
  const input = (rawPrompt || '').trim();
  const lower = input.toLowerCase();

  if (!input || lower.includes('dragon') || lower.includes('dbz') || lower.includes('goku') || lower.includes('vegeta') || lower.includes('saiyan') || lower.includes('whis')) {
    return PRESET_THEMES.dragonball;
  }

  if (lower.includes('one piece') || lower.includes('luffy') || lower.includes('zoro') || lower.includes('straw hat') || lower.includes('shanks')) {
    return PRESET_THEMES.onepiece;
  }

  if (lower.includes('black clover') || lower.includes('asta') || lower.includes('yuno') || lower.includes('yami')) {
    return PRESET_THEMES.blackclover;
  }

  if (
    lower.includes('walking dead') ||
    lower.includes('twd') ||
    lower.includes('amc') ||
    lower.includes('zombie') ||
    lower.includes('apocalypse') ||
    lower.includes('rick') ||
    lower.includes('daryl') ||
    lower.includes('carol') ||
    lower.includes('last of us') ||
    lower.includes('tlou') ||
    lower.includes('joel') ||
    lower.includes('ellie')
  ) {
    if (lower.includes('last of us') || lower.includes('tlou') || lower.includes('joel') || lower.includes('ellie')) {
      return {
        ...PRESET_THEMES.walkingdead,
        id: 'lastofus',
        name: 'The Last of Us (Fireflies)',
        badge: '🌿 Firefly Survival',
        interestPrompt: input,
        primary: '#16a34a',
        primaryGlow: 'rgba(22, 163, 74, 0.65)',
        secondary: '#ca8a04',
        accent: '#fde047',
        personas: [
          {
            ...PRESET_THEMES.walkingdead.personas[0],
            label: 'Joel Miller (Protector)',
            characterName: 'Joel Miller',
            greeting: (name) => `Endure and survive, ${name}. Let's get through these tasks one step at a time.`,
          },
          {
            ...PRESET_THEMES.walkingdead.personas[1],
            label: 'Tommy Miller (Sniper)',
            characterName: 'Tommy Miller',
            greeting: (name) => `Eyes on the target, ${name}. Let's clear this perimeter.`,
          },
          {
            ...PRESET_THEMES.walkingdead.personas[2],
            label: 'Ellie (Firefly Survivor)',
            characterName: 'Ellie',
            greeting: (name) => `Look for the light, ${name}! Ready to knock out these tasks?`,
          },
        ],
      };
    }
    return PRESET_THEMES.walkingdead;
  }

  if (
    lower.includes('cyber') ||
    lower.includes('edgerunner') ||
    lower.includes('2077') ||
    lower.includes('lucy') ||
    lower.includes('david') ||
    lower.includes('sci-fi') ||
    lower.includes('scifi')
  ) {
    return PRESET_THEMES.cyberpunk;
  }

  if (
    lower.includes('naruto') ||
    lower.includes('shinobi') ||
    lower.includes('ninja') ||
    lower.includes('kakashi') ||
    lower.includes('sasuke')
  ) {
    return PRESET_THEMES.shinobi;
  }

  if (
    lower.includes('elden') ||
    lower.includes('fantasy') ||
    lower.includes('dark souls') ||
    lower.includes('ranni') ||
    lower.includes('radahn')
  ) {
    return PRESET_THEMES.fantasy;
  }

  // Dynamic Custom Theme base (enriched asynchronously by Jikan/TVMaze live artwork fetcher!)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const secondaryHue = (hue + 48) % 360;
  const accentHue = (hue + 150) % 360;

  const primary = `hsl(${hue}, 82%, 58%)`;
  const primaryGlow = `hsla(${hue}, 82%, 58%, 0.65)`;
  const secondary = `hsl(${secondaryHue}, 80%, 52%)`;
  const accent = `hsl(${accentHue}, 85%, 60%)`;
  const displayTitle = input.charAt(0).toUpperCase() + input.slice(1);

  const bgPairs = [
    { bg: topArenaBg, orb: gokuVegetaOrb },
    { bg: onepieceBg, orb: onepieceOrb },
    { bg: blackcloverBg, orb: blackcloverOrb },
    { bg: shinobiBg, orb: shinobiOrb },
    { bg: fantasyBg, orb: fantasyOrb },
    { bg: cyberpunkBg, orb: cyberpunkOrb },
  ];
  const fallbackPair = bgPairs[Math.abs(hash) % bgPairs.length];

  return {
    id: `custom-${lower.replace(/[^a-z0-9]/g, '-')}`,
    name: `${displayTitle} World`,
    badge: `✨ ${displayTitle}`,
    interestPrompt: input,
    isProCustom: true,
    bgImageUrl: fallbackPair.bg,
    orbImageUrl: fallbackPair.orb,
    primary,
    primaryGlow,
    secondary,
    accent,
    bgOverlay: 'rgba(10, 14, 28, 0.45)',
    bgCssGradient: `radial-gradient(circle at 50% 25%, hsl(${hue}, 55%, 18%) 0%, hsl(${secondaryHue}, 45%, 10%) 60%, #05070f 100%)`,
    coreColor: primary,
    coreEmissive: secondary,
    particleColor: accent,
    powerLabel: `${displayTitle.toUpperCase()} POWER`,
    personas: [
      {
        id: 'Mentor',
        label: `${displayTitle} Mentor`,
        characterName: `${displayTitle} Mentor`,
        systemPrompt: `[You are the wise mentor from "${displayTitle}". Speak authentically in-universe and motivate the user!]`,
        greeting: (name) => `Welcome to ${displayTitle}, ${name}! Ready to conquer your tasks today?`,
        taskCompleteQuotes: [
          `Masterful execution! +1,000 ${displayTitle} Power added to your rank!`,
          `Another task cleared in true ${displayTitle} style!`,
          `Outstanding focus. Your momentum is unstoppable.`
        ],
        workFocusQuotes: [
          `Channel the spirit of ${displayTitle} and tackle your top priority task first.`,
          `Stay locked in—every completed task awards +1,000 Power!`
        ],
        breakQuotes: [
          `Well earned rest! Recharge before the next round in ${displayTitle}.`
        ],
        over9000Quote: (name) => `INCREDIBLE, ${name}! You've reached 9,000 ${displayTitle} Power—true legend status unlocked!`
      },
      {
        id: 'Rival',
        label: `${displayTitle} Rival`,
        characterName: `${displayTitle} Rival`,
        systemPrompt: `[You are the fierce rival from "${displayTitle}". Push the user to work harder and reach 9,000 power.]`,
        greeting: (name) => `Don't fall behind, ${name}! Let's see how fast you can clear this ${displayTitle} task list!`,
        taskCompleteQuotes: [
          `Not bad! +1,000 Power—keep pushing until you hit 9,000!`,
          `That task is history! Who's next on the list?`,
          `Strong move! Don't let your guard down now!`
        ],
        workFocusQuotes: [
          `No distractions! Attack the hardest task on your list right now!`,
          `Push your limits while the timer is ticking!`
        ],
        breakQuotes: [
          `Catch your breath quickly—the next round starts soon!`
        ],
        over9000Quote: (name) => `UNBELIEVABLE! Over 9,000 ${displayTitle} Power, ${name}! You really proved yourself!`
      },
      {
        id: 'Optimist',
        label: `${displayTitle} Hero`,
        characterName: `${displayTitle} Hero`,
        systemPrompt: `[You are the main hero of "${displayTitle}", cheering the user on with unstoppable energy!]`,
        greeting: (name) => `LET'S GO, ${name}! ${displayTitle} Mode is LIVE! Let's rack up those +1,000 Power tasks!`,
        taskCompleteQuotes: [
          `BOOM! +1,000 Power! You are crushing this ${displayTitle} session!`,
          `YES!! Another task checked off! Keep that energy up!`,
          `Unstoppable! 9,000 Power is getting closer!`
        ],
        workFocusQuotes: [
          `Full speed ahead! Let's make this focus block legendary!`,
          `You've got this! Pick a task and dive right in!`
        ],
        breakQuotes: [
          `Awesome work! Relax, stretch, and enjoy your break!`
        ],
        over9000Quote: (name) => `LET'S GOOO!! ${name} just hit 9,000 ${displayTitle} Power!! Absolute legend!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: `cust-1k`, title: `${displayTitle} Awakened`, subtitle: '1,000 Power — First mission conquered!', icon: '🌟' },
      { threshold: 3000, id: `cust-3k`, title: `Rising ${displayTitle} Star`, subtitle: '3,000 Power — Momentum is surging!', icon: '🔥' },
      { threshold: 5000, id: `cust-5k`, title: `${displayTitle} Vanguard`, subtitle: '5,000 Power — Over halfway to 9,000!', icon: '⚡' },
      { threshold: 9000, id: `cust-9k`, title: `OVER 9,000 ${displayTitle.toUpperCase()} POWER!`, subtitle: '9,000 Power Unlocked — Legendary Mastery Achieved!', icon: '🏆', isMajor: true },
      { threshold: 15000, id: `cust-15k`, title: `Mythic Icon of ${displayTitle}`, subtitle: '15,000 Power — Unstoppable Productivity Legend!', icon: '👑', isMajor: true },
    ]
  };
}

/**
 * Queries real Anime/Show APIs (Jikan MyAnimeList + TVMaze) to fetch official character names
 * and high-res series/character visuals for ANY custom interest prompt!
 */
export async function enrichCustomThemeWithLiveLore(baseTheme: AppTheme): Promise<AppTheme> {
  if (!baseTheme.isProCustom) return baseTheme;

  const query = baseTheme.interestPrompt.trim();
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1&sfw=true`
    );
    const data = await res.json();
    const anime = data?.data?.[0];

    if (anime) {
      const malId = anime.mal_id;
      const officialTitle = anime.title_english || anime.title || baseTheme.name;
      const mainVisual =
        anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;

      // Fetch top characters for this anime
      let charNames: string[] = [];
      let charImages: string[] = [];
      try {
        const charRes = await fetch(`https://api.jikan.moe/v4/anime/${malId}/characters`);
        const charData = await charRes.json();
        if (Array.isArray(charData?.data)) {
          const mains = charData.data.slice(0, 3);
          charNames = mains.map((c: any) =>
            String(c.character?.name || '').split(',').reverse().join(' ').trim()
          );
          charImages = mains
            .map((c: any) => c.character?.images?.jpg?.image_url)
            .filter(Boolean);
        }
      } catch {
        // Ignore character sub-fetch error
      }

      const c1 = charNames[0] || `${officialTitle} Hero`;
      const c2 = charNames[1] || `${officialTitle} Rival`;
      const c3 = charNames[2] || `${officialTitle} Mentor`;

      return {
        ...baseTheme,
        name: officialTitle,
        badge: `✨ ${officialTitle.slice(0, 18)}`,
        orbImageUrl: charImages[0] || mainVisual || baseTheme.orbImageUrl,
        personas: [
          {
            ...baseTheme.personas[0],
            label: `${c1} (Main Lead)`,
            characterName: c1,
            greeting: (name) =>
              `Welcome to ${officialTitle}, ${name}! I'm ${c1}. Ready to crush your tasks today?`,
          },
          {
            ...baseTheme.personas[1],
            label: `${c2} (Rival / Co-Lead)`,
            characterName: c2,
            greeting: (name) =>
              `Stay sharp, ${name}. I'm ${c2}—let's see how fast you can clear this ${officialTitle} list!`,
          },
          {
            ...baseTheme.personas[2],
            label: `${c3} (Strategist)`,
            characterName: c3,
            greeting: (name) =>
              `Greetings, ${name}! ${c3} here—let's build unstoppable momentum in ${officialTitle}!`,
          },
        ],
      };
    }
  } catch {
    // Fallback to baseTheme cleanly
  }

  return baseTheme;
}
