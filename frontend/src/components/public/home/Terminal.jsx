import React, { useState, useEffect, useRef } from 'react';

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

function Terminal({ styles, navigate }) {
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const terminalOutputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Set initial lines for terminal
    setTerminalLines(getInitialBootLines());
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Run once on mount

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
      // No output for empty command
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
  );
}

export default Terminal; 