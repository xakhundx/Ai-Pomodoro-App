import React, { useState, useEffect, useRef } from 'react';
import AvatarCanvas from './components/AvatarCanvas';
import { askGemini, Task } from './services/gemini';
import './index.css';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function App() {
  // Task State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pomodoro-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTaskText, setNewTaskText] = useState('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'Work' | 'Break'>('Work');

  // Chat State
  const [chatMessage, setChatMessage] = useState("System initialized. I am your productivity assistant. Ready to manage your tasks?");
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      handleAIInteraction(`The ${mode} session has elapsed. What should I prioritize next?`);
      if (mode === 'Work') {
        setMode('Break');
        setTimeLeft(BREAK_TIME);
      } else {
        setMode('Work');
        setTimeLeft(WORK_TIME);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const switchMode = (newMode: 'Work' | 'Break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'Work' ? WORK_TIME : BREAK_TIME);
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

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // AI Interaction Handler
  const handleAIInteraction = async (prompt: string) => {
    setIsTyping(true);
    setChatMessage("Processing..."); // typing indicator
    
    // Call Gemini Service
    const response = await askGemini(prompt, tasks, { mode, timeLeft });
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
    <div className="app-container">
      <div className="canvas-container">
        <AvatarCanvas />
      </div>
      
      <div className="ui-layer">
        {/* Left Panel: AI Assistant Chat */}
        <div className="panel panel-left">
          <h2>AI Core Assistant</h2>
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

        {/* Right Panel: Pomodoro & Tasks */}
        <div className="panel panel-right">
          <h2>{mode} Time</h2>
          <div style={{ fontSize: '5rem', fontWeight: 800, textAlign: 'center', margin: '0', fontFamily: 'monospace', textShadow: '0 0 30px var(--primary-glow)', color: 'white', letterSpacing: '-2px' }}>
            {mins}:{secs}
          </div>
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
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1, minHeight: '150px' }}>
            {tasks.map(task => (
              <li key={task.id} className="task-item" style={{ opacity: task.completed ? 0.6 : 1 }}>
                <input 
                  type="checkbox" 
                  className="task-checkbox" 
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, task.text, task.completed)}
                /> 
                <span style={{ flex: 1, color: 'white', textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.text}
                </span>
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
  );
}

export default App;
