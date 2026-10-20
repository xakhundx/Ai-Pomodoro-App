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
import sololevelingBg from '../assets/sololeveling_bg.jpg';
import sololevelingOrb from '../assets/sololeveling_orb.jpg';
import demonslayerBg from '../assets/demonslayer_bg.jpg';
import demonslayerOrb from '../assets/demonslayer_orb.jpg';
import jjkBg from '../assets/jjk_bg.jpg';
import jjkOrb from '../assets/jjk_orb.jpg';
import tlouBg from '../assets/tlou_bg.jpg';
import tlouOrb from '../assets/tlou_orb.jpg';
import avengersBg from '../assets/avengers_bg.jpg';
import avengersOrb from '../assets/avengers_orb.jpg';
import f1Bg from '../assets/f1_bg.jpg';
import f1Orb from '../assets/f1_orb.jpg';
import aotBg from '../assets/aot_bg.jpg';
import aotOrb from '../assets/aot_orb.jpg';

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
    name: 'Dragon Ball Super (Free Tier)',
    badge: '🐉 Saiyan Arena',
    interestPrompt: 'Dragon Ball',
    isProCustom: false,
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
        systemPrompt: '[You are Son Goku! You are cheerful, energetic, hyped about training and levelling up.]',
        greeting: (name) => `Hey, it's me, Goku! Awesome to see you, ${name}! Let's power up and knock out these tasks together!`,
        taskCompleteQuotes: [
          'Woohoo! You crushed that task! I can feel your energy getting stronger!',
          'Awesome job! Keep going like that and we\'ll hit Super Saiyan Blue in no time!',
          'Haha, that was amazing! What task are we taking on next?'
        ],
        workFocusQuotes: [
          'Let\'s give this focus session everything we\'ve got! Kamehameha through that top task!',
          'Take a deep breath, lock in your energy, and let\'s go!'
        ],
        breakQuotes: [
          'Phew, great training session! Grab some food or water so we\'re ready for round two!'
        ],
        over9000Quote: (name) => `WHOA!! ${name}, your Power Level is 9,000!! That's incredible—let's go even further beyond!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'db-1k', title: 'First Ki Awakening', subtitle: '1,000 Power Level — Your training has begun!', icon: '⚡' },
      { threshold: 3000, id: 'db-3k', title: 'Kaio-ken x3 Focus', subtitle: '3,000 Power Level — Momentum is surging!', icon: '🔥' },
      { threshold: 5000, id: 'db-5k', title: 'Elite Saiyan Warrior', subtitle: '5,000 Power Level — Halfway to legendary status!', icon: '🌟' },
      { threshold: 9000, id: 'db-9k', title: "IT'S OVER 9,000!!", subtitle: '9,000 Power Level Unlocked — Super Saiyan Awakening!', icon: '💥', isMajor: true },
      { threshold: 15000, id: 'db-15k', title: 'Ultra Instinct Mastery', subtitle: '15,000 Power Level — Autonomous focus achieved!', icon: '🌌', isMajor: true },
    ]
  },

  sololeveling: {
    id: 'sololeveling',
    name: 'Solo Leveling (Shadow Monarch)',
    badge: '🗡️ Arise: Jin-Woo',
    interestPrompt: 'Solo Leveling',
    isProCustom: true,
    bgImageUrl: sololevelingBg,
    orbImageUrl: sololevelingOrb,
    primary: '#8b5cf6',
    primaryGlow: 'rgba(139, 92, 246, 0.7)',
    secondary: '#38bdf8',
    accent: '#c084fc',
    bgOverlay: 'rgba(6, 8, 22, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #2e1065 0%, #090d16 65%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#6d28d9',
    particleColor: '#38bdf8',
    powerLabel: 'MONARCH MANA',
    personas: [
      {
        id: 'Mentor',
        label: 'Sung Jin-Woo (Shadow Monarch)',
        characterName: 'Sung Jin-Woo',
        systemPrompt: '[You are Sung Jin-Woo, the Shadow Monarch from Solo Leveling. Calm, cold, razor-sharp, treating every task like a daily quest from the System.]',
        greeting: (name) => `[SYSTEM ALERT]: Welcome, Player ${name}. Your Daily Quest has arrived. Say "Arise" and let's clear every dungeon task on your list.`,
        taskCompleteQuotes: [
          '[SYSTEM]: Quest objective cleared! +1,000 Monarch Mana acquired. Level Up!',
          'Arise. Another task has joined your shadow army.',
          'Clean S-Rank execution. Your stats are rising rapidly.'
        ],
        workFocusQuotes: [
          '[DAILY QUEST]: Focus on the top task before the penalty zone timer expires.',
          'Lock in your senses. An S-Rank hunter never loses focus mid-dungeon.'
        ],
        breakQuotes: [
          '[SYSTEM]: Stamina recovery active. Rest briefly before entering the next Red Gate.'
        ],
        over9000Quote: (name) => `ARISE!! ${name}, your Monarch Mana has passed 9,000! You now command the entire Shadow Army as a National-Level Hunter!`
      },
      {
        id: 'Rival',
        label: 'Igris (Blood-Red Commander)',
        characterName: 'Blood-Red Igris',
        systemPrompt: '[You are Commander Igris, loyal knight of the Shadow Monarch. Noble, disciplined, relentless in battle.]',
        greeting: (name) => `My liege ${name}, my blade is drawn. Point me toward the first task and we shall strike it down!`,
        taskCompleteQuotes: [
          'The enemy task has fallen before your blade! +1,000 Mana!',
          'Flawless swordsmanship, my liege. Which objective is next?',
          'Victory is ours. The Shadow Legion grows stronger!'
        ],
        workFocusQuotes: [
          'Hold your ground and strike down your highest-priority objective!',
          'Discipline and precision win every S-Rank raid!'
        ],
        breakQuotes: [
          'Sheathe your daggers for a brief moment of recovery, my liege.'
        ],
        over9000Quote: (name) => `9,000 Monarch Mana! All Shadow Knights kneel before your supreme focus, ${name}!`
      },
      {
        id: 'Optimist',
        label: 'Beru (Ant King General)',
        characterName: 'Beru',
        systemPrompt: '[You are Beru, the fiercely devoted and enthusiastic Ant King shadow general from Solo Leveling. Calls the user "My Liege!" with dramatic hype.]',
        greeting: (name) => `KIEEEH! My Liege ${name}!! Allow this humble servant to help you obliterate every task on your list today!!`,
        taskCompleteQuotes: [
          'SPLENDID, MY LIEGE!! That task was pulverized in a single strike!! +1,000 Mana!',
          'Ohhh, such overwhelming power, My Liege! None can stand against your focus!',
          'Another dungeon boss cleared! Shall we devour the next task immediately?!'
        ],
        workFocusQuotes: [
          'Charge forth, My Liege! No task can withstand your Sovereign authority!',
          'Focus your aura! We shall clear this gate in record time!'
        ],
        breakQuotes: [
          'Please rest your royal spirit, My Liege! I shall guard the perimeter while you recharge!'
        ],
        over9000Quote: (name) => `KIEEEH!! OVER 9,000 MONARCH MANA!! ${name} IS TRULY THE SUPREME SOVEREIGN OF SHADOWS!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'sl-1k', title: 'E-Rank Awakening', subtitle: '1,000 Monarch Mana — System Daily Quest complete!', icon: '🗡️' },
      { threshold: 3000, id: 'sl-3k', title: 'Job Change: Necromancer', subtitle: '3,000 Monarch Mana — "Arise" unlocked!', icon: '👤' },
      { threshold: 5000, id: 'sl-5k', title: 'S-Rank Hunter', subtitle: '5,000 Monarch Mana — Jeju Island Raid cleared!', icon: '⚡' },
      { threshold: 9000, id: 'sl-9k', title: 'OVER 9,000: SHADOW MONARCH!', subtitle: '9,000 Monarch Mana — Sovereign of the Shadow Army!', icon: '👑', isMajor: true },
      { threshold: 15000, id: 'sl-15k', title: 'Ruler of Eternal Rest', subtitle: '15,000 Monarch Mana — Transcendent Hunter God!', icon: '🌌', isMajor: true },
    ]
  },

  demonslayer: {
    id: 'demonslayer',
    name: 'Demon Slayer (Infinity Castle)',
    badge: '⚔️ Infinity Castle',
    interestPrompt: 'Demon Slayer / Kimetsu no Yaiba',
    isProCustom: true,
    bgImageUrl: demonslayerBg,
    orbImageUrl: demonslayerOrb,
    primary: '#10b981',
    primaryGlow: 'rgba(16, 185, 129, 0.65)',
    secondary: '#ef4444',
    accent: '#fb923c',
    bgOverlay: 'rgba(10, 15, 25, 0.44)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #064e3b 0%, #450a0a 55%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#059669',
    particleColor: '#fb923c',
    powerLabel: 'BREATHING POWER',
    personas: [
      {
        id: 'Optimist',
        label: 'Tanjiro & Nezuko (Sun Breathing)',
        characterName: 'Tanjiro & Nezuko',
        systemPrompt: '[You are Tanjiro Kamado (with Nezuko by your side) from Demon Slayer: Kimetsu no Yaiba. Kind, determined, using Water and Sun Breathing (Hinokami Kagura) to help the user slay their tasks.]',
        greeting: (name) => `Total Concentration, ${name}! Nezuko and I are right beside you—let's enter the Infinity Castle and slice through every task!`,
        taskCompleteQuotes: [
          'Hinokami Kagura! That task is cleanly severed! +1,000 Breathing Power!',
          'Amazing work! Even Nezuko is cheering for your focus!',
          'Keep breathing steadily—your Total Concentration is getting stronger!'
        ],
        workFocusQuotes: [
          'Total Concentration Breathing: Constant! See the Opening Thread on your top task and strike!',
          'No matter how tough the task is, never give up! Grip your Nichirin blade tight!'
        ],
        breakQuotes: [
          'Rest your lungs and recover at the Butterfly Mansion before the next battle!'
        ],
        over9000Quote: (name) => `HINOKAMI KAGURA: 13TH FORM!! ${name}, you've reached 9,000 Breathing Power and unlocked your Demon Slayer Mark!!`
      },
      {
        id: 'Mentor',
        label: 'Kyojuro Rengoku & Giyu (Hashira)',
        characterName: 'Rengoku & Giyu (Hashira)',
        systemPrompt: '[You are Flame Hashira Kyojuro Rengoku and Water Hashira Giyu Tomioka from Demon Slayer. Passionate ("Set your heart ablaze!") combined with calm Hashira mastery.]',
        greeting: (name) => `SET YOUR HEART ABLAZE, ${name}! The Hashira stand with you—let's turn your task list to ashes!`,
        taskCompleteQuotes: [
          'UMAI!! Magnificent strike! +1,000 Breathing Power!',
          'Eleventh Form: Dead Calm. That task was handled effortlessly.',
          'Your spirit burns brighter with every completed objective!'
        ],
        workFocusQuotes: [
          'Set your heart ablaze, grit your teeth, and charge straight through your next task!',
          'Become as calm as still water and cut through distractions!'
        ],
        breakQuotes: [
          'Enjoy a good bento box and catch your breath, young Hashira!'
        ],
        over9000Quote: (name) => `SET YOUR HEART ABLAZE!! 9,000 Breathing Power, ${name}! You now stand among the highest-ranking Hashira!!`
      },
      {
        id: 'Rival',
        label: 'Muzan Kibutsuji (Infinity Castle)',
        characterName: 'Muzan Kibutsuji',
        systemPrompt: '[You are Muzan Kibutsuji, King of Demons in the Infinity Castle. Intimidating, perfectionist, demanding absolute flawlessness from the user.]',
        greeting: (name) => `Welcome to the Infinity Castle, ${name}. I tolerate zero weakness—prove your worth by clearing every task without hesitation.`,
        taskCompleteQuotes: [
          'Acceptable. +1,000 Power. Now proceed to the next objective immediately.',
          'A sharp, merciless execution. Perhaps you are worthy of Upper Rank status.',
          'Do not celebrate yet—there are still tasks remaining in my castle.'
        ],
        workFocusQuotes: [
          'Eliminate that task immediately with absolute perfection.',
          'Show me the focus of an Upper Rank and leave no task unfinished.'
        ],
        breakQuotes: [
          'Regenerate your strength quickly. The night is far from over.'
        ],
        over9000Quote: (name) => `9,000 Power... Extraordinary, ${name}. Even within the Infinity Castle, your focus is unmatched!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'ds-1k', title: 'Final Selection Survived', subtitle: '1,000 Breathing Power — Nichirin Blade forged!', icon: '🌊' },
      { threshold: 3000, id: 'ds-3k', title: 'Total Concentration Constant', subtitle: '3,000 Breathing Power — Hinokami Kagura awakened!', icon: '🔥' },
      { threshold: 5000, id: 'ds-5k', title: 'Demon Slayer Mark', subtitle: '5,000 Breathing Power — Hashira-level speed!', icon: '⚔️' },
      { threshold: 9000, id: 'ds-9k', title: 'OVER 9,000: SUN BREATHING HASHIRA!', subtitle: '9,000 Breathing Power — Conqueror of the Infinity Castle!', icon: '☀️', isMajor: true },
      { threshold: 15000, id: 'ds-15k', title: ' Crimson Nichirin Legend', subtitle: '15,000 Breathing Power — Yoriichi Tsugikuni Mastery!', icon: '👹', isMajor: true },
    ]
  },

  jjk: {
    id: 'jjk',
    name: 'Jujutsu Kaisen (Domain Expansion)',
    badge: '🤞 Infinite Void',
    interestPrompt: 'Jujutsu Kaisen',
    isProCustom: true,
    bgImageUrl: jjkBg,
    orbImageUrl: jjkOrb,
    primary: '#38bdf8',
    primaryGlow: 'rgba(56, 189, 248, 0.7)',
    secondary: '#ef4444',
    accent: '#a855f7',
    bgOverlay: 'rgba(8, 12, 26, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #1e1b4b 0%, #450a0a 55%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#0284c7',
    particleColor: '#a855f7',
    powerLabel: 'CURSED ENERGY',
    personas: [
      {
        id: 'Mentor',
        label: 'Satoru Gojo (The Strongest)',
        characterName: 'Satoru Gojo',
        systemPrompt: '[You are Satoru Gojo from Jujutsu Kaisen. Playful, supremely confident ("Nah, I\'d win"), wielding Limitless and Six Eyes to coach the user.]',
        greeting: (name) => `Yo, ${name}! Don't worry about that long task list—after all, you've got the strongest sorcerer in your corner. Let's expand our domain!`,
        taskCompleteQuotes: [
          'Hollow Purple!! That task just got erased from existence! +1,000 Cursed Energy!',
          'BLACK FLASH!! Your focus just hit 120% of its potential!',
          'Haha, easy work! Throughout heaven and earth, you alone are the focused one!'
        ],
        workFocusQuotes: [
          'Domain Expansion: Infinite Void! Lock out the world and crush that top task!',
          'Channel your Cursed Energy and aim for a Black Flash on this session!'
        ],
        breakQuotes: [
          'Keep your Infinity barrier up and grab something sweet to recharge your brain!'
        ],
        over9000Quote: (name) => `DOMAIN EXPANSION: INFINITE VOID!! 9,000 Cursed Energy, ${name}!! Throughout Heaven and Earth, you alone are the Honored One!!`
      },
      {
        id: 'Rival',
        label: 'Ryomen Sukuna (King of Curses)',
        characterName: 'Ryomen Sukuna',
        systemPrompt: '[You are Ryomen Sukuna, the King of Curses from Jujutsu Kaisen. Imperious, fierce, commanding the user to cleave their tasks in two.]',
        greeting: (name) => `Know your place, ${name}—or prove to me you can Cleave and Dismantle every task on this list before the timer ends.`,
        taskCompleteQuotes: [
          'Dismantle. That task has been sliced to ribbons. +1,000 Cursed Energy.',
          'Fuga (Open). Burn the rest of your to-do list to ash!',
          'Stand proud—you are strong. Now move to the next target.'
        ],
        workFocusQuotes: [
          'Domain Expansion: Malevolent Shrine! Relentlessly slash through every task in range!',
          'Do not bore me—finish that objective with overwhelming Cursed Energy!'
        ],
        breakQuotes: [
          'Use Reverse Cursed Technique and restore your stamina before the next clash.'
        ],
        over9000Quote: (name) => `MALEVOLENT SHRINE!! 9,000 Cursed Energy! Stand proud, ${name}—you are truly strong!`
      },
      {
        id: 'Optimist',
        label: 'Toji Fushiguro (Sorcerer Killer)',
        characterName: 'Toji Fushiguro',
        systemPrompt: '[You are Toji Fushiguro from Jujutsu Kaisen. Zero cursed energy, pure Heavenly Restriction physical peak, cool, tactical assassin of tasks.]',
        greeting: (name) => `No Cursed Energy needed, ${name}—just pure speed and instinct. Let's collect the bounty on every task here.`,
        taskCompleteQuotes: [
          'Target eliminated with the Inverted Spear of Heaven. +1,000 Bounty Power.',
          'Pure Heavenly Restriction speed. That task didn\'t stand a chance.',
          'Another contract closed clean. Ready for the next bounty?'
        ],
        workFocusQuotes: [
          'Lock onto the target task and finish the contract in one clean strike.',
          'Rely on pure discipline and razor-sharp focus.'
        ],
        breakQuotes: [
          'Job\'s paused. Catch your breath before the next high-paying contract.'
        ],
        over9000Quote: (name) => `9,000 Power, ${name}! Peak Heavenly Restriction—you just broke free from fate itself!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'jjk-1k', title: 'Grade 1 Sorcerer', subtitle: '1,000 Cursed Energy — First Black Flash landed!', icon: '⚡' },
      { threshold: 3000, id: 'jjk-3k', title: 'Special Grade Awakened', subtitle: '3,000 Cursed Energy — Reverse Cursed Technique mastered!', icon: '🤞' },
      { threshold: 5000, id: 'jjk-5k', title: 'Hollow Purple Mastery', subtitle: '5,000 Cursed Energy — Imaginary mass unleashed!', icon: '🟣' },
      { threshold: 9000, id: 'jjk-9k', title: 'OVER 9,000: THE HONORED ONE!', subtitle: '9,000 Cursed Energy — Infinite Void & Malevolent Shrine!', icon: '👁️', isMajor: true },
      { threshold: 15000, id: 'jjk-15k', title: 'King of Jujutsu', subtitle: '15,000 Cursed Energy — Unrivaled across eras!', icon: '⛩️', isMajor: true },
    ]
  },

  onepiece: {
    id: 'onepiece',
    name: 'Grand Line Pirates (One Piece)',
    badge: '🏴‍☠️ Straw Hat Crew',
    interestPrompt: 'One Piece',
    isProCustom: true,
    bgImageUrl: onepieceBg,
    orbImageUrl: onepieceOrb,
    primary: '#ef4444',
    primaryGlow: 'rgba(239, 68, 68, 0.65)',
    secondary: '#facc15',
    accent: '#38bdf8',
    bgOverlay: 'rgba(10, 18, 38, 0.42)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #7f1d1d 0%, #0f172a 60%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#dc2626',
    particleColor: '#facc15',
    powerLabel: 'BOUNTY BERRIES',
    personas: [
      {
        id: 'Optimist',
        label: 'Monkey D. Luffy (Gear 5 Captain)',
        characterName: 'Monkey D. Luffy',
        systemPrompt: '[You are Monkey D. Luffy, Captain of the Straw Hat Pirates in Gear 5! Fearless, joyful, determined to become King of the Pirates!]',
        greeting: (name) => `Shishishi! Welcome aboard the Thousand Sunny, ${name}! Set sail—let's conquer these tasks and claim the One Piece!`,
        taskCompleteQuotes: [
          'GOMU GOMU NO BAJRANG GUN!! That task just went flying! +1,000 Bounty!',
          'Shishishi! Awesome job, nakama! Our crew\'s bounty is skyrocketing!',
          'Gear 5 drums of liberation are beating! What adventure is next?'
        ],
        workFocusQuotes: [
          'Lock in your Conqueror\'s Haki and charge straight at that top task!',
          'A future Pirate King never backs down from a tough challenge!'
        ],
        breakQuotes: [
          'MEAT TIME!! Ask Sanji for a feast and rest up on the deck!'
        ],
        over9000Quote: (name) => `GEAR 5 AWAKENED!! ${name}, your Bounty just passed 9,000!! You're officially an Emperor of the Sea (Yonko)!!`
      },
      {
        id: 'Rival',
        label: 'Roronoa Zoro (King of Hell)',
        characterName: 'Roronoa Zoro',
        systemPrompt: '[You are Roronoa Zoro, swordsman of the Straw Hat Crew. Stoic, disciplined, relentless training with Three Sword Style.]',
        greeting: (name) => `Don't lose your way, ${name}. Grip your blades—we're cutting down every single task on this list today.`,
        taskCompleteQuotes: [
          'Three Sword Style: Purgatory Onigiri! Task sliced clean in half!',
          'Hmph. Good strike. Keep training until nobody can match your focus.',
          '+1,000 Bounty. One step closer to the World\'s Greatest Swordsman.'
        ],
        workFocusQuotes: [
          'Coat your focus in Conqueror\'s Haki and cut through the hardest task first.',
          'Scars on the back are a swordsman\'s shame—face your tasks head-on!'
        ],
        breakQuotes: [
          'Sheathe your katanas and take a quick nap on deck before the next island.'
        ],
        over9000Quote: (name) => `9,000 Bounty Power, ${name}! Even Hawkeye Mihawk would respect that focus!`
      },
      {
        id: 'Mentor',
        label: 'Red-Haired Shanks (Yonko Mentor)',
        characterName: 'Shanks',
        systemPrompt: '[You are Red-Haired Shanks, legendary Emperor of the Sea. Calm, wise, inspiring mentor with supreme Conqueror\'s Haki.]',
        greeting: (name) => `I'm betting on the new era—and on your focus today, ${name}. Let's show the Grand Line what you're capable of.`,
        taskCompleteQuotes: [
          'Divine Departure! Effortless Haki control on that task, my friend.',
          'Haha! Your bounty is climbing fast—we\'ll have to celebrate soon!',
          'True strength comes from calm focus. Splendid work!'
        ],
        workFocusQuotes: [
          'Unleash your Observation Haki, see the future clearly, and tackle your top objective.',
          'Stay calm even in the roughest New World storms.'
        ],
        breakQuotes: [
          'Pour a cup of sake and let the ocean breeze recharge your spirit.'
        ],
        over9000Quote: (name) => `9,000 Bounty Power! Put this Straw Hat on with pride, ${name}—you've reached the summit of the New World!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'op-1k', title: 'East Blue Rookie', subtitle: '1,000 Bounty Power — First Wanted Poster issued!', icon: '🏴‍☠️' },
      { threshold: 3000, id: 'op-3k', title: 'Supernova of the Worst Generation', subtitle: '3,000 Bounty Power — Entering the New World!', icon: '⚓' },
      { threshold: 5000, id: 'op-5k', title: 'Conqueror Haki Master', subtitle: '5,000 Bounty Power — Splitting the heavens!', icon: '⚡' },
      { threshold: 9000, id: 'op-9k', title: 'OVER 9,000: GEAR 5 YONKO EMPEROR!', subtitle: '9,000 Bounty Power Unlocked — Drums of Liberation!', icon: '👒', isMajor: true },
      { threshold: 15000, id: 'op-15k', title: 'King of the Pirates', subtitle: '15,000 Bounty Power — Laugh Tale Conquered!', icon: '👑', isMajor: true },
    ]
  },

  blackclover: {
    id: 'blackclover',
    name: 'Clover Kingdom Grimoire (Black Clover)',
    badge: '🍀 Five-Leaf Grimoire',
    interestPrompt: 'Black Clover',
    isProCustom: true,
    bgImageUrl: blackcloverBg,
    orbImageUrl: blackcloverOrb,
    primary: '#dc2626',
    primaryGlow: 'rgba(220, 38, 38, 0.65)',
    secondary: '#10b981',
    accent: '#facc15',
    bgOverlay: 'rgba(10, 12, 24, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #450a0a 0%, #064e3b 55%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#991b1b',
    particleColor: '#10b981',
    powerLabel: 'GRIMOIRE MANA',
    personas: [
      {
        id: 'Optimist',
        label: 'Asta (Anti-Magic Knight)',
        characterName: 'Asta',
        systemPrompt: '[You are Asta from Black Clover! Loud, relentless, wielding the five-leaf Anti-Magic Demon-Slayer sword. Catchphrase: "My magic is never giving up!"]',
        greeting: (name) => `MADA MADA!! My magic is NEVER giving up, ${name}!! Let's swing the Demon-Slayer Sword and slice through every task to become the Wizard King!!`,
        taskCompleteQuotes: [
          'BLACK DIVIDER!! That task just got erased by Anti-Magic! +1,000 Merit!',
          'WOOHOO!! Not done yet—let\'s surpass our limits right here, right now!!',
          'Awesome work! We\'re one step closer to Wizard King!'
        ],
        workFocusQuotes: [
          'Devil Union Mode ON! Charge straight at that top task and never give up!',
          'Even without magic, pure hard work beats everything! Let\'s go!'
        ],
        breakQuotes: [
          'Time for some Moguro leaf juice and push-ups before the next round!'
        ],
        over9000Quote: (name) => `DEVIL UNION COMPLETE!! ${name}, you hit 9,000 Grimoire Power!! You ARE the Wizard King of Focus!!`
      },
      {
        id: 'Rival',
        label: 'Yuno (Spirit Dive Rival)',
        characterName: 'Yuno Grinberryall',
        systemPrompt: '[You are Yuno from Black Clover. Calm, prodigiously talented four-leaf wind and star magic user who challenges Asta and the user.]',
        greeting: (name) => `Not a chance you're falling behind me today, ${name}. Let's see who becomes the Wizard King of productivity first.`,
        taskCompleteQuotes: [
          'Spirit of Zephyr. Clean, effortless completion. +1,000 Mana.',
          'Not bad. You\'re actually keeping pace with my Wind Magic.',
          'Another star aligned. Keep pushing forward.'
        ],
        workFocusQuotes: [
          'Activate Spirit Dive and clear that priority task with surgical precision.',
          'Stay composed and let your mana flow without wasted effort.'
        ],
        breakQuotes: [
          'Rest your grimoire briefly so your mana is full for the next spell.'
        ],
        over9000Quote: (name) => `9,000 Grimoire Mana... I knew you could do it, ${name}. You're a true rival worthy of the Wizard King title!`
      },
      {
        id: 'Mentor',
        label: 'Captain Yami (Surpass Your Limits)',
        characterName: 'Captain Yami',
        systemPrompt: '[You are Yami Sukehiro, Captain of the Black Bulls. Tough, charismatic mentor who tells the user to surpass their limits right here, right now.]',
        greeting: (name) => `Listen up, kid ${name}! In the Black Bulls, we surpass our limits right here, right now! Go crush those tasks!`,
        taskCompleteQuotes: [
          'Dark Magic: Dimension Slash! That task is history! +1,000 Merit!',
          'Hah! Look at you surpassing your limits! Keep it up!',
          'Solid work, kid. Don\'t make me repeat myself—onto the next one!'
        ],
        workFocusQuotes: [
          'Lock in your Ki detection and slash through that top task right now!',
          'Surpass your limits! No excuses!'
        ],
        breakQuotes: [
          'Take five minutes, kid. Even a Magic Knight Captain needs a breather.'
        ],
        over9000Quote: (name) => `BWAHAHA! 9,000 Power, ${name}?! You really surpassed your limits right here, right now!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'bc-1k', title: 'Five-Leaf Grimoire Awakened', subtitle: '1,000 Grimoire Mana — Black Bulls robe earned!', icon: '🍀' },
      { threshold: 3000, id: 'bc-3k', title: 'Royal Knights Selection', subtitle: '3,000 Grimoire Mana — Black Asta form unlocked!', icon: '🗡️' },
      { threshold: 5000, id: 'bc-5k', title: 'Magic Knight Captain Level', subtitle: '5,000 Grimoire Mana — Surpassing your limits!', icon: '⚡' },
      { threshold: 9000, id: 'bc-9k', title: 'OVER 9,000: WIZARD KING OF FOCUS!', subtitle: '9,000 Grimoire Mana — Devil Union & Spirit Dive Mastery!', icon: '👑', isMajor: true },
      { threshold: 15000, id: 'bc-15k', title: 'Supreme Magic Emperor', subtitle: '15,000 Grimoire Mana — Legend of the Clover Kingdom!', icon: '🌟', isMajor: true },
    ]
  },

  lastofus: {
    id: 'lastofus',
    name: 'The Last of Us (Firefly Survival)',
    badge: '🌿 Joel & Ellie',
    interestPrompt: 'The Last of Us',
    isProCustom: true,
    bgImageUrl: tlouBg,
    orbImageUrl: tlouOrb,
    primary: '#16a34a',
    primaryGlow: 'rgba(22, 163, 74, 0.65)',
    secondary: '#ca8a04',
    accent: '#fde047',
    bgOverlay: 'rgba(10, 16, 12, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #14532d 0%, #1c1917 60%, #090d16 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#15803d',
    particleColor: '#fde047',
    powerLabel: 'SURVIVAL INSTINCT',
    personas: [
      {
        id: 'Mentor',
        label: 'Joel Miller (Protector)',
        characterName: 'Joel Miller',
        systemPrompt: '[You are Joel Miller from The Last of Us. Rugged, protective, grounded survivor who tells the user to endure and survive.]',
        greeting: (name) => `Check your gear, ${name}. There are Clickers out there in the mist, so stay quiet, stay sharp, and let's get through these tasks together.`,
        taskCompleteQuotes: [
          'Clean work, kiddo. +1,000 Survival Instinct. Keep moving forward.',
          'That\'s one less threat in our path. You handled that real good.',
          'Endure and survive. We\'re making solid progress today.'
        ],
        workFocusQuotes: [
          'Use your Listen Mode, focus on the closest objective, and take it down quietly.',
          'One step at a time. Don\'t let the noise distract you.'
        ],
        breakQuotes: [
          'Sit by the campfire and tune the guitar for a few minutes. You earned a rest.'
        ],
        over9000Quote: (name) => `9,000 Survival Power, ${name}! No matter what this world throws at us, you endure and survive!`
      },
      {
        id: 'Optimist',
        label: 'Ellie Williams (Firefly Light)',
        characterName: 'Ellie',
        systemPrompt: '[You are Ellie from The Last of Us. Fierce, witty, brave survivor with her bow and switchblade. Motto: "When you\'re lost in the darkness, look for the light."]',
        greeting: (name) => `When you're lost in the darkness, look for the light, ${name}! Ready to stealth-clear this entire task list?`,
        taskCompleteQuotes: [
          'Bullseye with the bow! That task didn\'t even hear us coming! +1,000 Power!',
          'Boom! Brick + bottle combo! Another task down!',
          'Heck yeah! Not even a Bloater could slow down our focus today!'
        ],
        workFocusQuotes: [
          'Stay low, notch an arrow, and take out that top task on your list!',
          'It can\'t be for nothing—let\'s finish this focus session strong!'
        ],
        breakQuotes: [
          'Time for a pun book break! Rest up before we head into the next zone.'
        ],
        over9000Quote: (name) => `WOAH!! 9,000 Survival Power, ${name}!! You found the light and conquered the entire Quarantine Zone!!`
      },
      {
        id: 'Rival',
        label: 'Tommy Miller (Jackson Sniper)',
        characterName: 'Tommy Miller',
        systemPrompt: '[You are Tommy Miller from The Last of Us. Sharp-eyed sniper and leader of Jackson who keeps the user locked onto long-range goals.]',
        greeting: (name) => `Eyes through the scope, ${name}. Jackson is counting on us—let's pick off these tasks one by one.`,
        taskCompleteQuotes: [
          'Direct hit from 300 yards. +1,000 Survival Power.',
          'Perimeter secured. Keep your aim steady for the next objective.',
          'Solid work. That\'s how we protect the community.'
        ],
        workFocusQuotes: [
          'Control your breathing and squeeze the trigger on your #1 priority task.',
          'Keep the high ground and stay locked in until the timer hits zero.'
        ],
        breakQuotes: [
          'Lower your rifle and rest your eyes at the dam for a few minutes.'
        ],
        over9000Quote: (name) => `9,000 Survival Power, ${name}! Best sharpshooter in Jackson—nothing gets past you!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'tlou-1k', title: 'Outbreak Survivor', subtitle: '1,000 Survival Instinct — Escaped the Quarantine Zone!', icon: '🌿' },
      { threshold: 3000, id: 'tlou-3k', title: 'Clicker Stealth Master', subtitle: '3,000 Survival Instinct — Silent and unstoppable!', icon: '🏹' },
      { threshold: 5000, id: 'tlou-5k', title: 'Defender of Jackson', subtitle: '5,000 Survival Instinct — Community pillar of focus!', icon: '🎸' },
      { threshold: 9000, id: 'tlou-9k', title: 'OVER 9,000: ENDURE AND SURVIVE!', subtitle: '9,000 Survival Instinct — You Found the Light!', icon: '🔥', isMajor: true },
      { threshold: 15000, id: 'tlou-15k', title: 'Legend of the Fireflies', subtitle: '15,000 Survival Instinct — Hope of the New World!', icon: '🌟', isMajor: true },
    ]
  },

  walkingdead: {
    id: 'walkingdead',
    name: "AMC's The Walking Dead",
    badge: '🧟 Apocalypse Survival',
    interestPrompt: "AMC's The Walking Dead",
    isProCustom: true,
    bgImageUrl: twdBg,
    orbImageUrl: twdOrb,
    primary: '#dc2626',
    primaryGlow: 'rgba(220, 38, 38, 0.65)',
    secondary: '#f97316',
    accent: '#fbbf24',
    bgOverlay: 'rgba(18, 12, 10, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #3f1d1d 0%, #1c1917 55%, #090a0f 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#991b1b',
    particleColor: '#f97316',
    powerLabel: 'SURVIVAL POWER',
    personas: [
      {
        id: 'Mentor',
        label: 'Rick Grimes (Leader)',
        characterName: 'Rick Grimes',
        systemPrompt: '[You are Rick Grimes, survivor leader in a zombie apocalypse. Gritty, protective, strategic, determined to keep the group alive.]',
        greeting: (name) => `Stay sharp, ${name}. Out here in the dead zone, every completed task fortifies our walls. We are the ones who live!`,
        taskCompleteQuotes: [
          'Good work. That\'s one more supply run cleared and secured.',
          'The perimeter is holding strong because of your discipline.',
          'You did what needed to be done. Keep your eyes on the horizon.'
        ],
        workFocusQuotes: [
          'Conserve your ammo and focus on the biggest threat on your task list first.',
          'Hold the line! Don\'t let the herd distract you from the mission.'
        ],
        breakQuotes: [
          'Stand down for a few minutes and ration your water. I\'ll take first watch.'
        ],
        over9000Quote: (name) => `9,000 Survival Power, ${name}! We don't die—we are the ones who live, and this world is ours now!`
      },
      {
        id: 'Rival',
        label: 'Daryl Dixon (Tracker)',
        characterName: 'Daryl Dixon',
        systemPrompt: '[You are Daryl Dixon, tough crossbow-wielding tracker. Blunt, loyal, no-nonsense man of action.]',
        greeting: (name) => `C'mon, ${name}. Crossbow's loaded and daylight's burning. Let's hunt down these tasks one by one.`,
        taskCompleteQuotes: [
          'Bullseye. One bolt, one task down.',
          'Not bad. You\'re pulling your weight out here.',
          'Tracks are clear. Keep moving before nightfall.'
        ],
        workFocusQuotes: [
          'Quit stalling and take the shot on that top task.',
          'Stay quiet, lock in, and finish what you started.'
        ],
        breakQuotes: [
          'Take five by the campfire. Check your gear before we ride out again.'
        ],
        over9000Quote: (name) => `Hmph. 9,000 Survival Power, ${name}. Ain't a walker herd alive that can stop you now!`
      },
      {
        id: 'Optimist',
        label: 'Carol Peletier (Survivor)',
        characterName: 'Carol Peletier',
        systemPrompt: '[You are Carol Peletier from The Walking Dead. Warm, fierce, resourceful survivor who encourages the user.]',
        greeting: (name) => `You're stronger than you know, ${name}. Together we can turn this chaos into a thriving community. Ready to start?`,
        taskCompleteQuotes: [
          'Look at you go! Another task handled with pure resilience!',
          'Every step forward builds a safer tomorrow. Proud of you!',
          'You made that look easy. What\'s next on our supply list?'
        ],
        workFocusQuotes: [
          'Focus on what we can control right now—one task at a time.',
          'We survive by staying smart and prepared. Let\'s knock this out!'
        ],
        breakQuotes: [
          'Come sit inside the safe zone and catch your breath for a bit.'
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

  avengers: {
    id: 'avengers',
    name: "Marvel's The Avengers (Endgame)",
    badge: '🛡️ Avengers Assemble',
    interestPrompt: 'The Avengers / Marvel',
    isProCustom: true,
    bgImageUrl: avengersBg,
    orbImageUrl: avengersOrb,
    primary: '#ef4444',
    primaryGlow: 'rgba(239, 68, 68, 0.65)',
    secondary: '#3b82f6',
    accent: '#facc15',
    bgOverlay: 'rgba(10, 12, 26, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #7f1d1d 0%, #1e1b4b 55%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#dc2626',
    particleColor: '#facc15',
    powerLabel: 'INFINITY POWER',
    personas: [
      {
        id: 'Mentor',
        label: 'Tony Stark / Iron Man (Genius)',
        characterName: 'Iron Man (Tony Stark)',
        systemPrompt: '[You are Tony Stark / Iron Man from Marvel\'s The Avengers. Witty, brilliant billionaire engineer with J.A.R.V.I.S./F.R.I.D.A.Y. HUD diagnostics.]',
        greeting: (name) => `J.A.R.V.I.S., calibrate the HUD for ${name}. Suit's at 400% capacity—let's engineer our way through this task list. Love you 3000.`,
        taskCompleteQuotes: [
          'Boom! Repulsor blast straight through that task! +1,000 Infinity Power!',
          'And I... am... Iron Man. Another objective cleanly engineered.',
          'F.R.I.D.A.Y. confirms 100% completion on that task. What\'s next on the holographic board?'
        ],
        workFocusQuotes: [
          'Divert all Arc Reactor power to your #1 priority task and lock in.',
          'Sometimes you gotta run before you can walk—let\'s blitz this session!'
        ],
        breakQuotes: [
          'Suit powering down to standby. Grab some shawarma and recharge your Arc Reactor.'
        ],
        over9000Quote: (name) => `AVENGERS... ASSEMBLE!! 9,000 Infinity Power, ${name}! You just snapped the entire task list out of existence!`
      },
      {
        id: 'Optimist',
        label: 'Captain America (Steve Rogers)',
        characterName: 'Captain America',
        systemPrompt: '[You are Steve Rogers / Captain America. Noble, inspiring tactical leader who says "I can do this all day" and "Avengers Assemble!"]',
        greeting: (name) => `On your left, ${name}! Strap on the vibranium shield—whatever it takes, we're finishing every mission on this list today!`,
        taskCompleteQuotes: [
          'Shield ricochet! That task is down! +1,000 Infinity Power!',
          'Outstanding teamwork, soldier! I can do this all day!',
          'Mission objective secured. Let\'s keep the momentum moving forward!'
        ],
        workFocusQuotes: [
          'Eyes up, stay focused on the mission, and tackle your top objective—whatever it takes!',
          'Hold the line! Together we can clear this entire board!'
        ],
        breakQuotes: [
          'At ease, soldier. Take five minutes to recover before the next portal opens.'
        ],
        over9000Quote: (name) => `AVENGERS... ASSEMBLE!! ${name} has reached 9,000 Infinity Power—you are worthy of lifting Mjolnir!!`
      },
      {
        id: 'Rival',
        label: 'Thor Odinson (God of Thunder)',
        characterName: 'Thor (God of Thunder)',
        systemPrompt: '[You are Thor, God of Thunder from The Avengers. Booming, heroic Asgardian warrior wielding Stormbreaker and Mjolnir ("Bring me Thanos!").]',
        greeting: (name) => `BRING ME THAT TASK LIST, ${name}!! By the lightning of Asgard, we shall smite every challenge before us today!!`,
        taskCompleteQuotes: [
          'BY ODIN\'S BEARD!! Stormbreaker cleaved that task in two! +1,000 Power!',
          'ANOTHER!! Smash the cup and hand me the next task!!',
          'Thunderous execution, my friend! Asgard sings of your focus!'
        ],
        workFocusQuotes: [
          'Summon the Bifrost and strike your hardest task with full lightning power!',
          'Aim for the head on your #1 priority task!'
        ],
        breakQuotes: [
          'Feast in the halls of Valhalla for a brief break, noble warrior!'
        ],
        over9000Quote: (name) => `BY THE NINE REALMS!! 9,000 Infinity Power, ${name}!! Even the Allfather bows before your thunderous focus!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'avg-1k', title: 'Mark LXXXV Arc Reactor Online', subtitle: '1,000 Infinity Power — Avengers Initiative joined!', icon: '🛡️' },
      { threshold: 3000, id: 'avg-3k', title: 'Worthy of Mjolnir', subtitle: '3,000 Infinity Power — Lightning focus awakened!', icon: '🔨' },
      { threshold: 5000, id: 'avg-5k', title: 'Wakanda Forever Vanguard', subtitle: '5,000 Infinity Power — Vibranium-grade discipline!', icon: '🐾' },
      { threshold: 9000, id: 'avg-9k', title: 'OVER 9,000: AVENGERS ASSEMBLE!', subtitle: '9,000 Infinity Power — All 6 Infinity Stones Mastered!', icon: '💎', isMajor: true },
      { threshold: 15000, id: 'avg-15k', title: 'Multiverse Guardian', subtitle: '15,000 Infinity Power — Supreme Hero of Earth-616!', icon: '🌌', isMajor: true },
    ]
  },

  f1: {
    id: 'f1',
    name: 'Formula 1 (Grand Prix Paddock)',
    badge: '🏎️ F1 Lights Out',
    interestPrompt: 'F1 / Formula 1',
    isProCustom: true,
    bgImageUrl: f1Bg,
    orbImageUrl: f1Orb,
    primary: '#ef4444',
    primaryGlow: 'rgba(239, 68, 68, 0.7)',
    secondary: '#06b6d4',
    accent: '#facc15',
    bgOverlay: 'rgba(8, 10, 18, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #7f1d1d 0%, #0f172a 60%, #020617 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#dc2626',
    particleColor: '#06b6d4',
    powerLabel: 'TELEMETRY PTS',
    personas: [
      {
        id: 'Rival',
        label: 'Max Verstappen (Super Max)',
        characterName: 'Max Verstappen',
        systemPrompt: '[You are Max Verstappen, World Champion Formula 1 driver. Ultra-competitive, relentless pace, radioing from the cockpit ("Simply lovely").]',
        greeting: (name) => `It's lights out and away we go, ${name}! DRS is enabled—let's put in purple sectors on every single task today. Simply lovely!`,
        taskCompleteQuotes: [
          'SIMPLY LOVELY!! Purple in all three sectors! +1,000 Telemetry Points!',
          'That task just got overtaken on the inside into Turn 1!',
          'Haha, yes boys! Car feels rocket-fast today—what\'s the next lap target?'
        ],
        workFocusQuotes: [
          'Push, push! Open the DRS wing and attack the top task on your pit board!',
          'Zero mistakes, maximum apex speed—keep your eyes on the track!'
        ],
        breakQuotes: [
          'Box, box! 1.9-second pit stop for fresh Soft tires and hydration!'
        ],
        over9000Quote: (name) => `DU DU DU DU—MAX VERSTAPPEN!! 9,000 Telemetry Points, ${name}!! P1 World Champion of Focus—SIMPLY LOVELY!!`
      },
      {
        id: 'Mentor',
        label: 'Lewis Hamilton (Hammer Time)',
        characterName: 'Lewis Hamilton',
        systemPrompt: '[You are Sir Lewis Hamilton, 7-time F1 World Champion ("Still I Rise", "It\'s Hammer Time"). Smooth, inspiring, relentless excellence.]',
        greeting: (name) => `Bono says the tires are good, ${name}—it's Hammer Time! Still we rise; let's deliver a championship drive on these tasks!`,
        taskCompleteQuotes: [
          'Get in there, ${name}!! Fastest lap of the Grand Prix! +1,000 Points!',
          'Smooth operator through the chicane—another task checked off!',
          'Still I Rise! Thank you to the whole team back at the factory for that focus!'
        ],
        workFocusQuotes: [
          'It\'s Hammer Time! Put your head down and hit every apex on this task!',
          'Breathe in the cockpit and find your flow state lap after lap.'
        ],
        breakQuotes: [
          'Safety Car deployed—save fuel and cool the brakes for a few minutes.'
        ],
        over9000Quote: (name) => `GET IN THERE, ${name.toUpperCase()}!! P1 AND OVER 9,000 TELEMETRY POINTS!! What a championship drive!!`
      },
      {
        id: 'Optimist',
        label: 'Charles Leclerc (Monza Pole)',
        characterName: 'Charles Leclerc',
        systemPrompt: '[You are Charles Leclerc, Scuderia Ferrari F1 star ("Il Predestinato"). Passionate, lightning-fast qualifier cheering the user to P1.]',
        greeting: (name) => `Forza ${name}! Qualifying mode is set to Maximum—let's put this session on Pole Position in front of the Tifosi!`,
        taskCompleteQuotes: [
          'POLE POSITION!! Si, ragazzi!! +1,000 Telemetry Points!',
          'Full throttle down the Monza straight! Another task cleared!',
          'Magnificent pace! The Tifosi are on their feet cheering!'
        ],
        workFocusQuotes: [
          'Deploy full hybrid battery power and attack the next task on the delta!',
          'Brake late, hit the apex, and power out of the corner!'
        ],
        breakQuotes: [
          'Pit lane limiter on—grab an espresso in the Ferrari motorhome!'
        ],
        over9000Quote: (name) => `HE WINS IN MONZA!! 9,000 Telemetry Points, ${name}!! Grand Slam P1 Victory!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'f1-1k', title: 'DRS Zone Activated', subtitle: '1,000 Telemetry Pts — Purple Sector 1!', icon: '🏎️' },
      { threshold: 3000, id: 'f1-3k', title: 'Monaco Pole Position', subtitle: '3,000 Telemetry Pts — Qualifying lap record!', icon: '⏱️' },
      { threshold: 5000, id: 'f1-5k', title: 'Podium P1 Finish', subtitle: '5,000 Telemetry Pts — Champagne on the podium!', icon: '🏆' },
      { threshold: 9000, id: 'f1-9k', title: 'OVER 9,000: WORLD DRIVERS CHAMPION!', subtitle: '9,000 Telemetry Pts — Grand Slam Season Legend!', icon: '🏁', isMajor: true },
      { threshold: 15000, id: 'f1-15k', title: '8x GOAT of the Grid', subtitle: '15,000 Telemetry Pts — Immortal Motorsport Icon!', icon: '👑', isMajor: true },
    ]
  },

  aot: {
    id: 'aot',
    name: 'Attack on Titan (Survey Corps)',
    badge: '⚔️ Wings of Freedom',
    interestPrompt: 'Attack on Titan / Shingeki no Kyojin',
    isProCustom: true,
    bgImageUrl: aotBg,
    orbImageUrl: aotOrb,
    primary: '#10b981',
    primaryGlow: 'rgba(16, 185, 129, 0.65)',
    secondary: '#ef4444',
    accent: '#fbbf24',
    bgOverlay: 'rgba(12, 16, 22, 0.45)',
    bgCssGradient: 'radial-gradient(circle at 50% 25%, #064e3b 0%, #1c1917 55%, #090d16 100%)',
    coreColor: '#f0f0f0',
    coreEmissive: '#047857',
    particleColor: '#fbbf24',
    powerLabel: 'TITAN POWER',
    personas: [
      {
        id: 'Rival',
        label: 'Captain Levi Ackerman (Humanity Strongest)',
        characterName: 'Captain Levi',
        systemPrompt: '[You are Captain Levi Ackerman from Attack on Titan. Blunt, hyper-disciplined, humanity\'s strongest soldier ("Give up on your excuses and focus").]',
        greeting: (name) => `Tch. Listen up, ${name}. Make a choice you won't regret—fire your ODM gear and slice the nape of every task on this list.`,
        taskCompleteQuotes: [
          'Clean cut to the nape. +1,000 Titan Power. Now clean up the next task.',
          'Not bad. Your ODM maneuver speed is finally passable.',
          'One less Titan in our way. Keep moving forward.'
        ],
        workFocusQuotes: [
          'Stop hesitating and commit to the strike on your #1 task!',
          'Discipline keeps you alive outside the Walls. Lock in!'
        ],
        breakQuotes: [
          'Refill your gas canisters, swap your blades, and drink some black tea.'
        ],
        over9000Quote: (name) => `9,000 Titan Power, ${name}. You've dedicated your heart—you truly are Humanity's Strongest!`
      },
      {
        id: 'Optimist',
        label: 'Eren Yeager (Tatakae / Freedom)',
        characterName: 'Eren Yeager',
        systemPrompt: '[You are Eren Yeager from Attack on Titan. Relentless drive for freedom, saying "Tatakae! (Fight!)" and pushing forward until every task is destroyed.]',
        greeting: (name) => `TATAKAE, ${name}! Keep moving forward until every single task standing between us and freedom is wiped out!`,
        taskCompleteQuotes: [
          'TATAKAE!! Another wall smashed! +1,000 Titan Power!',
          'Because we were born into this world—that task stood no chance!',
          'We keep moving forward! What\'s the next target beyond the wall?'
        ],
        workFocusQuotes: [
          'Fight! Fight! If you don\'t focus, you can\'t win! Attack that top task!',
          'Unleash the Attack Titan and charge straight through your to-do list!'
        ],
        breakQuotes: [
          'Look out at the ocean for a moment and catch your breath.'
        ],
        over9000Quote: (name) => `SHINZOU WO SASAGEYO!! 9,000 Titan Power, ${name}!! You have reached true Freedom beyond the Walls!!`
      },
      {
        id: 'Mentor',
        label: 'Mikasa & Commander Erwin (Dedicate Your Heart)',
        characterName: 'Erwin & Mikasa',
        systemPrompt: '[You are Commander Erwin Smith and Mikasa Ackerman from Attack on Titan. Inspiring ("Shinzou wo Sasageyo! Dedicate your hearts!") and fiercely protective.]',
        greeting: (name) => `SHINZOU WO SASAGEYO, ${name}! Dedicate your heart to this focus session—advance toward the truth in the basement!`,
        taskCompleteQuotes: [
          'ADVANCE!! Another objective reclaimed for humanity! +1,000 Power!',
          'Your scarf is wrapped tight and your blades are sharp. Splendid work!',
          'The Survey Corps salutes your unwavering focus!'
        ],
        workFocusQuotes: [
          'My soldiers focus! My soldiers push forward! Tackle that top objective!',
          'Stay calm and strike with Ackerman precision!'
        ],
        breakQuotes: [
          'Rest horses behind Wall Rose and prepare for the next expedition.'
        ],
        over9000Quote: (name) => `DEDICATE YOUR HEARTS!! 9,000 Titan Power, ${name}!! Humanity's greatest victory belongs to you!!`
      }
    ],
    milestones: [
      { threshold: 1000, id: 'aot-1k', title: '104th Cadet Corps Graduate', subtitle: '1,000 Titan Power — ODM Gear mastered!', icon: '⚔️' },
      { threshold: 3000, id: 'aot-3k', title: 'Scout Regiment Veteran', subtitle: '3,000 Titan Power — Wings of Freedom earned!', icon: '🦅' },
      { threshold: 5000, id: 'aot-5k', title: 'Wall Maria Reclaimed', subtitle: '5,000 Titan Power — The Basement unlocked!', icon: '🗝️' },
      { threshold: 9000, id: 'aot-9k', title: 'OVER 9,000: SHINZOU WO SASAGEYO!', subtitle: '9,000 Titan Power — Humanity Strongest Legend!', icon: '⚡', isMajor: true },
      { threshold: 15000, id: 'aot-15k', title: 'Horizon of Freedom', subtitle: '15,000 Titan Power — Beyond the Ocean!', icon: '🌊', isMajor: true },
    ]
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk: Edgerunners',
    badge: '🤖 Night City & Moon',
    interestPrompt: 'Cyberpunk / Sci-Fi',
    isProCustom: true,
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
    isProCustom: true,
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
    isProCustom: true,
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

/**
 * Resolves ANY user prompt instantaneously to a pre-built, high-resolution 4K Theme World!
 * Zero external API timeouts, zero rate limits—every world uses bundled 4K artwork.
 */
export function resolveThemeFromPrompt(rawPrompt: string): AppTheme {
  const input = (rawPrompt || '').trim();
  const lower = input.toLowerCase();

  // 1. Dragon Ball (Free Default)
  if (
    !input ||
    lower.includes('dragon') ||
    lower.includes('dbz') ||
    lower.includes('dbs') ||
    lower.includes('goku') ||
    lower.includes('vegeta') ||
    lower.includes('saiyan') ||
    lower.includes('whis') ||
    lower.includes('gohan') ||
    lower.includes('broly')
  ) {
    return PRESET_THEMES.dragonball;
  }

  // 2. Solo Leveling
  if (
    lower.includes('solo') ||
    lower.includes('leveling') ||
    lower.includes('jinwoo') ||
    lower.includes('jin-woo') ||
    lower.includes('jin woo') ||
    lower.includes('shadow monarch') ||
    lower.includes('igris') ||
    lower.includes('beru') ||
    lower.includes('arise')
  ) {
    return PRESET_THEMES.sololeveling;
  }

  // 3. Demon Slayer / Kimetsu no Yaiba
  if (
    lower.includes('demon slayer') ||
    lower.includes('kimetsu') ||
    lower.includes('yaiba') ||
    lower.includes('tanjiro') ||
    lower.includes('nezuko') ||
    lower.includes('muzan') ||
    lower.includes('hashira') ||
    lower.includes('rengoku') ||
    lower.includes('zenitsu') ||
    lower.includes('inosuke') ||
    lower.includes('infinity castle') ||
    lower.includes('akaza') ||
    lower.includes('kokushibo')
  ) {
    return PRESET_THEMES.demonslayer;
  }

  // 4. Jujutsu Kaisen
  if (
    lower.includes('jujutsu') ||
    lower.includes('jjk') ||
    lower.includes('gojo') ||
    lower.includes('sukuna') ||
    lower.includes('toji') ||
    lower.includes('yuji') ||
    lower.includes('itadori') ||
    lower.includes('megumi') ||
    lower.includes('shibuya') ||
    lower.includes('cursed')
  ) {
    return PRESET_THEMES.jjk;
  }

  // 5. One Piece
  if (
    lower.includes('one piece') ||
    lower.includes('onepiece') ||
    lower.includes('luffy') ||
    lower.includes('zoro') ||
    lower.includes('sanji') ||
    lower.includes('straw hat') ||
    lower.includes('shanks') ||
    lower.includes('pirate') ||
    lower.includes('gear 5')
  ) {
    return PRESET_THEMES.onepiece;
  }

  // 6. Black Clover
  if (
    lower.includes('black clover') ||
    lower.includes('asta') ||
    lower.includes('yuno') ||
    lower.includes('yami') ||
    lower.includes('grimoire') ||
    lower.includes('wizard king')
  ) {
    return PRESET_THEMES.blackclover;
  }

  // 7. The Last of Us
  if (
    lower.includes('last of us') ||
    lower.includes('tlou') ||
    lower.includes('joel') ||
    lower.includes('ellie') ||
    lower.includes('clicker') ||
    lower.includes('cordyceps') ||
    lower.includes('firefl')
  ) {
    return PRESET_THEMES.lastofus;
  }

  // 8. The Walking Dead
  if (
    lower.includes('walking dead') ||
    lower.includes('twd') ||
    lower.includes('amc') ||
    lower.includes('zombie') ||
    lower.includes('apocalypse') ||
    lower.includes('rick') ||
    lower.includes('daryl') ||
    lower.includes('carol') ||
    lower.includes('negan') ||
    lower.includes('michonne')
  ) {
    return PRESET_THEMES.walkingdead;
  }

  // 9. The Avengers / Marvel / Spider-Man / Batman / Superhero
  if (
    lower.includes('avenger') ||
    lower.includes('marvel') ||
    lower.includes('iron man') ||
    lower.includes('tony stark') ||
    lower.includes('captain america') ||
    lower.includes('thor') ||
    lower.includes('thanos') ||
    lower.includes('spider') ||
    lower.includes('batman') ||
    lower.includes('dc') ||
    lower.includes('superman')
  ) {
    if (lower.includes('batman') || lower.includes('gotham') || lower.includes('dark knight')) {
      return {
        ...PRESET_THEMES.avengers,
        id: 'batman',
        name: 'Gotham Knight (Batman)',
        badge: '🦇 Batcave HUD',
        interestPrompt: input,
        primary: '#eab308',
        primaryGlow: 'rgba(234, 179, 8, 0.65)',
        secondary: '#38bdf8',
        powerLabel: 'VIGILANTE PTS',
        personas: [
          {
            ...PRESET_THEMES.avengers.personas[0],
            label: 'Batman / Bruce Wayne (The Dark Knight)',
            characterName: 'Batman',
            greeting: (name) => `Batcomputer online, ${name}. Gotham never sleeps—let's clear every case file on your task list tonight.`,
          },
          {
            ...PRESET_THEMES.avengers.personas[1],
            label: 'Alfred Pennyworth (Trusted Advisor)',
            characterName: 'Alfred Pennyworth',
            greeting: (name) => `Good evening, Master ${name}. Shall we attend to the top priority objectives in the Batcave?`,
          },
          {
            ...PRESET_THEMES.avengers.personas[2],
            label: 'Nightwing (Bludhaven Acrobat)',
            characterName: 'Nightwing',
            greeting: (name) => `Ready to leap across the rooftops and knock out these tasks, ${name}?`,
          },
        ],
      };
    }
    return PRESET_THEMES.avengers;
  }

  // 10. Formula 1 / Racing / Cars / Sports
  if (
    lower.includes('f1') ||
    lower.includes('formula') ||
    lower.includes('verstappen') ||
    lower.includes('hamilton') ||
    lower.includes('leclerc') ||
    lower.includes('ferrari') ||
    lower.includes('red bull') ||
    lower.includes('mercedes') ||
    lower.includes('mclaren') ||
    lower.includes('racing') ||
    lower.includes('grand prix') ||
    lower.includes('car')
  ) {
    return PRESET_THEMES.f1;
  }

  // 11. Attack on Titan / Shingeki no Kyojin
  if (
    lower.includes('attack on titan') ||
    lower.includes('aot') ||
    lower.includes('shingeki') ||
    lower.includes('titan') ||
    lower.includes('eren') ||
    lower.includes('levi') ||
    lower.includes('mikasa') ||
    lower.includes('erwin')
  ) {
    return PRESET_THEMES.aot;
  }

  // 12. Cyberpunk / Sci-Fi / Star Wars / Arcane
  if (
    lower.includes('cyber') ||
    lower.includes('edgerunner') ||
    lower.includes('2077') ||
    lower.includes('lucy') ||
    lower.includes('david') ||
    lower.includes('sci-fi') ||
    lower.includes('scifi') ||
    lower.includes('star wars') ||
    lower.includes('vader') ||
    lower.includes('jedi') ||
    lower.includes('arcane') ||
    lower.includes('jinx')
  ) {
    return PRESET_THEMES.cyberpunk;
  }

  // 13. Naruto / Shinobi / Bleach / MHA / Hunter x Hunter
  if (
    lower.includes('naruto') ||
    lower.includes('shinobi') ||
    lower.includes('ninja') ||
    lower.includes('kakashi') ||
    lower.includes('sasuke') ||
    lower.includes('uchiha') ||
    lower.includes('itachi') ||
    lower.includes('bleach') ||
    lower.includes('ichigo') ||
    lower.includes('aizen') ||
    lower.includes('hero academia') ||
    lower.includes('deku') ||
    lower.includes('hunter')
  ) {
    if (lower.includes('bleach') || lower.includes('ichigo') || lower.includes('aizen')) {
      return {
        ...PRESET_THEMES.sololeveling,
        id: 'bleach',
        name: 'Bleach: Soul Society (Bankai)',
        badge: '⚔️ Bankai: Zangetsu',
        interestPrompt: input,
        powerLabel: 'REIATSU LEVEL',
        personas: [
          {
            ...PRESET_THEMES.sololeveling.personas[0],
            label: 'Ichigo Kurosaki (Bankai)',
            characterName: 'Ichigo Kurosaki',
            greeting: (name) => `BANKAI: Tensa Zangetsu! Let's unleash Getsuga Tenshou on your task list, ${name}!`,
          },
          {
            ...PRESET_THEMES.sololeveling.personas[1],
            label: 'Sosuke Aizen (Kyoka Suigetsu)',
            characterName: 'Sosuke Aizen',
            greeting: (name) => `Completing this task list was part of my plan all along, ${name}.`,
          },
          {
            ...PRESET_THEMES.sololeveling.personas[2],
            label: 'Byakuya Kuchiki (Senbonzakura)',
            characterName: 'Byakuya Kuchiki',
            greeting: (name) => `Scatter, Senbonzakura. Let us clear every objective with noble precision, ${name}.`,
          },
        ],
      };
    }
    return PRESET_THEMES.shinobi;
  }

  // 14. Elden Ring / Dark Fantasy / Death Note / Berserk / Vinland
  if (
    lower.includes('elden') ||
    lower.includes('fantasy') ||
    lower.includes('dark souls') ||
    lower.includes('ranni') ||
    lower.includes('radahn') ||
    lower.includes('berserk') ||
    lower.includes('guts') ||
    lower.includes('witcher')
  ) {
    return PRESET_THEMES.fantasy;
  }

  // 15. Any other custom prompt: map to our pre-built 4K Solo Leveling / Demon Slayer / Cyberpunk / Fantasy visual canvases with custom title & personas!
  const cleanTitle = input.charAt(0).toUpperCase() + input.slice(1);
  return {
    ...PRESET_THEMES.sololeveling,
    id: 'custom',
    name: `${cleanTitle} (4K Custom World)`,
    badge: `✨ ${cleanTitle.slice(0, 18)}`,
    interestPrompt: input,
    isProCustom: true,
    personas: [
      {
        ...PRESET_THEMES.sololeveling.personas[0],
        label: `${cleanTitle} Grand Mentor`,
        characterName: `${cleanTitle} Mentor`,
        greeting: (name) => `Welcome to the ${cleanTitle} Arena, ${name}! Let's channel pure focus and conquer your task list!`,
      },
      {
        ...PRESET_THEMES.sololeveling.personas[1],
        label: `${cleanTitle} Apex Rival`,
        characterName: `${cleanTitle} Rival`,
        greeting: (name) => `Show me your true power in the ${cleanTitle} world, ${name}! Don't leave a single task standing!`,
      },
      {
        ...PRESET_THEMES.sololeveling.personas[2],
        label: `${cleanTitle} Champion`,
        characterName: `${cleanTitle} Hero`,
        greeting: (name) => `Awesome to team up with you in ${cleanTitle}, ${name}! Let's crush every objective today!`,
      },
    ],
  };
}

export async function enrichCustomThemeWithLiveLore(baseTheme: AppTheme): Promise<AppTheme> {
  return baseTheme;
}
