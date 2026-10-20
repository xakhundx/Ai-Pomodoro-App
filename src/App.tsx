import React, { useState, useEffect, useRef } from 'react';
import AvatarCanvas from './components/AvatarCanvas';
import { askGemini, Task } from './services/gemini';
import {
  AppTheme,
  AchievementMilestone,
  PRESET_THEMES,
  resolveThemeFromPrompt,
} from './themes/themeEngine';
import { APP_CONFIG } from './config/appConfig';
import './index.css';

interface UserProfile {
  nickname: string;
  gmail: string;
  interestPrompt: string;
  joinedAt: string;
  lastActive: string;
}

interface AdminNotification {
  id: string;
  type: 'feedback' | 'survey' | 'new_user';
  nickname: string;
  gmail: string;
  rating?: number;
  favoriteTheme?: string;
  featureRequest?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface MusicPreset {
  id: string;
  label: string;
  embedUrl: string;
  platform: 'Spotify' | 'Apple Music';
}

const MUSIC_PRESETS: MusicPreset[] = [
  {
    id: 'lofi-focus',
    label: '🎧 Deep Focus Lo-Fi Beats',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0',
    platform: 'Spotify',
  },
  {
    id: 'anime-hype',
    label: '🔥 Anime Training & Phonk',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0hWmn8d5pRe?utm_source=generator&theme=0',
    platform: 'Spotify',
  },
  {
    id: 'synthwave',
    label: '🤖 Cyberpunk Synthwave',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
    platform: 'Spotify',
  },
];

function convertToMusicEmbedUrl(rawUrl: string): string | null {
  const url = rawUrl.trim();
  if (!url) return null;
  if (url.includes('open.spotify.com/embed/') || url.includes('embed.music.apple.com/')) {
    return url;
  }
  if (url.includes('open.spotify.com/')) {
    const clean = url.split('?')[0];
    return clean.replace('open.spotify.com/', 'open.spotify.com/embed/') + '?utm_source=generator&theme=0';
  }
  if (url.includes('music.apple.com/')) {
    return url.replace('music.apple.com/', 'embed.music.apple.com/');
  }
  return null;
}

/**
 * Sends real email notifications to ammar.akhund2017@gmail.com via FormSubmit AJAX
 * and optional Google Apps Script webhook.
 */
async function sendEmailToOwner(
  subject: string,
  payload: Record<string, string | number>,
  webhookUrl?: string
) {
  try {
    await fetch(`https://formsubmit.co/ajax/${APP_CONFIG.OWNER_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'box',
        ...payload,
      }),
    });
  } catch {
    // Non-blocking fallback
  }

  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }
}

function App() {
  // 1. User Onboarding & Gmail Sign-In State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pomodoro-user-profile');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [userRegistry, setUserRegistry] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('pomodoro-user-registry');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  // Check if current signed-in user is the Owner (Ammar Akhund)
  const isOwner =
    userProfile?.gmail?.trim().toLowerCase() === APP_CONFIG.OWNER_EMAIL.toLowerCase();

  // Admin Notifications Inbox State (for Ammar Akhund)
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(() => {
    const saved = localStorage.getItem('pomodoro-admin-notifications');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [showAdminInboxModal, setShowAdminInboxModal] = useState(false);

  const addAdminNotification = (notif: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) => {
    const fullNotif: AdminNotification = {
      ...notif,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      createdAt: new Date().toLocaleString(),
      read: false,
    };
    setAdminNotifications(prev => {
      const updated = [fullNotif, ...prev];
      localStorage.setItem('pomodoro-admin-notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const unreadAdminCount = adminNotifications.filter(n => !n.read).length;

  // Onboarding Form Inputs
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(() => !userProfile);
  const [nicknameInput, setNicknameInput] = useState(userProfile?.nickname || '');
  const [gmailInput, setGmailInput] = useState(userProfile?.gmail || '');
  const [themePromptInput, setThemePromptInput] = useState(
    userProfile?.interestPrompt || localStorage.getItem('pomodoro-theme-prompt') || 'Dragon Ball'
  );
  const [onboardingError, setOnboardingError] = useState('');

  // Active Modals & Docks
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showGoogleSurveyModal, setShowGoogleSurveyModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showMusicDock, setShowMusicDock] = useState(false);
  const [showReminderSyncModal, setShowReminderSyncModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  // Real-time AI Theme Synthesis Loading Overlay
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [themeGenStage, setThemeGenStage] = useState('');
  const [themeGenProgress, setThemeGenProgress] = useState(0);
  const [welcomeThemeBanner, setWelcomeThemeBanner] = useState<string | null>(null);

  // Pro Tier Status & Stripe URL Return Check
  const [isProMember, setIsProMember] = useState<boolean>(() => {
    return localStorage.getItem('pomodoro-pro-member') === 'true';
  });
  const [stripeCheckoutUrl, setStripeCheckoutUrl] = useState<string>(
    () => localStorage.getItem('pomodoro-stripe-url') || APP_CONFIG.PRO_CHECKOUT_URL
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pro') === 'success') {
      setIsProMember(true);
      localStorage.setItem('pomodoro-pro-member', 'true');
      setWelcomeThemeBanner('🎉 Welcome to Focus Arena PRO! All custom AI worlds & features are unlocked!');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // 1-Click Music Play / Pause Engine + Spotify Sync
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [activeMusicEmbed, setActiveMusicEmbed] = useState<string>(() => {
    return localStorage.getItem('pomodoro-music-embed') || MUSIC_PRESETS[0].embedUrl;
  });
  const [customMusicUrlInput, setCustomMusicUrlInput] = useState('');
  const [musicError, setMusicError] = useState('');
  const [spotifyAppSyncStatus, setSpotifyAppSyncStatus] = useState<string>('Synced with System Media');
  const ambientAudioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Toggle Music ON/OFF directly when clicking the top-bar Music button!
  const handleToggleMusicButton = () => {
    const nextPlaying = !isMusicPlaying;
    setIsMusicPlaying(nextPlaying);

    try {
      if (nextPlaying) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          if (!ambientAudioCtxRef.current) {
            const ctx = new AudioContextClass();
            ambientAudioCtxRef.current = ctx;

            // Create warm binaural focus drone (432Hz + 216Hz + 324Hz)
            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
            masterGain.connect(ctx.destination);
            ambientGainRef.current = masterGain;

            [216, 324, 432].forEach(freq => {
              const osc = ctx.createOscillator();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, ctx.currentTime);
              osc.connect(masterGain);
              osc.start();
            });
          } else if (ambientAudioCtxRef.current.state === 'suspended') {
            ambientAudioCtxRef.current.resume();
          }
        }
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'playing';
        }
      } else {
        if (ambientAudioCtxRef.current && ambientAudioCtxRef.current.state === 'running') {
          ambientAudioCtxRef.current.suspend();
        }
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'paused';
        }
      }
    } catch (e) {
      console.warn('Music toggle warning:', e);
    }
  };

  // Post-Session Reminder & Calendar/OneNote Sync State
  const [sessionReminderText, setSessionReminderText] = useState<string>(
    () => localStorage.getItem('pomodoro-session-reminder') || ''
  );
  const [reminderDraftInput, setReminderDraftInput] = useState<string>(
    () => localStorage.getItem('pomodoro-session-reminder') || ''
  );
  const [reminderConfirmMsg, setReminderConfirmMsg] = useState<string>('');
  const [reminderAlertBanner, setReminderAlertBanner] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string>('');

  // Webhook URL state
  const [webhookUrl, setWebhookUrl] = useState<string>(
    () => localStorage.getItem('pomodoro-webhook-url') || APP_CONFIG.USER_TRACKING_WEBHOOK_URL
  );

  // Theme State
  const [activeTheme, setActiveTheme] = useState<AppTheme>(() => {
    const savedPrompt =
      userProfile?.interestPrompt || localStorage.getItem('pomodoro-theme-prompt') || 'Dragon Ball';
    return resolveThemeFromPrompt(savedPrompt);
  });

  // Apply CSS Theme Variables dynamically
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', activeTheme.primary);
    root.style.setProperty('--primary-glow', activeTheme.primaryGlow);
    root.style.setProperty('--secondary', activeTheme.secondary);
    root.style.setProperty('--accent', activeTheme.accent);
    root.style.setProperty('--bg-overlay', activeTheme.bgOverlay);
    root.style.setProperty('--bg-gradient', activeTheme.bgCssGradient);
    localStorage.setItem('pomodoro-theme-prompt', activeTheme.interestPrompt);
  }, [activeTheme]);

  // Task State + Hover Pop-up & Copy State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pomodoro-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  const handleCopyTask = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    navigator.clipboard.writeText(task.text).then(() => {
      setCopiedTaskId(task.id);
      setTimeout(() => {
        setCopiedTaskId(prev => (prev === task.id ? null : prev));
      }, 1800);
    });
  };

  // Gamification & Power Level
  const [assistantName, setAssistantName] = useState(
    () => localStorage.getItem('assistantName') || userProfile?.nickname || 'XAKHUNDX'
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [aiPersonality, setAiPersonality] = useState(
    () => localStorage.getItem('aiPersonality') || 'Mentor'
  );

  const [powerLevel, setPowerLevel] = useState<number>(() => {
    const v2Saved = localStorage.getItem('pomodoro-power-v2');
    if (v2Saved !== null) {
      return parseInt(v2Saved, 10) || 0;
    }
    return APP_CONFIG.INITIAL_POWER_LEVEL;
  });

  // Achievement Queue & Unlocked Milestones
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pomodoro-unlocked-achievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [achievementQueue, setAchievementQueue] = useState<AchievementMilestone[]>([]);
  const [currentToast, setCurrentToast] = useState<AchievementMilestone | null>(null);
  const [burstTrigger, setBurstTrigger] = useState(0);

  // Feedback & Google-Forms-Style Survey State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [surveyRating, setSurveyRating] = useState(5);
  const [surveyFavTheme, setSurveyFavTheme] = useState('Dragon Ball Super');
  const [surveyThemeRequest, setSurveyThemeRequest] = useState('');
  const [surveyComments, setSurveyComments] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // Resolve current Persona object from activeTheme
  const currentPersona =
    activeTheme.personas.find(p => p.id === aiPersonality) || activeTheme.personas[0];

  // Sound Design Engine
  const playSound = (type: 'ding' | 'hum' | 'achievement' | 'over9000') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const playTone = (
        freq: number,
        startOffset: number,
        duration: number,
        wave: OscillatorType = 'sine',
        peakGain = 0.12
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
        gain.gain.linearRampToValueAtTime(peakGain, ctx.currentTime + startOffset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startOffset);
        osc.stop(ctx.currentTime + startOffset + duration);
      };

      if (type === 'ding') {
        playTone(659.25, 0, 0.18, 'sine', 0.08);
        playTone(880, 0.08, 0.3, 'sine', 0.1);
      } else if (type === 'hum') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 1.4);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.4);
      } else if (type === 'achievement') {
        playTone(523.25, 0, 0.22, 'triangle', 0.12);
        playTone(659.25, 0.12, 0.22, 'triangle', 0.12);
        playTone(783.99, 0.24, 0.45, 'triangle', 0.15);
      } else if (type === 'over9000') {
        playTone(523.25, 0, 0.2, 'sawtooth', 0.1);
        playTone(659.25, 0.12, 0.2, 'sawtooth', 0.1);
        playTone(783.99, 0.24, 0.2, 'sawtooth', 0.12);
        playTone(1046.5, 0.38, 0.35, 'sawtooth', 0.15);
        playTone(1318.5, 0.55, 0.85, 'triangle', 0.18);
      }
    } catch (e) {
      console.error('Audio failed', e);
    }
  };

  // Persist core states
  useEffect(() => {
    localStorage.setItem('assistantName', assistantName);
    localStorage.setItem('aiPersonality', aiPersonality);
    localStorage.setItem('pomodoro-power-v2', powerLevel.toString());
  }, [assistantName, aiPersonality, powerLevel]);

  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pomodoro-unlocked-achievements', JSON.stringify(unlockedAchievementIds));
  }, [unlockedAchievementIds]);

  // Check for newly unlocked Achievement Milestones whenever powerLevel rises
  useEffect(() => {
    if (powerLevel <= 0) return;
    const newlyUnlocked = activeTheme.milestones.filter(
      m => powerLevel >= m.threshold && !unlockedAchievementIds.includes(m.id)
    );
    if (newlyUnlocked.length > 0) {
      setUnlockedAchievementIds(prev => [...prev, ...newlyUnlocked.map(m => m.id)]);
      setAchievementQueue(prev => [...prev, ...newlyUnlocked]);
      setBurstTrigger(prev => prev + 1);

      const hasMajor = newlyUnlocked.some(m => m.threshold >= APP_CONFIG.OVER_9000_THRESHOLD);
      if (hasMajor) {
        playSound('over9000');
        setChatMessage(
          currentPersona.over9000Quote(userProfile?.nickname || assistantName)
        );
      } else {
        playSound('achievement');
      }
    }
  }, [powerLevel, activeTheme]);

  // Process the Achievement Queue one toast at a time
  useEffect(() => {
    if (!currentToast && achievementQueue.length > 0) {
      const next = achievementQueue[0];
      setCurrentToast(next);
      setAchievementQueue(prev => prev.slice(1));
    }
  }, [currentToast, achievementQueue]);

  useEffect(() => {
    if (!currentToast) return;
    const duration = currentToast.isMajor ? 6500 : 4200;
    const timer = window.setTimeout(() => {
      setCurrentToast(null);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentToast]);

  // Enhanced High-Accuracy Voice Dictation (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalizedTextRef = useRef<string>('');

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = navigator.language || 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    finalizedTextRef.current = newTaskText.trim() ? `${newTaskText.trim()} ` : '';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptChunk = result[0].transcript;
        if (result.isFinal) {
          finalizedTextRef.current += `${transcriptChunk.trim()} `;
        } else {
          interimTranscript += transcriptChunk;
        }
      }
      const combined = `${finalizedTextRef.current}${interimTranscript}`.replace(/\s+/g, ' ').trimStart();
      const formatted = combined.length > 0 ? combined.charAt(0).toUpperCase() + combined.slice(1) : '';
      setNewTaskText(formatted);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition notice:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Timer State (with explicit Minutes & Seconds support!)
  const [workDuration, setWorkDuration] = useState(() =>
    parseInt(localStorage.getItem('pomodoro-work-time') || '25', 10)
  );
  const [workSecondsExtra, setWorkSecondsExtra] = useState(() =>
    parseInt(localStorage.getItem('pomodoro-work-secs') || '0', 10)
  );
  const [breakDuration, setBreakDuration] = useState(() =>
    parseInt(localStorage.getItem('pomodoro-break-time') || '5', 10)
  );
  const [timeLeft, setTimeLeft] = useState(workDuration * 60 + workSecondsExtra);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'Work' | 'Break'>('Work');
  const [isEditingTimer, setIsEditingTimer] = useState(false);
  const [editMinsInput, setEditMinsInput] = useState('25');
  const [editSecsInput, setEditSecsInput] = useState('0');

  // Panel Collapse States
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  // Chat State
  const [chatMessage, setChatMessage] = useState(() =>
    currentPersona.greeting(userProfile?.nickname || assistantName)
  );
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Update greeting when theme or persona changes
  useEffect(() => {
    setChatMessage(currentPersona.greeting(userProfile?.nickname || assistantName));
  }, [activeTheme.id, aiPersonality]);

  // Dynamic Browser Tab Title
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    document.title = isRunning
      ? `(${mins}:${secs}) ${mode} - ${activeTheme.name}`
      : `Focus Arena by ${APP_CONFIG.OWNER_NAME}`;
  }, [timeLeft, isRunning, mode, activeTheme.name]);

  useEffect(() => {
    localStorage.setItem('pomodoro-work-time', workDuration.toString());
    localStorage.setItem('pomodoro-work-secs', workSecondsExtra.toString());
    localStorage.setItem('pomodoro-break-time', breakDuration.toString());
  }, [workDuration, workSecondsExtra, breakDuration]);

  const handleTimerClick = () => {
    if (isRunning) return;
    setIsEditingTimer(true);
    setEditMinsInput(Math.floor(timeLeft / 60).toString());
    setEditSecsInput((timeLeft % 60).toString());
  };

  const handleTimerSubmit = () => {
    setIsEditingTimer(false);
    const parsedMins = Math.max(0, parseInt(editMinsInput, 10) || 0);
    const parsedSecs = Math.max(0, Math.min(59, parseInt(editSecsInput, 10) || 0));
    const totalSecs = Math.max(1, parsedMins * 60 + parsedSecs);
    setTimeLeft(totalSecs);
    if (mode === 'Work') {
      setWorkDuration(Math.floor(totalSecs / 60));
      setWorkSecondsExtra(totalSecs % 60);
    } else {
      setBreakDuration(Math.max(1, Math.floor(totalSecs / 60)));
    }
  };

  const handleQuickTimerSet = (mins: number, secs: number) => {
    setIsRunning(false);
    setIsEditingTimer(false);
    const total = Math.max(1, mins * 60 + secs);
    setTimeLeft(total);
    if (mode === 'Work') {
      setWorkDuration(mins);
      setWorkSecondsExtra(secs);
    }
  };

  const handleWorkMinChange = (val: number) => {
    const cleanMin = Math.max(0, val);
    setWorkDuration(cleanMin);
    if (!isRunning && mode === 'Work') {
      setTimeLeft(Math.max(1, cleanMin * 60 + workSecondsExtra));
    }
  };

  const handleWorkSecChange = (val: number) => {
    const cleanSec = Math.max(0, Math.min(59, val));
    setWorkSecondsExtra(cleanSec);
    if (!isRunning && mode === 'Work') {
      setTimeLeft(Math.max(1, workDuration * 60 + cleanSec));
    }
  };

  const handleBreakChange = (val: number) => {
    if (val < 1) val = 1;
    setBreakDuration(val);
    if (!isRunning && mode === 'Break') setTimeLeft(val * 60);
  };

  // Timer Countdown Logic + Post-Session Reminder Alert
  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      playSound('achievement');
      setIsRunning(false);

      // Trigger Post-Session Reminder if set!
      if (sessionReminderText.trim()) {
        setReminderAlertBanner(sessionReminderText.trim());
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('⏰ Post-Session Reminder — Focus Arena', {
            body: sessionReminderText.trim(),
          });
        }
      }

      if (mode === 'Work') {
        const nextPower = powerLevel + APP_CONFIG.POWER_PER_POMODORO;
        setPowerLevel(nextPower);
        handleAIInteraction(
          `The Work session has elapsed! What should I prioritize next?`,
          nextPower
        );
        setMode('Break');
        setTimeLeft(breakDuration * 60);
      } else {
        handleAIInteraction(`Break is over! Ready to jump back into Work mode.`);
        setMode('Work');
        setTimeLeft(Math.max(1, workDuration * 60 + workSecondsExtra));
      }
    }
    return () => clearInterval(interval);
  }, [
    isRunning,
    timeLeft,
    mode,
    workDuration,
    workSecondsExtra,
    breakDuration,
    powerLevel,
    sessionReminderText,
  ]);

  const toggleTimer = () => {
    if (!isRunning) playSound('hum');
    setIsRunning(!isRunning);
  };

  const switchMode = (newMode: 'Work' | 'Break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(
      newMode === 'Work'
        ? Math.max(1, workDuration * 60 + workSecondsExtra)
        : breakDuration * 60
    );
  };

  // Task Handlers
  const addTask = () => {
    if (!newTaskText.trim()) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setTasks([...tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText('');
    finalizedTextRef.current = '';
  };

  const toggleTask = (id: string, text: string, completed: boolean) => {
    const nextCompleted = !completed;
    const updatedTasks = tasks.map(t => (t.id === id ? { ...t, completed: nextCompleted } : t));
    setTasks(updatedTasks);

    if (nextCompleted) {
      playSound('ding');
      const nextPower = powerLevel + APP_CONFIG.POWER_PER_TASK;
      setPowerLevel(nextPower);
      setBurstTrigger(prev => prev + 1);
      if (nextPower < APP_CONFIG.OVER_9000_THRESHOLD || powerLevel >= APP_CONFIG.OVER_9000_THRESHOLD) {
        handleAIInteraction(
          `Task status update: Just completed "${text}".`,
          nextPower,
          updatedTasks
        );
      }
    } else {
      setPowerLevel(prev => Math.max(0, prev - APP_CONFIG.POWER_PER_TASK));
    }
  };

  const updateTaskText = (id: string, newText: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, text: newText } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleClearAllTasks = () => {
    if (tasks.length === 0) return;
    setTasks([]);
    setChatMessage(
      `Task list cleared clean, ${userProfile?.nickname || assistantName}! Ready for a fresh batch of objectives.`
    );
  };

  const handleResetPowerLevel = () => {
    setPowerLevel(0);
    setUnlockedAchievementIds([]);
    setAchievementQueue([]);
    setCurrentToast(null);
    setChatMessage(
      `${activeTheme.powerLabel} reset to 0! Complete tasks (+1,000 each) to climb back to 9,000!`
    );
  };

  // Drag and Drop Reordering
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);
  const handleDragStart = (index: number) => setDraggedTaskIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDragOverContainer = (e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    if (y < 40) container.scrollTop -= 10;
    else if (y > rect.height - 40) container.scrollTop += 10;
  };

  const handleDrop = (index: number) => {
    if (draggedTaskIndex === null || draggedTaskIndex === index) return;
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(draggedTaskIndex, 1);
    newTasks.splice(index, 0, movedTask);
    setTasks(newTasks);
    setDraggedTaskIndex(null);
  };

  // AI Interaction Handler
  const handleAIInteraction = async (
    prompt: string,
    overridePower?: number,
    overrideTasks?: Task[]
  ) => {
    setIsTyping(true);
    const response = await askGemini(
      prompt,
      overrideTasks || tasks,
      { mode, timeLeft },
      currentPersona,
      userProfile?.nickname || assistantName,
      overridePower ?? powerLevel
    );
    setChatMessage(response);
    setIsTyping(false);
  };

  const handleChatSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim()) {
      handleAIInteraction(userInput);
      setUserInput('');
    }
  };

  // Real-Time AI Theme Synthesis Pipeline (with animated progress & image preloading)
  const triggerThemeGenerationWithLoading = (promptValue: string) => {
    const clean = promptValue.trim() || 'Dragon Ball';
    setThemePromptInput(clean);
    const resolved = resolveThemeFromPrompt(clean);

    // If it's a custom AI theme, show the real-time generation screen!
    setIsGeneratingTheme(true);
    setThemeGenProgress(15);
    setThemeGenStage(`Analyzing universe lore & characters for "${clean}"...`);

    setTimeout(() => {
      setThemeGenProgress(45);
      setThemeGenStage(`Synthesizing 4K Widescreen Environment (${resolved.name})...`);
    }, 600);

    setTimeout(() => {
      setThemeGenProgress(78);
      setThemeGenStage(
        `Rendering 3D Orb Personas (${resolved.personas.map(p => p.characterName).join(', ')})...`
      );
    }, 1250);

    setTimeout(() => {
      setThemeGenProgress(100);
      setActiveTheme(resolved);
      if (userProfile) {
        const updated = {
          ...userProfile,
          interestPrompt: clean,
          lastActive: new Date().toISOString(),
        };
        setUserProfile(updated);
        localStorage.setItem('pomodoro-user-profile', JSON.stringify(updated));
      }
      setIsGeneratingTheme(false);
      setWelcomeThemeBanner(`✨ Welcome to your Premium AI Theme: ${resolved.name}!`);
      playSound('achievement');
      setTimeout(() => setWelcomeThemeBanner(null), 5000);
    }, 1900);
  };

  // Onboarding & Gmail Sign-In Handler + Automated Email Notification
  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNickname = nicknameInput.trim();
    const cleanGmail = gmailInput.trim().toLowerCase();
    const cleanPrompt = themePromptInput.trim() || 'Dragon Ball';

    if (!cleanNickname) {
      setOnboardingError('Please enter a nickname for your persona.');
      return;
    }
    if (!cleanGmail || !cleanGmail.includes('@')) {
      setOnboardingError('Please sign in with a valid Gmail address (e.g. yourname@gmail.com).');
      return;
    }

    const now = new Date().toISOString();
    const isNewUser = !userRegistry.some(u => u.gmail === cleanGmail);
    const newProfile: UserProfile = {
      nickname: cleanNickname,
      gmail: cleanGmail,
      interestPrompt: cleanPrompt,
      joinedAt: userProfile?.joinedAt || now,
      lastActive: now,
    };

    setUserProfile(newProfile);
    localStorage.setItem('pomodoro-user-profile', JSON.stringify(newProfile));
    setAssistantName(cleanNickname.toUpperCase());

    const existingIdx = userRegistry.findIndex(u => u.gmail === cleanGmail);
    let updatedRegistry: UserProfile[];
    if (existingIdx >= 0) {
      updatedRegistry = [...userRegistry];
      updatedRegistry[existingIdx] = newProfile;
    } else {
      updatedRegistry = [newProfile, ...userRegistry];
    }
    setUserRegistry(updatedRegistry);
    localStorage.setItem('pomodoro-user-registry', JSON.stringify(updatedRegistry));

    if (isNewUser) {
      addAdminNotification({
        type: 'new_user',
        nickname: cleanNickname,
        gmail: cleanGmail,
        message: `New user signed in with theme interest: "${cleanPrompt}"`,
      });

      sendEmailToOwner(
        `🚀 New Focus Arena User Sign-In: ${cleanNickname} (${cleanGmail})`,
        {
          Event: 'New User Sign-In',
          Nickname: cleanNickname,
          User_Gmail: cleanGmail,
          Selected_Theme: cleanPrompt,
          Timestamp: new Date().toLocaleString(),
          _autoresponse: `Welcome to Focus Arena (AI Pomodoro) by Ammar Akhund! Thank you for signing in, ${cleanNickname}. Your custom ${cleanPrompt} workspace is ready. We appreciate your feedback anytime!`,
        },
        webhookUrl
      );
    }

    setOnboardingError('');
    setShowOnboardingModal(false);
    triggerThemeGenerationWithLoading(cleanPrompt);
  };

  // Submit Instant 5-Star In-App Feedback
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    const senderName = userProfile?.nickname || assistantName;
    const senderGmail = userProfile?.gmail || 'anonymous@gmail.com';

    addAdminNotification({
      type: 'feedback',
      nickname: senderName,
      gmail: senderGmail,
      rating: feedbackRating,
      message: feedbackMessage.trim(),
    });

    sendEmailToOwner(
      `⭐ New ${feedbackRating}/5 Feedback on Focus Arena from ${senderName}`,
      {
        Type: 'Instant In-App Feedback',
        Nickname: senderName,
        User_Gmail: senderGmail,
        Star_Rating: `${feedbackRating} / 5 Stars`,
        Feedback_Message: feedbackMessage.trim(),
        Active_Theme: activeTheme.name,
        Timestamp: new Date().toLocaleString(),
      },
      webhookUrl
    );

    setFeedbackMessage('');
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3500);
  };

  // Submit Full Google-Forms-Style Survey
  const handleGoogleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const senderName = userProfile?.nickname || assistantName;
    const senderGmail = userProfile?.gmail || 'anonymous@gmail.com';

    addAdminNotification({
      type: 'survey',
      nickname: senderName,
      gmail: senderGmail,
      rating: surveyRating,
      favoriteTheme: surveyFavTheme,
      featureRequest: surveyThemeRequest,
      message: surveyComments || `Requested Theme/Feature: ${surveyThemeRequest}`,
    });

    sendEmailToOwner(
      `📋 Full Survey Response (${surveyRating}/5⭐) from ${senderName}`,
      {
        Type: 'Full Feedback Form Response',
        Nickname: senderName,
        User_Gmail: senderGmail,
        Overall_Rating: `${surveyRating} / 5`,
        Favorite_Theme: surveyFavTheme,
        Requested_Themes_Or_Characters: surveyThemeRequest || 'None specified',
        Detailed_Feedback: surveyComments || 'None specified',
        Timestamp: new Date().toLocaleString(),
      },
      webhookUrl
    );

    setSurveyThemeRequest('');
    setSurveyComments('');
    setSurveySubmitted(true);
    setTimeout(() => {
      setSurveySubmitted(false);
      setShowGoogleSurveyModal(false);
    }, 2200);
  };

  // Calendar (.ics & Google Calendar) + Microsoft OneNote Sync Helpers
  const handleGoogleCalendarSync = () => {
    const pendingTasks = tasks.filter(t => !t.completed).map(t => `• ${t.text}`).join('\n');
    const title = encodeURIComponent(`⚡ Focus Arena Session (${activeTheme.name})`);
    const details = encodeURIComponent(
      `Focus Session in Focus Arena by ${APP_CONFIG.OWNER_NAME}\n\nTasks to Complete:\n${
        pendingTasks || '• Deep Focus Session'
      }\n\nReminder after session: ${sessionReminderText || 'None'}`
    );
    const start = new Date();
    const end = new Date(start.getTime() + (workDuration * 60 + workSecondsExtra) * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${fmt(
      start
    )}/${fmt(end)}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcsCalendar = () => {
    const start = new Date();
    const end = new Date(start.getTime() + (workDuration * 60 + workSecondsExtra) * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const pendingTasks = tasks.filter(t => !t.completed).map(t => `- ${t.text}`).join('\\n');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Focus Arena by Ammar Akhund//EN',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:Focus Arena Session (${activeTheme.name})`,
      `DESCRIPTION:Tasks:\\n${pendingTasks || 'Deep Focus'}\\nReminder: ${sessionReminderText || 'None'}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'focus-arena-session.ics';
    link.click();
    setSyncSuccessMsg('✓ Downloaded .ics Calendar event for Outlook / Apple Calendar!');
    setTimeout(() => setSyncSuccessMsg(''), 3500);
  };

  const handleOneNoteSync = () => {
    const dateStr = new Date().toLocaleDateString();
    const noteBody = [
      `📓 FOCUS ARENA — SESSION NOTES (${dateStr})`,
      `Theme: ${activeTheme.name} | ${activeTheme.powerLabel}: ${powerLevel.toLocaleString()}`,
      `Post-Session Reminder: ${sessionReminderText || 'None'}`,
      ``,
      `✅ COMPLETED TASKS:`,
      ...(tasks.filter(t => t.completed).map(t => `[x] ${t.text}`) || ['None yet']),
      ``,
      `⏳ PENDING TASKS:`,
      ...(tasks.filter(t => !t.completed).map(t => `[ ] ${t.text}`) || ['All clear!']),
      ``,
      `— Exported from Focus Arena by ${APP_CONFIG.OWNER_NAME}`,
    ].join('\n');

    navigator.clipboard.writeText(noteBody).then(() => {
      setSyncSuccessMsg(
        '✓ Structured checklist copied! Paste (Ctrl+V) directly into Microsoft OneNote or Notion!'
      );
      setTimeout(() => setSyncSuccessMsg(''), 4500);
    });
  };

  // Export CSV for Owner Admin
  const handleExportUsersCsv = () => {
    const rows = [
      ['Nickname', 'Gmail', 'Theme Interest', 'Joined At', 'Last Active'],
      ...userRegistry.map(u => [u.nickname, u.gmail, u.interestPrompt, u.joinedAt, u.lastActive]),
    ];
    const csv = rows.map(r => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'focus-arena-users.csv';
    link.click();
  };

  // Format Time
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  const completedCount = tasks.filter(t => t.completed).length;
  const progressTo9000 = Math.min(100, Math.round((powerLevel / APP_CONFIG.OVER_9000_THRESHOLD) * 100));
  const previewTheme = resolveThemeFromPrompt(themePromptInput);
  const activeUsersCount = Math.max(1, userRegistry.length);

  return (
    <div
      className={`app-container dbz-bg ${isRunning && mode === 'Work' ? 'focus-mode' : ''}`}
      style={{
        backgroundImage: activeTheme.bgImageUrl
          ? `url(${activeTheme.bgImageUrl})`
          : activeTheme.bgCssGradient,
      }}
    >
      {/* 3D Interactive Core Canvas */}
      <div className="canvas-container">
        <AvatarCanvas
          mode={mode}
          isRunning={isRunning}
          theme={activeTheme}
          burstTrigger={burstTrigger}
        />
      </div>

      {/* Real-Time AI Theme Generation Processing Overlay */}
      {isGeneratingTheme && (
        <div className="modal-backdrop" style={{ zIndex: 90 }}>
          <div className="modal-card" style={{ textAlign: 'center', alignItems: 'center' }}>
            <div style={{ fontSize: '3rem', animation: 'float 1.5s infinite' }}>⚡</div>
            <h2>Synthesizing Custom AI World...</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 700 }}>
              {themeGenStage}
            </p>
            <div className="power-bar-track" style={{ height: '12px', marginTop: '8px' }}>
              <div className="power-bar-fill" style={{ width: `${themeGenProgress}%` }} />
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {themeGenProgress}% Complete — Building 4K Environment & 3D Orb Shaders
            </span>
          </div>
        </div>
      )}

      {/* Welcome to Premium AI Theme Banner */}
      {welcomeThemeBanner && (
        <div className="achievement-toast major" style={{ zIndex: 75 }}>
          <div style={{ fontSize: '2rem' }}>✨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fde047' }}>
              CUSTOM AI WORLD READY
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fff' }}>
              {welcomeThemeBanner}
            </div>
          </div>
          <button
            className="outline"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
            onClick={() => setWelcomeThemeBanner(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Achievement Unlocked Banner (Queue Toast) */}
      {currentToast && (
        <div className={`achievement-toast ${currentToast.isMajor ? 'major' : ''}`}>
          <div style={{ fontSize: '2.4rem', lineHeight: 1 }}>{currentToast.icon}</div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: currentToast.isMajor ? '#fde047' : 'var(--accent)',
                fontWeight: 800,
              }}
            >
              {currentToast.isMajor ? '⚡ LEGENDARY MILESTONE UNLOCKED ⚡' : '🏆 Achievement Unlocked'}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
              {currentToast.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {currentToast.subtitle}
            </div>
          </div>
          <button
            className="outline"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            onClick={() => setCurrentToast(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Post-Session Reminder Pop-Up Alert */}
      {reminderAlertBanner && (
        <div className="achievement-toast major" style={{ top: '9.5rem' }}>
          <div style={{ fontSize: '2.2rem' }}>⏰</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fde047', letterSpacing: '1px' }}>
              POST-SESSION REMINDER
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {reminderAlertBanner}
            </div>
          </div>
          <button
            onClick={() => {
              setReminderAlertBanner(null);
              setSessionReminderText('');
              setReminderDraftInput('');
            }}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          >
            ✓ Done
          </button>
        </div>
      )}

      {/* Top Navigation & Community Bar */}
      <div className="top-nav-bar">
        <button
          className="nav-pill active-dot"
          onClick={() => {
            setNicknameInput(userProfile?.nickname || assistantName);
            setGmailInput(userProfile?.gmail || '');
            setThemePromptInput(activeTheme.interestPrompt);
            setShowOnboardingModal(true);
          }}
          title="Edit Nickname, Gmail Sign-In, or Interest"
        >
          <span>
            {isOwner ? '👑 ' : '👤 '}
            {userProfile?.nickname || assistantName}
          </span>
          {(isProMember || isOwner) && (
            <span
              style={{
                background: 'linear-gradient(135deg, #facc15, #f97316)',
                color: '#090d16',
                fontSize: '0.65rem',
                fontWeight: 900,
                padding: '1px 6px',
                borderRadius: '999px',
              }}
            >
              PRO
            </span>
          )}
        </button>

        <button
          className="nav-pill"
          onClick={() => setShowThemeModal(true)}
          title="Customize or Generate AI Theme by Interest"
        >
          🎨 {activeTheme.badge}
        </button>

        <button
          className="nav-pill"
          onClick={() => setShowAchievementsModal(true)}
          title="View Power Milestones & Achievement Queue"
        >
          🏆 {unlockedAchievementIds.length}/{activeTheme.milestones.length}
        </button>

        <button
          className="nav-pill"
          onClick={() => setShowUsersModal(true)}
          title={
            isOwner
              ? 'Owner Admin Dashboard (View Emails & CSV)'
              : 'View Active Warriors Leaderboard'
          }
        >
          🟢 {activeUsersCount} {activeUsersCount === 1 ? 'Warrior' : 'Warriors'}
        </button>

        <button
          className="nav-pill"
          onClick={() => setShowFeedbackModal(true)}
          style={{ borderColor: 'var(--primary)' }}
          title="Open Feedback Form or Instant Rating"
        >
          💬 Feedback
        </button>

        {/* 1-Click Play/Pause Music Cell + Playlist Dock Chevron */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
          <button
            className="nav-pill"
            onClick={handleToggleMusicButton}
            style={{
              borderRadius: '999px 0 0 999px',
              borderColor: isMusicPlaying ? '#22c55e' : 'rgba(255,255,255,0.16)',
              background: isMusicPlaying ? 'rgba(34, 197, 94, 0.22)' : 'rgba(255,255,255,0.06)',
            }}
            title="Click once to Play Focus Music; click again to Pause/Turn Off all music"
          >
            {isMusicPlaying ? '🔊 Music: ON' : '🎵 Music: OFF'}
          </button>
          <button
            className="nav-pill"
            onClick={() => setShowMusicDock(!showMusicDock)}
            style={{
              borderRadius: '0 999px 999px 0',
              padding: '0.42rem 0.55rem',
              borderLeft: 'none',
              borderColor: showMusicDock ? 'var(--primary)' : 'rgba(255,255,255,0.16)',
            }}
            title="Open Spotify / Apple Music Playlist Hub"
          >
            🎧 ▾
          </button>
        </div>

        <button
          className="nav-pill"
          onClick={() => {
            setReminderDraftInput(sessionReminderText);
            setReminderConfirmMsg('');
            setShowReminderSyncModal(true);
          }}
          style={{
            borderColor: sessionReminderText ? '#4ade80' : 'rgba(255,255,255,0.16)',
          }}
          title="Set Post-Session Reminder & Sync with OneNote / Calendar"
        >
          ⏰ {sessionReminderText ? `Reminder Set ✓` : 'Reminder & Sync'}
        </button>

        <button
          className="nav-pill"
          onClick={() => setShowProModal(true)}
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.28), rgba(59, 130, 246, 0.25))',
            borderColor: '#facc15',
          }}
          title="Explore Focus Arena Pro ($2.99/mo) & Custom AI Worlds"
        >
          💎 Pro
        </button>

        {/* Owner-Only Notification Inbox Bar! */}
        {isOwner && (
          <button
            className="nav-pill"
            onClick={() => {
              setShowAdminInboxModal(true);
              setAdminNotifications(prev => {
                const marked = prev.map(n => ({ ...n, read: true }));
                localStorage.setItem('pomodoro-admin-notifications', JSON.stringify(marked));
                return marked;
              });
            }}
            style={{
              background: unreadAdminCount > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(250, 204, 21, 0.15)',
              borderColor: unreadAdminCount > 0 ? '#ef4444' : '#facc15',
            }}
            title="Owner-Only Admin Notification Inbox (View Feedback & User Sign-Ins)"
          >
            🔔 Admin Inbox
            <span
              style={{
                background: unreadAdminCount > 0 ? '#ef4444' : 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '1px 6px',
                borderRadius: '999px',
              }}
            >
              {adminNotifications.length}
            </span>
          </button>
        )}
      </div>

      {/* Persistent Floating Music Dock */}
      <div className={`music-floating-dock ${showMusicDock ? '' : 'minimized'}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>
              🎵 Spotify & Apple Music Hub
            </div>
            <div style={{ fontSize: '0.7rem', color: '#4ade80' }}>
              ● {spotifyAppSyncStatus} {isMusicPlaying ? '(Ambient Synth Active)' : ''}
            </div>
          </div>
          <button
            type="button"
            className="outline"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => setShowMusicDock(false)}
          >
            Done ▾
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {MUSIC_PRESETS.map(preset => (
            <button
              key={preset.id}
              type="button"
              className={`theme-chip ${activeMusicEmbed === preset.embedUrl ? 'selected' : ''}`}
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
              onClick={() => {
                setActiveMusicEmbed(preset.embedUrl);
                localStorage.setItem('pomodoro-music-embed', preset.embedUrl);
                setMusicError('');
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* When Music is turned OFF via top bar button, unmount/pause iframe */}
        <iframe
          key={isMusicPlaying ? 'playing-' + activeMusicEmbed : 'stopped-' + activeMusicEmbed}
          src={activeMusicEmbed}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ borderRadius: '12px' }}
          title="Focus Arena Music Player"
        />

        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="url"
            className="input-field"
            placeholder="Paste Spotify or Apple Music playlist/song link..."
            value={customMusicUrlInput}
            onChange={e => setCustomMusicUrlInput(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.78rem' }}
          />
          <button
            type="button"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.78rem' }}
            onClick={() => {
              const converted = convertToMusicEmbedUrl(customMusicUrlInput);
              if (!converted) {
                setMusicError('Paste a valid open.spotify.com or music.apple.com link.');
                return;
              }
              setActiveMusicEmbed(converted);
              localStorage.setItem('pomodoro-music-embed', converted);
              setSpotifyAppSyncStatus('Synced with Custom Playlist');
              setCustomMusicUrlInput('');
              setMusicError('');
            }}
          >
            Sync
          </button>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Tip: Log into Spotify in your browser to hear full songs instead of 30s previews, or click{' '}
          <strong>🔊 Music: ON</strong> in the top bar for instant Focus Synth!
        </div>
        {musicError && (
          <div style={{ color: '#fca5a5', fontSize: '0.72rem' }}>{musicError}</div>
        )}
      </div>

      {/* Creator Branding Footer Bar */}
      <div className="creator-footer-bar">
        <span>
          ⚡ Built by <strong>{APP_CONFIG.OWNER_NAME}</strong>
        </span>
        <span>•</span>
        <a href={APP_CONFIG.OWNER_LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
        <span>•</span>
        <a href={APP_CONFIG.OWNER_GITHUB_URL} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <span>•</span>
        <span
          style={{ cursor: 'pointer', color: '#fde047', fontWeight: 700 }}
          onClick={() => setShowProModal(true)}
        >
          💎 Focus Arena Pro ({APP_CONFIG.PRO_PRICE_DISPLAY})
        </span>
      </div>

      {/* Main Two-Panel Floating UI */}
      <div className="ui-layer">
        {/* Left Panel: Persona Assistant Chat */}
        <div className={`panel-wrapper panel-wrapper-left ${isLeftOpen ? '' : 'closed'}`}>
          <div className="panel panel-left">
            {isEditingName ? (
              <input
                type="text"
                value={assistantName}
                onChange={e => setAssistantName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)}
                autoFocus
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid var(--primary)',
                  color: 'white',
                  outline: 'none',
                  width: '100%',
                  margin: 0,
                  fontFamily: 'inherit',
                }}
              />
            ) : (
              <h2
                onClick={() => setIsEditingName(true)}
                style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center' }}
                title="Click to rename persona header"
              >
                {assistantName}
                <span
                  style={{
                    fontSize: '0.8rem',
                    opacity: 0.45,
                    marginLeft: '8px',
                    fontWeight: 'normal',
                  }}
                >
                  ✎
                </span>
              </h2>
            )}

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Persona:</span>
              <select
                value={aiPersonality}
                onChange={e => setAiPersonality(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'white',
                  border: '1px solid var(--glass-border)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                {activeTheme.personas.map(p => (
                  <option key={p.id} value={p.id} style={{ color: 'black' }}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Chat Box */}
            <div className="chat-box">
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                {currentPersona.characterName} • {activeTheme.name}
              </div>
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  padding: '15px 20px',
                  borderRadius: '16px 16px 16px 4px',
                  width: 'fit-content',
                  maxWidth: '95%',
                  lineHeight: '1.45',
                  fontSize: '0.92rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
                  animation: isTyping ? 'pulseGlow 1s infinite' : 'float 4s ease-in-out infinite',
                }}
              >
                {chatMessage}
              </div>
            </div>

            {/* Quick Action Prompts */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                className="theme-chip"
                style={{ fontSize: '0.72rem', padding: '0.32rem 0.65rem' }}
                onClick={() => handleAIInteraction('How should I start and organize my tasks?')}
              >
                ⚡ Organize Tasks
              </button>
              <button
                className="theme-chip"
                style={{ fontSize: '0.72rem', padding: '0.32rem 0.65rem' }}
                onClick={() => handleAIInteraction('Hey, how are you doing today?')}
              >
                👋 Say Hello
              </button>
              <button
                className="theme-chip"
                style={{ fontSize: '0.72rem', padding: '0.32rem 0.65rem' }}
                onClick={() => handleAIInteraction('Motivate me to stay locked in!')}
              >
                🔥 Motivate Me
              </button>
            </div>

            <input
              type="text"
              className="input-field"
              placeholder={`Chat with ${currentPersona.characterName} or ask how to start...`}
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={handleChatSubmit}
              disabled={isTyping}
            />
          </div>
          <div className="toggle-btn toggle-left" onClick={() => setIsLeftOpen(!isLeftOpen)}>
            {isLeftOpen ? '◀' : '▶'}
          </div>
        </div>

        {/* Right Panel: Pomodoro Timer (with Explicit MIN & SEC Units), Power Level & Tasks */}
        <div className={`panel-wrapper panel-wrapper-right ${isRightOpen ? '' : 'closed'}`}>
          <div className="toggle-btn toggle-right" onClick={() => setIsRightOpen(!isRightOpen)}>
            {isRightOpen ? '▶' : '◀'}
          </div>
          <div className="panel panel-right">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
              <h2>{mode} Time</h2>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '4px 7px',
                    borderRadius: '6px',
                  }}
                  title="Set Work Minutes and Seconds"
                >
                  <input
                    type="number"
                    min="0"
                    value={workDuration}
                    onChange={e => handleWorkMinChange(parseInt(e.target.value, 10) || 0)}
                    style={{
                      width: '32px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--glass-border)',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                    }}
                    disabled={isRunning}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700 }}>min</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={workSecondsExtra}
                    onChange={e => handleWorkSecChange(parseInt(e.target.value, 10) || 0)}
                    style={{
                      width: '30px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--glass-border)',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                    }}
                    disabled={isRunning}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700 }}>sec</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '4px 7px',
                    borderRadius: '6px',
                  }}
                  title="Set Break Minutes"
                >
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Brk</span>
                  <input
                    type="number"
                    min="1"
                    value={breakDuration}
                    onChange={e => handleBreakChange(parseInt(e.target.value, 10) || 1)}
                    style={{
                      width: '28px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--glass-border)',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                    }}
                    disabled={isRunning}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>m</span>
                </div>
              </div>
            </div>

            {isEditingTimer ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.28)',
                  padding: '12px',
                  borderRadius: '14px',
                  border: '1px solid var(--primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="0"
                      value={editMinsInput}
                      onChange={e => setEditMinsInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleTimerSubmit()}
                      autoFocus
                      style={{
                        fontSize: '2.4rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        color: 'white',
                        width: '85px',
                      }}
                    />
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700, marginTop: '3px' }}>
                      MINUTES
                    </span>
                  </div>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={editSecsInput}
                      onChange={e => setEditSecsInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleTimerSubmit()}
                      style={{
                        fontSize: '2.4rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        color: 'white',
                        width: '85px',
                      }}
                    />
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700, marginTop: '3px' }}>
                      SECONDS
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="theme-chip"
                    style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem' }}
                    onClick={() => handleQuickTimerSet(0, 5)}
                  >
                    ⚡ 5 sec
                  </button>
                  <button
                    type="button"
                    className="theme-chip"
                    style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem' }}
                    onClick={() => handleQuickTimerSet(1, 0)}
                  >
                    1 min
                  </button>
                  <button
                    type="button"
                    className="theme-chip"
                    style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem' }}
                    onClick={() => handleQuickTimerSet(25, 0)}
                  >
                    25 min
                  </button>
                  <button
                    type="button"
                    style={{ padding: '0.3rem 0.85rem', fontSize: '0.76rem' }}
                    onClick={handleTimerSubmit}
                  >
                    ✓ Set Timer
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={handleTimerClick}
                style={{
                  textAlign: 'center',
                  cursor: isRunning ? 'default' : 'pointer',
                }}
                title={isRunning ? '' : 'Click to edit Minutes & Seconds (e.g. 5 sec)'}
              >
                <div
                  style={{
                    fontSize: '4.4rem',
                    fontWeight: 800,
                    margin: 0,
                    fontFamily: 'monospace',
                    textShadow: '0 0 30px var(--primary-glow)',
                    color: 'white',
                    letterSpacing: '-2px',
                    lineHeight: 1,
                  }}
                >
                  {mins}:{secs}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '3.2rem',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    letterSpacing: '1.5px',
                    marginTop: '4px',
                  }}
                >
                  <span>MINUTES</span>
                  <span>SECONDS</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={{ flex: 1 }} onClick={toggleTimer}>
                {isRunning ? 'Pause' : 'Start Focus'}
              </button>
              <button
                className="outline"
                onClick={() => switchMode(mode === 'Work' ? 'Break' : 'Work')}
              >
                {mode === 'Work' ? 'Break' : 'Work'}
              </button>
            </div>

            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.2rem 0' }} />

            {/* Power Level + Progress to 9,000 + Reset Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem' }}>Your Tasks</h3>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: powerLevel >= 9000 ? '#fde047' : 'var(--primary)',
                      fontWeight: 800,
                      textShadow: '0 0 10px var(--primary-glow)',
                      marginTop: '2px',
                    }}
                  >
                    {activeTheme.powerLabel}: {powerLevel.toLocaleString()}{' '}
                    <span style={{ fontSize: '0.72rem', opacity: 0.8, fontWeight: 600 }}>
                      (+1,000 / task)
                    </span>
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {completedCount}/{tasks.length} done
                </span>
              </div>

              {/* 9,000 Milestone Progress Bar */}
              <div>
                <div className="power-bar-track" title={`${powerLevel.toLocaleString()} / 9,000`}>
                  <div className="power-bar-fill" style={{ width: `${progressTo9000}%` }} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '6px',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {powerLevel >= 9000
                      ? '💥 OVER 9,000 ACHIEVED!'
                      : `${Math.max(0, 9000 - powerLevel).toLocaleString()} to 9,000 Milestone`}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="danger-btn"
                      onClick={handleResetPowerLevel}
                      disabled={powerLevel === 0}
                      title="Reset Power Level to 0"
                    >
                      ↺ Reset Power
                    </button>
                    <button
                      className="danger-btn"
                      onClick={handleClearAllTasks}
                      disabled={tasks.length === 0}
                      title="Clear all tasks from your list"
                    >
                      🗑️ Clear Tasks
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Task List with Translucent Hover Pop-Up & One-Click Copy */}
            <ul
              onDragOver={handleDragOverContainer}
              style={{
                listStyle: 'none',
                padding: '38px 0 0 0',
                margin: '-38px 0 0 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                overflowY: 'auto',
                overflowX: 'visible',
                flex: 1,
                minHeight: '140px',
              }}
            >
              {tasks.length === 0 && (
                <li
                  style={{
                    textAlign: 'center',
                    padding: '2rem 1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    border: '1px dashed rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                  }}
                >
                  No tasks yet. Add a task below and check it off for <strong>+1,000 Power</strong>!
                </li>
              )}
              {tasks.map((task, index) => {
                const isHovered = hoveredTaskId === task.id;
                const isCopied = copiedTaskId === task.id;
                const shouldShowHoverPopup = isHovered && task.text.length > 22;

                return (
                  <li
                    key={task.id}
                    className="task-item"
                    style={{ opacity: task.completed ? 0.65 : 1, cursor: 'grab' }}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    onMouseEnter={() => setHoveredTaskId(task.id)}
                    onMouseLeave={() => setHoveredTaskId(prev => (prev === task.id ? null : prev))}
                  >
                    {shouldShowHoverPopup && (
                      <div className="task-hover-popup" onClick={e => e.stopPropagation()}>
                        <div style={{ marginBottom: '6px', fontWeight: 500 }}>{task.text}</div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid rgba(255,255,255,0.12)',
                            paddingTop: '6px',
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <span>Full Task View</span>
                          <button
                            type="button"
                            className="task-action-btn"
                            onClick={e => handleCopyTask(e, task)}
                          >
                            {isCopied ? '✓ Copied!' : '📋 Copy Text'}
                          </button>
                        </div>
                      </div>
                    )}

                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id, task.text, task.completed)}
                    />
                    <input
                      type="text"
                      value={task.text}
                      onChange={e => updateTaskText(task.id, e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'white',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        textOverflow: 'ellipsis',
                        fontSize: '0.92rem',
                        fontFamily: 'inherit',
                        padding: 0,
                      }}
                      disabled={task.completed}
                    />
                    <button
                      type="button"
                      className="task-action-btn"
                      onClick={e => handleCopyTask(e, task)}
                      title="Copy task text to clipboard"
                    >
                      {isCopied ? '✓' : '📋'}
                    </button>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: task.completed ? '#4ade80' : 'var(--text-muted)',
                        fontWeight: 700,
                      }}
                    >
                      +1K
                    </span>
                    <button
                      className="outline"
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.78rem',
                        background: 'rgba(255,0,0,0.1)',
                        border: 'none',
                        color: '#ff4b4b',
                      }}
                      onClick={() => deleteTask(task.id)}
                      title="Delete task"
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Live Voice Dictation Banner */}
            {isListening && (
              <div className="voice-status-banner">
                <span>🎙️ Listening clearly... Speak your task now</span>
                <button
                  type="button"
                  className="task-action-btn"
                  onClick={toggleListening}
                  style={{ borderColor: '#ef4444', color: '#fecaca' }}
                >
                  Done
                </button>
              </div>
            )}

            {/* Add Task Input Bar */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                className="outline"
                style={{
                  padding: '0.75rem',
                  background: isListening ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                  borderColor: isListening ? '#ef4444' : 'var(--primary)',
                }}
                onClick={toggleListening}
                title={isListening ? 'Stop voice dictation' : 'Dictate task with microphone'}
              >
                {isListening ? '🛑' : '🎤'}
              </button>
              <input
                type="text"
                className="input-field"
                placeholder="Add a new task (+1,000 Power)..."
                style={{ flex: 1, padding: '0.75rem' }}
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
              />
              <button style={{ padding: '0.75rem 1.25rem' }} onClick={addTask}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Onboarding Gate (Nickname + Gmail Sign-In + Interest Theme Prompt) */}
      {showOnboardingModal && (
        <div className="modal-backdrop">
          <form className="modal-card" onSubmit={handleOnboardingSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Welcome to Focus Arena</h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '2px' }}>
                  Created by {APP_CONFIG.OWNER_NAME} ({APP_CONFIG.OWNER_HANDLE})
                </div>
              </div>
              {userProfile && (
                <button
                  type="button"
                  className="outline"
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                  onClick={() => setShowOnboardingModal(false)}
                >
                  ✕
                </button>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Sign in with your Gmail, choose your persona nickname, and type ANY interest or theme to
              generate your custom 3D workspace!
            </p>

            {onboardingError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                }}
              >
                {onboardingError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>
                1. Your Persona Nickname
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., XAKHUNDX, SaiyanCoder, RickGrimes..."
                value={nicknameInput}
                onChange={e => setNicknameInput(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>
                2. Gmail Sign-In (Private & Secure — Never Shown Publicly)
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="yourname@gmail.com"
                value={gmailInput}
                onChange={e => setGmailInput(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>
                3. Type ANY Interest or Theme (AI Real-Time Generator)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Black Clover, The Last of Us, Dragon Ball, One Piece..."
                value={themePromptInput}
                onChange={e => setThemePromptInput(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                {Object.values(PRESET_THEMES).map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`theme-chip ${
                      previewTheme.id === preset.id ? 'selected' : ''
                    }`}
                    onClick={() => setThemePromptInput(preset.interestPrompt)}
                  >
                    {preset.badge}
                  </button>
                ))}
              </div>
              <div
                style={{
                  marginTop: '4px',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.78rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  AI Theme Preview:{' '}
                  <strong style={{ color: previewTheme.primary }}>{previewTheme.name}</strong>
                </span>
                <span style={{ opacity: 0.8 }}>
                  {previewTheme.personas.map(p => p.characterName).join(', ')}
                </span>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
              🚀 Generate & Launch {previewTheme.name}
            </button>
          </form>
        </div>
      )}

      {/* MODAL 2: Theme Prompt & Real-Time AI World Generator */}
      {showThemeModal && (
        <div className="modal-backdrop" onClick={() => setShowThemeModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>🎨 AI Theme & World Generator</h2>
              <button
                className="outline"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                onClick={() => setShowThemeModal(false)}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Type <strong>any</strong> anime, show, game, or interest below (e.g.,{' '}
              <strong>Black Clover</strong>, <strong>The Last of Us</strong>,{' '}
              <strong>Solo Leveling</strong>, <strong>One Piece</strong>) to generate a custom 4K
              environment, 3D orb, and character personas in real time!
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Type any interest (e.g. Black Clover, The Last of Us...)"
                value={themePromptInput}
                onChange={e => setThemePromptInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setShowThemeModal(false);
                    triggerThemeGenerationWithLoading(themePromptInput);
                  }
                }}
              />
              <button
                onClick={() => {
                  setShowThemeModal(false);
                  triggerThemeGenerationWithLoading(themePromptInput);
                }}
              >
                ✨ Generate
              </button>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1' }}>
              Instant 4K Worlds:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.values(PRESET_THEMES).map(preset => (
                <div
                  key={preset.id}
                  onClick={() => {
                    setShowThemeModal(false);
                    triggerThemeGenerationWithLoading(preset.interestPrompt);
                  }}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    background:
                      activeTheme.id === preset.id
                        ? 'rgba(255,255,255,0.12)'
                        : 'rgba(255,255,255,0.04)',
                    border:
                      activeTheme.id === preset.id
                        ? `2px solid ${preset.primary}`
                        : '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                      {preset.badge} — {preset.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Orb & Personas: {preset.personas.map(p => p.characterName).join(' • ')}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: preset.orbImageUrl
                        ? `url(${preset.orbImageUrl}) center/cover`
                        : `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                      boxShadow: `0 0 12px ${preset.primary}`,
                      border: `1px solid ${preset.primary}`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Achievement Queue & Milestones Drawer */}
      {showAchievementsModal && (
        <div className="modal-backdrop" onClick={() => setShowAchievementsModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>🏆 Power Milestones & Queue</h2>
              <button
                className="outline"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                onClick={() => setShowAchievementsModal(false)}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Each completed task grants <strong>+1,000 {activeTheme.powerLabel}</strong>. Hit{' '}
              <strong>9,000</strong> to trigger the legendary milestone celebration!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeTheme.milestones.map(m => {
                const unlocked = unlockedAchievementIds.includes(m.id) || powerLevel >= m.threshold;
                return (
                  <div
                    key={m.id}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: '14px',
                      background: unlocked ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.02)',
                      border: unlocked
                        ? m.isMajor
                          ? '2px solid #facc15'
                          : '1px solid var(--primary)'
                        : '1px dashed rgba(255,255,255,0.12)',
                      opacity: unlocked ? 1 : 0.55,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={{ fontSize: '1.8rem' }}>{unlocked ? m.icon : '🔒'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{m.title}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {m.subtitle}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: unlocked ? '#4ade80' : 'var(--text-muted)',
                      }}
                    >
                      {unlocked ? 'UNLOCKED' : `${m.threshold.toLocaleString()} PWR`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Active Warriors Leaderboard (Public) vs Owner-Only Admin Dashboard */}
      {showUsersModal && (
        <div className="modal-backdrop" onClick={() => setShowUsersModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>
                {isOwner ? '👑 Owner Admin Dashboard' : '🟢 Active Focus Warriors'}
              </h2>
              <button
                className="outline"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                onClick={() => setShowUsersModal(false)}
              >
                ✕
              </button>
            </div>

            {isOwner ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: 'rgba(250, 204, 21, 0.1)',
                    border: '1px solid rgba(250, 204, 21, 0.35)',
                    fontSize: '0.78rem',
                    color: '#fef08a',
                  }}
                >
                  👑 Signed in as Owner (<strong>{APP_CONFIG.OWNER_EMAIL}</strong>). Only you can view
                  user Gmail addresses and export CSVs.
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="Optional: Google Apps Script Webhook URL..."
                    value={webhookUrl}
                    onChange={e => {
                      setWebhookUrl(e.target.value);
                      localStorage.setItem('pomodoro-webhook-url', e.target.value);
                    }}
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.78rem', flex: 1 }}
                  />
                  <button
                    type="button"
                    className="outline"
                    style={{ padding: '0.5rem 0.8rem', fontSize: '0.76rem' }}
                    onClick={handleExportUsersCsv}
                  >
                    📥 Export CSV
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: '240px',
                    overflowY: 'auto',
                  }}
                >
                  {userRegistry.map((u, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                          👤 {u.nickname}{' '}
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                            ({u.interestPrompt})
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>✉️ {u.gmail}</div>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700 }}>
                        ● Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Live community of warriors currently focusing. (User emails are strictly private and
                  visible only to the app owner.)
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: '260px',
                    overflowY: 'auto',
                  }}
                >
                  {userRegistry.map((u, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                        👤 {u.nickname}{' '}
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                          • {u.interestPrompt}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700 }}>
                        ● Focusing
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 5: Feedback Hub (Opens Built-In Google-Style Survey Form OR Quick 5-Star Box) */}
      {showFeedbackModal && (
        <div className="modal-backdrop" onClick={() => setShowFeedbackModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>💬 App Feedback</h2>
              <button
                className="outline"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                onClick={() => setShowFeedbackModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Option 1: Open Full Google-Forms-Style Survey */}
            <div
              style={{
                padding: '1rem',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                📋 Option 1: Full Feedback Survey Form
              </span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Fill out our structured survey form (sent directly to {APP_CONFIG.OWNER_NAME}&apos;s
                Gmail & Admin Inbox).
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setShowGoogleSurveyModal(true);
                }}
              >
                📝 Open Full Feedback Form ↗
              </button>
            </div>

            {/* Option 2: Quick 5-Star In-App Rating */}
            <form
              onSubmit={handleFeedbackSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                ⚡ Option 2: Instant 5-Star Feedback (Sent to {APP_CONFIG.OWNER_NAME}):
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className="outline"
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      background:
                        feedbackRating >= star ? 'rgba(250, 204, 21, 0.2)' : 'rgba(255,255,255,0.03)',
                      borderColor: feedbackRating >= star ? '#facc15' : 'var(--glass-border)',
                    }}
                    onClick={() => setFeedbackRating(star)}
                  >
                    {'⭐'.repeat(star)}
                  </button>
                ))}
              </div>
              <textarea
                className="input-field"
                rows={3}
                placeholder="What themes, personas, or features would you like to see next?"
                value={feedbackMessage}
                onChange={e => setFeedbackMessage(e.target.value)}
                required
              />
              <button type="submit">Send Instant Feedback</button>
              {feedbackSubmitted && (
                <div
                  style={{
                    color: '#4ade80',
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    fontWeight: 700,
                  }}
                >
                  ✓ Sent! Delivered to {APP_CONFIG.OWNER_NAME}&apos;s Admin Inbox & Gmail!
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5B: Built-In Google-Forms-Style Survey Form */}
      {showGoogleSurveyModal && (
        <div className="modal-backdrop" onClick={() => setShowGoogleSurveyModal(false)}>
          <form
            className="modal-card"
            style={{ maxWidth: '560px', borderTop: '6px solid var(--primary)' }}
            onClick={e => e.stopPropagation()}
            onSubmit={handleGoogleSurveySubmit}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>📝 Focus Arena — Official Feedback Form</h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Responses are sent directly to {APP_CONFIG.OWNER_NAME} ({APP_CONFIG.OWNER_EMAIL})
                </div>
              </div>
              <button
                type="button"
                className="outline"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                onClick={() => setShowGoogleSurveyModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                1. How would you rate Focus Arena overall? *
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    className="outline"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background:
                        surveyRating === num ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                    }}
                    onClick={() => setSurveyRating(num)}
                  >
                    {num} ⭐
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                2. Which 4K Theme World is your favorite so far?
              </label>
              <select
                value={surveyFavTheme}
                onChange={e => setSurveyFavTheme(e.target.value)}
                className="input-field"
                style={{ padding: '0.65rem', background: '#0f172a' }}
              >
                <option value="Dragon Ball Super">🐉 Dragon Ball Super</option>
                <option value="The Walking Dead">🧟 AMC&apos;s The Walking Dead</option>
                <option value="Cyberpunk: Edgerunners">🤖 Cyberpunk: Edgerunners / 2077</option>
                <option value="Naruto / Shinobi">🍥 Shinobi Chakra (Naruto)</option>
                <option value="Dark Fantasy (Elden Ring)">⚔️ Dark Fantasy (Elden Ring)</option>
                <option value="Custom AI Theme">✨ Custom AI Generated Theme</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                3. What new anime, TV show, or game theme should we add next?
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Black Clover, The Last of Us, Solo Leveling, Attack on Titan..."
                value={surveyThemeRequest}
                onChange={e => setSurveyThemeRequest(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                4. Any additional thoughts, bug reports, or feature ideas? *
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Write your feedback here..."
                value={surveyComments}
                onChange={e => setSurveyComments(e.target.value)}
                required
              />
            </div>

            <button type="submit" style={{ width: '100%' }}>
              📨 Submit Feedback Form to {APP_CONFIG.OWNER_NAME}
            </button>
            {surveySubmitted && (
              <div
                style={{
                  color: '#4ade80',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textAlign: 'center',
                }}
              >
                ✓ Form submitted! Sent directly to {APP_CONFIG.OWNER_NAME}&apos;s Gmail & Admin Inbox!
              </div>
            )}
          </form>
        </div>
      )}

      {/* MODAL 6: Post-Session Reminder (with Set / Done button!) + Calendar & OneNote Sync */}
      {showReminderSyncModal && (
        <div className="modal-backdrop" onClick={() => setShowReminderSyncModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>⏰ Post-Session Reminder & Sync</h2>
              <button
                className="outline"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                onClick={() => setShowReminderSyncModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                1. Upcoming Post-Session Reminder (Pops up when timer finishes):
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Message recruiter on LinkedIn, Call client, Stretch..."
                value={reminderDraftInput}
                onChange={e => setReminderDraftInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setSessionReminderText(reminderDraftInput.trim());
                    setReminderConfirmMsg('✓ Reminder Set! It will alert you when the timer finishes.');
                  }
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  style={{ flex: 1, padding: '0.65rem' }}
                  onClick={() => {
                    setSessionReminderText(reminderDraftInput.trim());
                    setReminderConfirmMsg('✓ Reminder Set! Closing...');
                    setTimeout(() => setShowReminderSyncModal(false), 700);
                  }}
                >
                  ✓ Set Reminder & Done
                </button>
                {sessionReminderText && (
                  <button
                    type="button"
                    className="danger-btn"
                    style={{ padding: '0.65rem 1rem' }}
                    onClick={() => {
                      setSessionReminderText('');
                      setReminderDraftInput('');
                      setReminderConfirmMsg('Reminder cleared.');
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              {reminderConfirmMsg && (
                <div style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 700 }}>
                  {reminderConfirmMsg}
                </div>
              )}
            </div>

            <div style={{ height: '1px', background: 'var(--glass-border)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                2. Calendar & Microsoft OneNote Integration:
              </label>
              <button type="button" onClick={handleGoogleCalendarSync}>
                📅 Add Focus Block & Tasks to Google Calendar ↗
              </button>
              <button type="button" className="outline" onClick={handleDownloadIcsCalendar}>
                📆 Export Session to Outlook / Apple Calendar (.ics)
              </button>
              <button type="button" className="outline" onClick={handleOneNoteSync}>
                📓 Copy Formatted Checklist for Microsoft OneNote / Notion
              </button>
              {syncSuccessMsg && (
                <div
                  style={{
                    color: '#4ade80',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  {syncSuccessMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Product Showcase, Creator Branding & Pro Tier ($2.99/mo + Stripe) */}
      {showProModal && (
        <div className="modal-backdrop" onClick={() => setShowProModal(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: '660px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>⚡ Focus Arena — By {APP_CONFIG.OWNER_NAME}</h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent)', marginTop: '2px' }}>
                  Next-Gen 3D Gamified AI Productivity Workspace
                </div>
              </div>
              <button
                className="outline"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                onClick={() => setShowProModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="pricing-grid">
              {/* Free Tier */}
              <div className="pricing-card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  STARTER WARRIOR
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>Free</div>
                <ul
                  style={{
                    paddingLeft: '1.1rem',
                    margin: '0.4rem 0',
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <li>Pomodoro Focus & Break Timer (Min/Sec)</li>
                  <li>+1,000 Power Task Gamification</li>
                  <li>5 Built-In 4K Worlds (DBZ, TWD, Cyberpunk, Naruto, Elden Ring)</li>
                  <li>Voice Dictation & Hover Task Copy</li>
                </ul>
                <button
                  type="button"
                  className="outline"
                  style={{ marginTop: 'auto' }}
                  onClick={() => setShowProModal(false)}
                >
                  Included Free
                </button>
              </div>

              {/* Pro Tier */}
              <div className="pricing-card pro">
                <div style={{ fontSize: '0.75rem', color: '#fde047', fontWeight: 800 }}>
                  ⚡ LEGENDARY PRO TIER
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>
                  $2.99 <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>/ month</span>
                </div>
                <ul
                  style={{
                    paddingLeft: '1.1rem',
                    margin: '0.4rem 0',
                    fontSize: '0.8rem',
                    color: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <li>
                    <strong>Real-Time AI Custom World Generator</strong>: Type ANY anime, show, or
                    game (e.g. <em>Black Clover, The Last of Us, One Piece</em>) & watch it generate
                    a custom 4K world + orb + personas!
                  </li>
                  <li>Live Spotify & Apple Music Focus Dock</li>
                  <li>Microsoft OneNote & Calendar (.ics / Google) Sync</li>
                  <li>PRO Golden Badge & Priority Feature Access</li>
                </ul>
                <button
                  type="button"
                  style={{ marginTop: 'auto' }}
                  onClick={() => {
                    if (stripeCheckoutUrl) {
                      window.open(stripeCheckoutUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      setShowProModal(false);
                      setShowThemeModal(true);
                    }
                  }}
                >
                  {stripeCheckoutUrl
                    ? '💳 Subscribe via Stripe ($2.99/mo) ↗'
                    : '✨ Try Custom AI World Generator Now'}
                </button>
              </div>
            </div>

            {isOwner && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: 'rgba(250, 204, 21, 0.08)',
                  border: '1px solid rgba(250, 204, 21, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '0.76rem', color: '#fef08a', fontWeight: 700 }}>
                  👑 Owner Stripe Checkout Link Setup (Only visible to you):
                </span>
                <input
                  type="url"
                  className="input-field"
                  placeholder="Paste your Stripe Payment Link (https://buy.stripe.com/...) here"
                  value={stripeCheckoutUrl}
                  onChange={e => {
                    setStripeCheckoutUrl(e.target.value);
                    localStorage.setItem('pomodoro-stripe-url', e.target.value);
                  }}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.78rem' }}
                />
              </div>
            )}

            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '0.8rem',
              }}
            >
              <span>
                Created & Engineered by <strong>{APP_CONFIG.OWNER_NAME}</strong>
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href={APP_CONFIG.OWNER_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}
                >
                  Connect on LinkedIn ↗
                </a>
                <a
                  href={APP_CONFIG.OWNER_GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}
                >
                  GitHub (@xakhundx) ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: Owner-Only Admin Notification Inbox Drawer */}
      {isOwner && showAdminInboxModal && (
        <div className="modal-backdrop" onClick={() => setShowAdminInboxModal(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: '600px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>🔔 Owner Admin Notification Inbox</h2>
                <div style={{ fontSize: '0.75rem', color: '#fde047', marginTop: '2px' }}>
                  👑 Visible only to {APP_CONFIG.OWNER_NAME} ({APP_CONFIG.OWNER_EMAIL})
                </div>
              </div>
              <button
                className="outline"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                onClick={() => setShowAdminInboxModal(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              All user feedback, survey responses, and new user sign-ins appear here AND are forwarded
              to <strong>{APP_CONFIG.OWNER_EMAIL}</strong>.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '340px',
                overflowY: 'auto',
              }}
            >
              {adminNotifications.length === 0 ? (
                <div
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    border: '1px dashed rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                  }}
                >
                  No notifications yet. Test submitting a 5-star rating or survey form to see it pop up
                  here!
                </div>
              ) : (
                adminNotifications.map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: '14px',
                      background: 'rgba(255,255,255,0.06)',
                      border:
                        item.type === 'new_user'
                          ? '1px solid rgba(56, 189, 248, 0.4)'
                          : '1px solid rgba(250, 204, 21, 0.45)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>
                        {item.type === 'new_user'
                          ? `🚀 New User: ${item.nickname}`
                          : item.type === 'survey'
                          ? `📋 Survey (${item.rating}⭐): ${item.nickname}`
                          : `⭐ Instant Feedback (${item.rating}⭐): ${item.nickname}`}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.createdAt}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                      ✉️ {item.gmail}
                      {item.favoriteTheme ? ` • Fav Theme: ${item.favoriteTheme}` : ''}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#f8fafc', marginTop: '4px' }}>
                      {item.message}
                    </div>
                    {item.featureRequest && (
                      <div style={{ fontSize: '0.78rem', color: '#fde047' }}>
                        Requested Theme/Feature: {item.featureRequest}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
