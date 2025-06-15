import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../pages/css/Home.module.css"; // Adjusted path for styles
import aboutMeSvg from "../../../assets/aboutme.svg";

function AboutMePreview() {
  const navigate = useNavigate();
  const aboutSectionRef = useRef(null);
  const [isAboutSectionVisible, setIsAboutSectionVisible] = useState(false);

  // Intersection observer for About Me section animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAboutSectionVisible(true);
        } else {
          setIsAboutSectionVisible(false);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    const currentAboutRef = aboutSectionRef.current;
    if (currentAboutRef) observer.observe(currentAboutRef);
    return () => {
      if (currentAboutRef) observer.unobserve(currentAboutRef);
    };
  }, []);

  return (
    <div className={styles.aboutMeContainer}>
      <div className={styles.aboutMePreview}>
        <h2 className={styles.aboutMeTitle}>關於我</h2>
        <p className={styles.aboutMeText}>
          目前就讀於臺灣科技大學資訊管理系，熱愛開發系統、撰寫程式。目前專注於學校專題開發，自己也有一些Side
          Project， 喜歡學習新技術、解決問題，對於前端、後端、資料庫、DevOps
          都有涉獵。
        </p>
        <button
          className={`ctaButtonPrimary ${styles.aboutMeCta}`}
          onClick={() => navigate("/about")}
        >
          了解更多
        </button>
      </div>
      <div className={styles.aboutMeImageContainer}>
        <img
          src={aboutMeSvg}
          alt="About Me Illustration"
          className={styles.aboutMeImage}
        />
      </div>
    </div>
  );
}

export default AboutMePreview;
