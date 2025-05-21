import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './HomePage.module.css'; // Import CSS Modules
import { FaGithub, FaLinkedin } from 'react-icons/fa'; // Import icons

function HomePage() {

  return (
    <div className={styles.pageContainer}> 
      
      {/* Hero Div */}
      <div className={styles.heroContainer}>
            <img 
              src="/src/assets/avatar.png" // Replace with your actual image path
              alt="Hance - 秦宇澔" 
              className={styles.heroProfileImage} 
            />
            <h1 className={styles.heroTitle}>Hance - 秦宇澔</h1>
            <div className={styles.socialLinksContainer}>
              <a href="https://github.com/Hance08" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaGithub /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/hance-%E7%A7%A6-00600b362/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaLinkedin /> LinkedIn
              </a>
            </div>
      </div>

      {/* About Me Excerpt Div - Styled as a card-like section with full-width background */}
      <div className={`${styles.section} ${styles.sectionAsCard} ${styles.fullWidthBgSection}`}>
        <div className={styles.contentWrapper}> {/* Content wrapper for constrained width */}
          <h2 className={styles.sectionTitle}>關於我</h2>
            <p className={styles.sectionText}>
              來自臺灣科技大學資訊管理系，專注於學校專題開發，以Flutter開發Android APP。
              除了學校專題外，也喜歡自己開發網站，研究新技術，並將其應用於解決實際問題。
            </p>
            <Link to="/about" className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}>
              進一步了解我
            </Link>
        </div>
      </div>

      {/* Life Log Section - Replaces Skills Highlight Div */}
      <div className={`${styles.section} ${styles.sectionAsCard} ${styles.lifeLogSectionCard} ${styles.fullWidthBgSection}`}> 
        <div className={styles.contentWrapper}> 
          <h2 className={styles.sectionTitle}>生活記錄</h2>
          {/* Placeholder content for Life Log. Replace with actual content structure. */}
          <p className={styles.sectionText}>
            這裡將會展示我的生活點滴與記錄。
            敬請期待未來的更新！
          </p>
          {/* Example: You might want a list of log entries here later */}
          {/* <ul className={styles.lifeLogList}>
            <li className={styles.lifeLogItem}>紀錄一：今天學會了新的東西...</li>
            <li className={styles.lifeLogItem}>紀錄二：完成了一個小專案...</li>
          </ul> */}
        </div>
      </div>
    </div>
  );
}

export default HomePage; 