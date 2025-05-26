import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './css/HomePage.module.css'; // Import CSS Modules
import { FaGithub, FaLinkedin } from 'react-icons/fa'; // Import icons
import Terminal from '../components/Terminal'; // Import the new Terminal component

const INTRO_ANIMATION_SEEN_KEY = 'hasSeenIntroAnimation';

function HomePage() {
  // Determine initial state based on sessionStorage
  const hasSeenIntroBefore = sessionStorage.getItem(INTRO_ANIMATION_SEEN_KEY) === 'true';

  const [showWelcomeText, setShowWelcomeText] = useState(!hasSeenIntroBefore);
  const [startGlitch, setStartGlitch] = useState(false);
  const [showTerminal, setShowTerminal] = useState(hasSeenIntroBefore);

  const navigate = useNavigate();

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
            <Terminal styles={styles} navigate={navigate} />
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage; 