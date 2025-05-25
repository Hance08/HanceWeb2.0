import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './css/HomePage.module.css'; // Import CSS Modules
import { FaGithub, FaLinkedin } from 'react-icons/fa'; // Import icons

const getInitialBootLines = () => [
  "Welcome, guest!",
  "Type 'about', 'portfolio', 'help' or 'clear' then press Enter.",
  "", 
];

const helpText = `
Available commands:
  about        - Learn more about me.
  portfolio    - View my projects.
  clear        - Clear the terminal screen.
  help         - Show this help message.

Type a command and press Enter.
`;

const INTRO_ANIMATION_SEEN_KEY = 'hasSeenIntroAnimation';

function HomePage() {
  // Determine initial state based on sessionStorage
  const hasSeenIntroBefore = sessionStorage.getItem(INTRO_ANIMATION_SEEN_KEY) === 'true';

  const [showWelcomeText, setShowWelcomeText] = useState(!hasSeenIntroBefore);
  const [startGlitch, setStartGlitch] = useState(false);
  const [showTerminal, setShowTerminal] = useState(hasSeenIntroBefore);

  const [terminalLines, setTerminalLines] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const navigate = useNavigate();
  const terminalOutputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (hasSeenIntroBefore) {
      // If intro has been seen, skip all welcome animations
      setShowWelcomeText(false);
      setStartGlitch(false); // Ensure glitch isn't accidentally triggered
      setShowTerminal(true);
      return; // Skip setting up timers for welcome animation
    }

    const welcomeFadeInUpDuration = 1200; 
    const welcomeFadeInUpDelay = 300;    
    const displayWelcomeFor = 500;      
    const glitchAnimationDuration = 800; 

    const totalTimeToStartGlitch = welcomeFadeInUpDuration + welcomeFadeInUpDelay + displayWelcomeFor;
    const totalTimeToShowTerminal = totalTimeToStartGlitch + glitchAnimationDuration;

    const glitchTimer = setTimeout(() => {
      setStartGlitch(true);
    }, totalTimeToStartGlitch);

    const terminalTimer = setTimeout(() => {
      setShowWelcomeText(false); 
      setShowTerminal(true);
      sessionStorage.setItem(INTRO_ANIMATION_SEEN_KEY, 'true'); // Mark intro as seen
    }, totalTimeToShowTerminal);

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(terminalTimer);
    }; 
  }, [hasSeenIntroBefore]); // Add hasSeenIntroBefore to dependency array

  useEffect(() => {
    if (showTerminal) {
      // Set initial lines for terminal regardless of how it became visible
      setTerminalLines(getInitialBootLines()); 
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [showTerminal]);

  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const processCommand = () => {
    const command = currentInput.trim().toLowerCase();
    const commandLine = `guest@hance-portfolio:~$ ${currentInput}`;
    let newOutputLines = [...terminalLines, commandLine];

    if (command === 'about') {
      newOutputLines.push("Navigating to /about...");
      navigate('/about');
    } else if (command === 'portfolio') {
      newOutputLines.push("Navigating to /portfolio...");
      navigate('/portfolio');
    } else if (command === 'clear') {
      setTerminalLines(getInitialBootLines());
      setCurrentInput('');
      return;
    } else if (command === 'help') {
      newOutputLines.push(helpText);
    } else if (command === 'login') {
      navigate('/login');
    } else if (command === '') {
      // No output for empty command, just new prompt effectively shown by clearing input
    } else {
      newOutputLines.push(`-bash: command not found: ${command}`);
    }
    newOutputLines.push(""); 
    setTerminalLines(newOutputLines);
    setCurrentInput('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      processCommand();
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Hero Div */}
      <div className={styles.heroContainer}>
        <div className={styles.leftContainer}>
          <img
            src="/src/assets/avatar.png" 
            alt="Hance - 秦宇澔"
            className={styles.heroProfileImage}
          />
          <h1 className={styles.heroTitle}>Hance 秦宇澔</h1>
          <div className={styles.socialLinksContainer}>
            <a href="https://github.com/Hance08" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/hance-%E7%A7%A6-00600b362/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaLinkedin />
            </a>
          </div>
        </div>
        <div className={styles.rightContainer}>
          {showWelcomeText && (
            <p 
              className={`${styles.heroText} ${startGlitch ? styles.glitchActive : ''}`}
              data-text="歡迎來到我的個人網站～"
            >
              歡迎來到我的個人網站～
            </p>
          )}
          {showTerminal && (
            <div className={styles.terminalContainer}>
              <pre className={styles.terminalText} ref={terminalOutputRef}>
                {terminalLines.join('\n')}
              </pre>
              <div className={styles.terminalInputArea}>
                <span className={styles.terminalPrompt}>guest@hance-portfolio:~$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.terminalInput}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck="false"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage; 