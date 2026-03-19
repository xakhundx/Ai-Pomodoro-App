import React, { useState, useEffect, useRef } from 'react';
import AvatarCanvas from './components/AvatarCanvas';
import { askGemini, Task } from './services/gemini';
import './index.css';

const playCompletionChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playTone = (freq: number, timeOffset: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = ctx.currentTime + timeOffset;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + duration * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playTone(523.25, 0, 0.5); // C5
    playTone(659.25, 0.1, 0.5); // E5
    playTone(783.99, 0.2, 1.0); // G5
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

function App() {
  // API Key State
  const [userApiKey, setUserApiKey] = useState(() => {
    return localStorage.getItem('pomodoro-api-key') || '';
  });

  useEffect(() => {
    localStorage.setItem('pomodoro-api-key', userApiKey);
  }, [userApiKey]);

  // Task State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pomodoro-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTaskText, setNewTaskText] = useState('');
  
  // Voice Dictation State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;

    let baseText = newTaskText;
    if (baseText && !baseText.endsWith(' ')) baseText += ' ';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setNewTaskText(baseText + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const [isEditingTimer, setIsEditingTimer] = useState(false);
  const [timerInput, setTimerInput] = useState('');

  const handleTimerClick = () => {
    if (isRunning) return;
    setIsEditingTimer(true);
    setTimerInput(Math.floor(timeLeft / 60).toString());
  };

  const handleTimerSubmit = () => {
    setIsEditingTimer(false);
    const parsed = parseInt(timerInput);
    if (!isNaN(parsed) && parsed > 0) {
      setTimeLeft(parsed * 60);
      if (mode === 'Work') {
        setWorkDuration(parsed);
        localStorage.setItem('pomodoro-work-time', parsed.toString());
      } else {
        setBreakDuration(parsed);
        localStorage.setItem('pomodoro-break-time', parsed.toString());
      }
    }
  };

  // Panel Collapse States
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Timer State
  const [workDuration, setWorkDuration] = useState(() => parseInt(localStorage.getItem('pomodoro-work-time') || '25'));
  const [breakDuration, setBreakDuration] = useState(() => parseInt(localStorage.getItem('pomodoro-break-time') || '5'));
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'Work' | 'Break'>('Work');

  useEffect(() => {
    localStorage.setItem('pomodoro-work-time', workDuration.toString());
    localStorage.setItem('pomodoro-break-time', breakDuration.toString());
  }, [workDuration, breakDuration]);

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

  // Chat State
  const [chatMessage, setChatMessage] = useState("System initialized. I am your productivity assistant. Ready to manage your tasks?");
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      playCompletionChime();
      setIsRunning(false);
      handleAIInteraction(`The ${mode} session has elapsed. What should I prioritize next?`);
      if (mode === 'Work') {
        setMode('Break');
        setTimeLeft(breakDuration * 60);
      } else {
        setMode('Work');
        setTimeLeft(workDuration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, workDuration, breakDuration]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const switchMode = (newMode: 'Work' | 'Break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'Work' ? workDuration * 60 : breakDuration * 60);
  };

  // Task Handlers
  const addTask = () => {
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTaskText, completed: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id: string, text: string, completed: boolean) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (!completed) {
      handleAIInteraction(`Task status update: Just completed "${text}".`);
    }
  };

  const updateTaskText = (id: string, newText: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => setDraggedTaskIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDragOverContainer = (e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    if (y < 40) {
      container.scrollTop -= 10;
    } else if (y > rect.height - 40) {
      container.scrollTop += 10;
    }
  };

  const handleDrop = (index: number) => {
    if (draggedTaskIndex === null || draggedTaskIndex === index) return;
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(draggedTaskIndex, 1);
    newTasks.splice(index, 0, movedTask);
    setTasks(newTasks);
    setDraggedTaskIndex(null);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // AI Interaction Handler
  const handleAIInteraction = async (prompt: string) => {
    setIsTyping(true);
    setChatMessage("Processing..."); // typing indicator
    
    // Call Gemini Service
    const response = await askGemini(userApiKey, prompt, tasks, { mode, timeLeft });
    setChatMessage(response);
    setIsTyping(false);
  };

  const handleChatSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim()) {
      handleAIInteraction(userInput);
      setUserInput('');
    }
  };

  // Format Time
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className={`app-container ${isRunning && mode === 'Work' ? 'focus-mode' : ''}`}>
      <div className="canvas-container">
        <AvatarCanvas mode={mode} isRunning={isRunning} />
      </div>
      
      <div className="ui-layer">
        {/* Left Panel: AI Assistant Chat */}
        <div className={`panel-wrapper panel-wrapper-left ${isLeftOpen ? '' : 'closed'}`}>
          <div className="panel panel-left">
            <h2>AI Core Assistant</h2>
          
          <input 
            type="password" 
            className="input-field" 
            placeholder="Enter Gemini API Key to activate..." 
            value={userApiKey}
            onChange={(e) => setUserApiKey(e.target.value)}
            style={{ padding: '0.6rem', fontSize: '0.8rem', border: userApiKey ? '1px solid var(--glass-border)' : '1px solid #ef4444' }}
          />

          {!userApiKey && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', color: '#fca5a5', fontSize: '0.75rem', lineHeight: '1.4' }}>
              <strong>Offline Mode Active:</strong> Provide a Gemini API key (free tier is fine) to unlock dynamic AI insights. Until then, basic offline logic is loaded.
            </div>
          )}

          <div className="chat-box" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              padding: '12px 16px', 
              borderRadius: '16px 16px 16px 4px', 
              width: 'fit-content',
              maxWidth: '90%',
              lineHeight: '1.4',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              animation: isTyping ? 'pulseGlow 1s infinite' : 'float 4s ease-in-out infinite' 
            }}>
              {chatMessage}
            </div>
          </div>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Type your command..." 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleChatSubmit}
            disabled={isTyping}
          />
          </div>
          <div className="toggle-btn toggle-left" onClick={() => setIsLeftOpen(!isLeftOpen)}>
            {isLeftOpen ? '◀' : '▶'}
          </div>
        </div>

        {/* Right Panel: Pomodoro & Tasks */}
        <div className={`panel-wrapper panel-wrapper-right ${isRightOpen ? '' : 'closed'}`}>
          <div className="toggle-btn toggle-right" onClick={() => setIsRightOpen(!isRightOpen)}>
            {isRightOpen ? '▶' : '◀'}
          </div>
          <div className="panel panel-right">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{mode} Time</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Work</span>
                <input type="number" min="1" value={workDuration} onChange={(e) => handleWorkChange(parseInt(e.target.value) || 1)} style={{ width: '40px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: 'white', textAlign: 'center', fontSize: '0.85rem' }} disabled={isRunning} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Break</span>
                <input type="number" min="1" value={breakDuration} onChange={(e) => handleBreakChange(parseInt(e.target.value) || 1)} style={{ width: '40px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: 'white', textAlign: 'center', fontSize: '0.85rem' }} disabled={isRunning} />
              </div>
            </div>
          </div>
          {isEditingTimer ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input 
                type="number"
                value={timerInput}
                onChange={(e) => setTimerInput(e.target.value)}
                onBlur={handleTimerSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTimerSubmit()}
                autoFocus
                style={{ fontSize: '5rem', fontWeight: 800, textAlign: 'center', margin: '0', fontFamily: 'monospace', background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', textShadow: '0 0 30px var(--primary-glow)' }}
              />
            </div>
          ) : (
            <div onClick={handleTimerClick} style={{ fontSize: '5rem', fontWeight: 800, textAlign: 'center', margin: '0', fontFamily: 'monospace', textShadow: '0 0 30px var(--primary-glow)', color: 'white', letterSpacing: '-2px', cursor: isRunning ? 'default' : 'text' }} title={isRunning ? '' : 'Click to edit'}>
              {mins}:{secs}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button style={{ flex: 1 }} onClick={toggleTimer}>
              {isRunning ? 'Pause' : 'Start Focus'}
            </button>
            <button className="outline" onClick={() => switchMode(mode === 'Work' ? 'Break' : 'Work')}>
              {mode === 'Work' ? 'Break' : 'Work'}
            </button>
          </div>

          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.5rem 0' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Your Tasks</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{completedCount}/{tasks.length} done</span>
          </div>
          
          <ul 
            onDragOver={handleDragOverContainer}
            style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', overflowX: 'hidden', flex: 1, minHeight: '150px' }}
          >
            {tasks.map((task, index) => (
              <li 
                key={task.id} 
                className="task-item" 
                style={{ opacity: task.completed ? 0.6 : 1, cursor: 'grab' }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <input 
                  type="checkbox" 
                  className="task-checkbox" 
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, task.text, task.completed)}
                /> 
                <input 
                  type="text"
                  value={task.text}
                  onChange={(e) => updateTaskText(task.id, e.target.value)}
                  style={{ 
                    flex: 1, 
                    minWidth: 0,
                    background: 'transparent', 
                    border: 'none', 
                    outline: 'none', 
                    color: 'white', 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    textOverflow: 'ellipsis',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    padding: 0
                  }}
                  disabled={task.completed}
                />
                <button 
                  className="outline" 
                  style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'rgba(255,0,0,0.1)', border: 'none', color: '#ff4b4b' }}
                  onClick={() => deleteTask(task.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
            <button 
              className="outline"
              style={{ padding: '0.75rem', background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'transparent', borderColor: isListening ? '#ef4444' : 'var(--primary)' }}
              onClick={toggleListening}
              title="Dictate Task"
            >
              {isListening ? '🛑' : '🎤'}
            </button>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Add a new task..." 
              style={{ flex: 1, padding: '0.75rem' }} 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button style={{ padding: '0.75rem 1.25rem' }} onClick={addTask}>+</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;
