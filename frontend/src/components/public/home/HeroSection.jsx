import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import styles from "../../../pages/css/Home.module.css"; // Adjusted path for styles

function HeroSection() {
  return (
    <div className={styles.subWhiteContainer}>
      <div className={styles.heroMainContent}>
        <h1 className={styles.mainGreeting}>
          <span className={styles.greetingIntro}>Hi, I'm </span>
          <span className={styles.greetingName}>Hance</span>
        </h1>
        <p className={styles.welcomeSubtitle}>Welcome to my website</p>
        <div className={styles.socialLinksContainer}>
          <a
            href="https://github.com/Hance08"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="GitHub Profile"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/hance-%E7%A7%A6-00600b362/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
