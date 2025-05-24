import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './css/HomePage.module.css'; // Import CSS Modules
import { FaGithub, FaLinkedin } from 'react-icons/fa'; // Import icons

function HomePage() {
  const [showWelcomeText, setShowWelcomeText] = useState(true);
  const [startGlitch, setStartGlitch] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const welcomeFadeInUpDuration = 1200; // As per .heroText animation
    const welcomeFadeInUpDelay = 300;    // As per .heroText animation-delay
    const displayWelcomeFor = 2000;      // How long to show the welcome message after it's fully visible
    const glitchAnimationDuration = 800; // Duration for the glitch effect itself

    const totalTimeToStartGlitch = welcomeFadeInUpDuration + welcomeFadeInUpDelay + displayWelcomeFor;
    const totalTimeToShowTerminal = totalTimeToStartGlitch + glitchAnimationDuration;

    // Timer to start the glitch effect
    const glitchTimer = setTimeout(() => {
      setStartGlitch(true);
    }, totalTimeToStartGlitch);

    // Timer to hide welcome message and show terminal
    const terminalTimer = setTimeout(() => {
      setShowWelcomeText(false); // Welcome text will be hidden by its own glitch animation ending
      setShowTerminal(true);
    }, totalTimeToShowTerminal);

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(terminalTimer);
    }; // Cleanup timers on component unmount
  }, []);

  return (
    <div className={styles.pageContainer}>

      {/* Hero Div */}
      <div className={styles.heroContainer}>
        <div className={styles.leftContainer}>
          <img
            src="/src/assets/avatar.png" // Replace with your actual image path
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
              <pre className={styles.terminalText}>
                {`HanceOS v2.0 Initializing...\n[Kernel] Booting from /dev/sda1\n[Services] Starting portfolio_daemon... [OK]\n[Network] Interface eth0 configured. IP: 127.0.0.1\n[UI] Launching Graphical Shell...\n\nWelcome, guest!\nPortfolio loaded successfully.\n\nguest@hance-portfolio:~$ `}
                <span className={styles.terminalCursor}></span>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage; 