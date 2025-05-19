import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './HomePage.module.css'; // Import CSS Modules

// Inline styles for nav links (can be moved or kept simple)
const navLinkStyle = {
  margin: '0 15px', 
  textDecoration: 'none',
  color: '#0e172a', 
  fontWeight: '500',
};

// const activeNavLinkStyle = { // Style for the current page link (optional)
//   // fontWeight: 'bold',
//   // color: '#0056b3',
// };

function HomePage() {
  const { isAuthenticated, currentUser, logout } = useAuth();

  return (
    <div className={styles.pageContainer}> 
      {/* Nav Bar Overlay */}
      <div className={styles.mainNavOverlay}>
        <nav>
          <Link to="/" className={styles.navLink}>首頁</Link>
          <Link to="/about" className={styles.navLink}>關於我</Link>
          <Link to="/portfolio" className={styles.navLink}>作品集</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className={styles.navLink}>管理後台</Link>
              <span className={styles.navUserGreeting}>你好, {currentUser?.username || '管理員'}! </span>
              <button 
                onClick={logout} 
                className={`${styles.ctaButton} ${styles.ctaButtonDanger}`}
              >
                登出
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.navLink}>登入</Link>
          )}
        </nav>
      </div>

      {/* Hero Div */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Hance - 全端網頁開發者</h1>
        <p className={styles.heroSubtitle}>
          我熱衷於打造美觀、實用且高效能的網頁應用程式。
          專精於 React、Node.js 及現代網頁技術。
        </p>
        <Link to="/portfolio" className={`${styles.ctaButton} ${styles.ctaButtonOutline}`}>
          查看我的作品
        </Link>
      </div>

      {/* About Me Excerpt Div - Styled as a card-like section with full-width background */}
      <div className={`${styles.section} ${styles.sectionAsCard} ${styles.fullWidthBgSection}`}>
        <div className={styles.contentWrapper}> {/* Content wrapper for constrained width */}
          <h2 className={styles.sectionTitle}>關於我</h2>
          <div className={styles.aboutCardContent}> 
            <p className={styles.sectionText}>
              一名充滿熱情的網頁開發者，致力於透過程式碼將創意想法變為現實。
              我享受學習新技術，並將其應用於解決實際問題，打造流暢且引人入勝的使用者體驗。
            </p>
            <Link to="/about" className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}>
              進一步了解我
            </Link>
          </div>
        </div>
      </div>

      {/* Skills Highlight Div - Styled as a card-like section with an alternate background for the page area and full-width inner card */}
      <div className={styles.sectionAlternateBg}> 
        <div className={`${styles.section} ${styles.sectionAsCard} ${styles.skillsSectionCard} ${styles.fullWidthBgSection}`}> 
          <div className={styles.contentWrapper}> {/* Content wrapper for constrained width */}
            <h2 className={styles.sectionTitle}>核心技能</h2>
            <ul className={styles.skillsList}>
              <li className={styles.skillItem}>React</li>
              <li className={styles.skillItem}>Node.js</li>
              <li className={styles.skillItem}>JavaScript (ES6+)</li>
              <li className={styles.skillItem}>MongoDB</li>
              <li className={styles.skillItem}>Express.js</li>
              <li className={styles.skillItem}>HTML5 & CSS3</li>
              <li className={styles.skillItem}>Git & GitHub</li>
              <li className={styles.skillItem}>RESTful APIs</li> 
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HomePage; 