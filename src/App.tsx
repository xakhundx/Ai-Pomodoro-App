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

interface FeedbackEntry {
  id: string;
  nickname: string;
  gmail: string;
  rating: number;
  message: string;
  createdAt: string;
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

  // Already an embed URL
  if (url.includes('open.spotify.com/embed/') || url.includes('embed.music.apple.com/')) {
    return url;
  }

  // Convert standard Spotify link: https://open.spotify.com/playlist/xyz -> https://open.spotify.com/embed/playlist/xyz
  if (url.includes('open.spotify.com/')) {
    const clean = url.split('?')[0];
    return clean.replace('open.spotify.com/', 'open.spotify.com/embed/') + '?utm_source=generator&theme=0';
  }

  // Convert standard Apple Music link: https://music.apple.com/... -> https://embed.music.apple.com/...
  if (url.includes('music.apple.com/')) {
    return url.replace('music.apple.com/', 'embed.music.apple.com/');
  }

  return null;
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
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showMusicDock, setShowMusicDock] = useState(false);
  const [showReminderSyncModal, setShowReminderSyncModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  // Pro Tier Status
  const [isProMember, setIsProMember] = useState<boolean>(() => {
    return localStorage.getItem('pomodoro-pro-member') === 'true';
  });

  // Music Hub State
  const [activeMusicEmbed, setActiveMusicEmbed] = useState<string>(() => {
    return localStorage.getItem('pomodoro-music-embed') || MUSIC_PRESETS[0].embedUrl;
  });
  const [customMusicUrlInput, setCustomMusicUrlInput] = useState('');
  const [musicError, setMusicError] = useState('');

  // Post-Session Reminder & Calendar/OneNote Sync State
  const [sessionReminderText, setSessionReminderText] = useState<string>(
    () => localStorage.getItem('pomodoro-session-reminder') || ''
  );
  const [reminderAlertBanner, setReminderAlertBanner] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('pomodoro-session-reminder', sessionReminderText);
  }, [sessionReminderText]);

  // Webhook URL state (configurable by Owner in Admin Panel)
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

  // Gamification & Power Level (starts at 0, +1,000 per completed task!)
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

  // Google Form URL & Local Feedback State
  const [customGoogleFormUrl, setCustomGoogleFormUrl] = useState(
    () => localStorage.getItem('pomodoro-google-form-url') || APP_CONFIG.GOOGLE_FEEDBACK_FORM_URL
  );
  const [isConfiguringFormUrl, setIsConfiguringFormUrl] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(() => {
    const saved = localStorage.getItem('pomodoro-feedback-entries');
    return saved ? JSON.parse(saved) : [];
  });

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

  // Timer State
  const [workDuration, setWorkDuration] = useState(() =>
    parseInt(localStorage.getItem('pomodoro-work-time') || '25', 10)
  );
  const [breakDuration, setBreakDuration] = useState(() =>
    parseInt(localStorage.getItem('pomodoro-break-time') || '5', 10)
  );
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'Work' | 'Break'>('Work');
  const [isEditingTimer, setIsEditingTimer] = useState(false);
  const [timerInput, setTimerInput] = useState('');

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
    localStorage.setItem('pomodoro-break-time', breakDuration.toString());
  }, [workDuration, breakDuration]);

  const handleTimerClick = () => {
    if (isRunning) return;
    setIsEditingTimer(true);
    setTimerInput(Math.floor(timeLeft / 60).toString());
  };

  const handleTimerSubmit = () => {
    setIsEditingTimer(false);
    const parsed = parseInt(timerInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTimeLeft(parsed * 60);
      if (mode === 'Work') {
        setWorkDuration(parsed);
      } else {
        setBreakDuration(parsed);
      }
    }
  };

  const handleWorkChange = (val: number) => {
    if (val < 1) val = 1;
    setWorkDuration(val);
    if (!isRunning && mode === 'Work') setTimeLeft(val * 60);
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
        setTimeLeft(workDuration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, workDuration, breakDuration, powerLevel, sessionReminderText]);

  const toggleTimer = () => {
    if (!isRunning) playSound('hum');
    setIsRunning(!isRunning);
  };

  const switchMode = (newMode: 'Work' | 'Break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'Work' ? workDuration * 60 : breakDuration * 60);
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

  // Clear All Tasks & Reset Power Level Handlers
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

  // Onboarding & Gmail Sign-In Handler + Automated Welcome Email Trigger
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

    // Trigger Google Apps Script Webhook for Automated Welcome Email + Sheet Logging
    const targetWebhook = webhookUrl || APP_CONFIG.USER_TRACKING_WEBHOOK_URL;
    if (targetWebhook) {
      fetch(targetWebhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'signin',
          ...newProfile,
          owner: APP_CONFIG.OWNER_NAME,
        }),
      }).catch(() => {});
    }

    const resolved = resolveThemeFromPrompt(cleanPrompt);
    setActiveTheme(resolved);
    setOnboardingError('');
    setShowOnboardingModal(false);
  };

  // Apply Theme from Theme Customizer Modal
  const handleApplyThemePrompt = (promptValue: string) => {
    const clean = promptValue.trim() || 'Dragon Ball';
    setThemePromptInput(clean);
    const resolved = resolveThemeFromPrompt(clean);
    setActiveTheme(resolved);
    if (userProfile) {
      const updated = { ...userProfile, interestPrompt: clean, lastActive: new Date().toISOString() };
      setUserProfile(updated);
      localStorage.setItem('pomodoro-user-profile', JSON.stringify(updated));
    }
  };

  // Submit In-App Feedback (also forwards to Owner Email via Webhook!)
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    const entry: FeedbackEntry = {
      id: Date.now().toString(),
      nickname: userProfile?.nickname || assistantName,
      gmail: userProfile?.gmail || 'anonymous@gmail.com',
      rating: feedbackRating,
      message: feedbackMessage.trim(),
      createdAt: new Date().toLocaleString(),
    };
    const nextList = [entry, ...feedbackList];
    setFeedbackList(nextList);
    localStorage.setItem('pomodoro-feedback-entries', JSON.stringify(nextList));

    const targetWebhook = webhookUrl || APP_CONFIG.USER_TRACKING_WEBHOOK_URL;
    if (targetWebhook) {
      fetch(targetWebhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'feedback',
          ...entry,
        }),
      }).catch(() => {});
    }

    setFeedbackMessage('');
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3500);
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
    const end = new Date(start.getTime() + workDuration * 60000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${fmt(
      start
    )}/${fmt(end)}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcsCalendar = () => {
    const start = new Date();
    const end = new Date(start.getTime() + workDuration * 60000);
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
            className="outline"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            onClick={() => setReminderAlertBanner(null)}
          >
            Dismiss
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
          {isProMember && (
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
          title="Customize App Theme by Interest"
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
          title="Send Feedback to Ammar Akhund"
        >
          💬 Feedback
        </button>

        <button
          className="nav-pill"
          onClick={() => setShowMusicDock(!showMusicDock)}
          style={{
            borderColor: showMusicDock ? '#22c55e' : 'rgba(255,255,255,0.16)',
          }}
          title="Open Spotify / Apple Music / Lo-Fi Focus Player"
        >
          🎵 Music
        </button>

        <button
          className="nav-pill"
          onClick={() => setShowReminderSyncModal(true)}
          title="Set Post-Session Reminder & Sync with OneNote / Calendar"
        >
          ⏰ {sessionReminderText ? 'Reminder Set' : 'Reminder & Sync'}
        </button>

        <button
          className="nav-pill"
          onClick={() => setShowProModal(true)}
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.28), rgba(59, 130, 246, 0.25))',
            borderColor: '#facc15',
          }}
          title="Explore Focus Arena Pro & Creator Info"
        >
          💎 Pro
        </button>
      </div>

      {/* Persistent Floating Music Dock (Keeps playing even when minimized!) */}
      <div className={`music-floating-dock ${showMusicDock ? '' : 'minimized'}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>
            🎵 Live Music Hub (Spotify & Apple Music)
          </span>
          <button
            type="button"
            className="outline"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => setShowMusicDock(false)}
          >
            Minimize ▾
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

        <iframe
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
            placeholder="Paste any Spotify or Apple Music playlist/song link..."
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
              setCustomMusicUrlInput('');
              setMusicError('');
            }}
          >
            Load
          </button>
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

        {/* Right Panel: Pomodoro Timer, Power Level & Tasks */}
        <div className={`panel-wrapper panel-wrapper-right ${isRightOpen ? '' : 'closed'}`}>
          <div className="toggle-btn toggle-right" onClick={() => setIsRightOpen(!isRightOpen)}>
            {isRightOpen ? '▶' : '◀'}
          </div>
          <div className="panel panel-right">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{mode} Time</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(0,0,0,0.25)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Work</span>
                  <input
                    type="number"
                    min="1"
                    value={workDuration}
                    onChange={e => handleWorkChange(parseInt(e.target.value, 10) || 1)}
                    style={{
                      width: '38px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--glass-border)',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                    }}
                    disabled={isRunning}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(0,0,0,0.25)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Break</span>
                  <input
                    type="number"
                    min="1"
                    value={breakDuration}
                    onChange={e => handleBreakChange(parseInt(e.target.value, 10) || 1)}
                    style={{
                      width: '38px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--glass-border)',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                    }}
                    disabled={isRunning}
                  />
                </div>
              </div>
            </div>

            {isEditingTimer ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <input
                  type="number"
                  value={timerInput}
                  onChange={e => setTimerInput(e.target.value)}
                  onBlur={handleTimerSubmit}
                  onKeyDown={e => e.key === 'Enter' && handleTimerSubmit()}
                  autoFocus
                  style={{
                    fontSize: '4.6rem',
                    fontWeight: 800,
                    textAlign: 'center',
                    margin: 0,
                    fontFamily: 'monospace',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    outline: 'none',
                    width: '100%',
                    textShadow: '0 0 30px var(--primary-glow)',
                  }}
                />
              </div>
            ) : (
              <div
                onClick={handleTimerClick}
                style={{
                  fontSize: '4.6rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  margin: 0,
                  fontFamily: 'monospace',
                  textShadow: '0 0 30px var(--primary-glow)',
                  color: 'white',
                  letterSpacing: '-2px',
                  cursor: isRunning ? 'default' : 'text',
                }}
                title={isRunning ? '' : 'Click to edit minutes'}
              >
                {mins}:{secs}
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
                    {/* Translucent Full-View Pop-Up when hovering over long tasks */}
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
              Sign in with your Gmail, choose your persona nickname, and tell us what theme or interest
              you want for your workspace!
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
                3. What is your interest or preferred theme?
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Type any interest (e.g., Dragon Ball, AMC's The Walking Dead, Cyberpunk...)"
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
                  Matched Theme: <strong style={{ color: previewTheme.primary }}>{previewTheme.name}</strong>
                </span>
                <span style={{ opacity: 0.8 }}>
                  Personas: {previewTheme.personas.map(p => p.characterName).join(', ')}
                </span>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
              🚀 Sign In & Launch {previewTheme.name}
            </button>
          </form>
        </div>
      )}

      {/* MODAL 2: Theme Prompt & Customizer */}
      {showThemeModal && (
        <div className="modal-backdrop" onClick={() => setShowThemeModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>🎨 Customize Theme by Interest</h2>
              <button
                className="outline"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                onClick={() => setShowThemeModal(false)}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Type any show, game, or interest below (like <strong>Dragon Ball</strong>,{' '}
              <strong>AMC&apos;s The Walking Dead</strong>, or <strong>Cyberpunk</strong>) and the
              entire 4K background, 3D orb characters, personas, and 9,000 milestones will adapt!
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Type your interest or theme..."
                value={themePromptInput}
                onChange={e => setThemePromptInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleApplyThemePrompt(themePromptInput);
                    setShowThemeModal(false);
                  }
                }}
              />
              <button
                onClick={() => {
                  handleApplyThemePrompt(themePromptInput);
                  setShowThemeModal(false);
                }}
              >
                Apply
              </button>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1' }}>
              4K Illustrated Worlds:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.values(PRESET_THEMES).map(preset => (
                <div
                  key={preset.id}
                  onClick={() => {
                    handleApplyThemePrompt(preset.interestPrompt);
                    setShowThemeModal(false);
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
                  user Gmail addresses, export CSVs, and configure automated email webhooks.
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="Paste Google Apps Script Web App URL for auto-emails..."
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

      {/* MODAL 5: Google Forms Feedback & In-App Feedback */}
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

            <div
              style={{
                padding: '1rem',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  📋 Google Feedback Form Option
                </span>
                {isOwner && (
                  <button
                    type="button"
                    className="outline"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                    onClick={() => setIsConfiguringFormUrl(!isConfiguringFormUrl)}
                  >
                    {isConfiguringFormUrl ? 'Hide Link Setup' : '⚙️ Set Google Form URL'}
                  </button>
                )}
              </div>

              {isOwner && isConfiguringFormUrl && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="Paste https://docs.google.com/forms/... link here"
                    value={customGoogleFormUrl}
                    onChange={e => {
                      setCustomGoogleFormUrl(e.target.value);
                      localStorage.setItem('pomodoro-google-form-url', e.target.value);
                    }}
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.8rem' }}
                  />
                </div>
              )}

              {customGoogleFormUrl ? (
                <a
                  href={customGoogleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <button type="button" style={{ width: '100%' }}>
                    📝 Open Google Feedback Form ↗
                  </button>
                </a>
              ) : (
                <a
                  href={`mailto:${APP_CONFIG.OWNER_EMAIL}?subject=${encodeURIComponent(
                    'Focus Arena Feedback'
                  )}`}
                  style={{ textDecoration: 'none' }}
                >
                  <button type="button" className="outline" style={{ width: '100%' }}>
                    ✉️ Email Feedback Directly to {APP_CONFIG.OWNER_NAME} ↗
                  </button>
                </a>
              )}
            </div>

            <form
              onSubmit={handleFeedbackSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                Instant In-App Feedback (Sent to {APP_CONFIG.OWNER_NAME}):
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
              <button type="submit">Send Feedback</button>
              {feedbackSubmitted && (
                <div
                  style={{
                    color: '#4ade80',
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    fontWeight: 700,
                  }}
                >
                  ✓ Thank you! Your feedback has been sent!
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: Post-Session Reminder + Calendar & Microsoft OneNote Sync */}
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
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Message recruiter on LinkedIn, Call client, Stretch..."
                  value={sessionReminderText}
                  onChange={e => setSessionReminderText(e.target.value)}
                />
                {sessionReminderText && (
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => setSessionReminderText('')}
                  >
                    Clear
                  </button>
                )}
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                As soon as your current Pomodoro session reaches 00:00, an alert banner and chime will
                remind you.
              </span>
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

      {/* MODAL 7: Product Showcase, Creator Branding & Pro Tier ($2.99/mo) */}
      {showProModal && (
        <div className="modal-backdrop" onClick={() => setShowProModal(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: '640px' }}
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
                  <li>Pomodoro Focus & Break Timer</li>
                  <li>+1,000 Power Task Gamification</li>
                  <li>Starter 4K Themes & Personas</li>
                  <li>Voice Dictation & Hover Task Copy</li>
                </ul>
                <button
                  type="button"
                  className="outline"
                  style={{ marginTop: 'auto' }}
                  onClick={() => setShowProModal(false)}
                >
                  Current Plan
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
                  <li>Unlimited Custom AI Theme Prompts</li>
                  <li>All 4K Worlds (DBZ, TWD, Cyberpunk, Shinobi, RPG)</li>
                  <li>Live Spotify & Apple Music Focus Dock</li>
                  <li>Microsoft OneNote & Calendar Sync</li>
                  <li>PRO Golden Badge & Priority Feature Access</li>
                </ul>
                <button
                  type="button"
                  style={{ marginTop: 'auto' }}
                  onClick={() => {
                    if (APP_CONFIG.PRO_CHECKOUT_URL) {
                      window.open(APP_CONFIG.PRO_CHECKOUT_URL, '_blank', 'noopener,noreferrer');
                    } else {
                      const nextPro = !isProMember;
                      setIsProMember(nextPro);
                      localStorage.setItem('pomodoro-pro-member', String(nextPro));
                    }
                  }}
                >
                  {isProMember ? '✓ Pro Badge Active' : '🚀 Unlock Pro (Early Access)'}
                </button>
              </div>
            </div>

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
    </div>
  );
}

export default App;
