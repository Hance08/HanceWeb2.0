import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../pages/css/Home.module.css"; // Adjusted path for styles

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
    <div
      ref={aboutSectionRef}
      className={`${styles.aboutMePreview} ${
        isAboutSectionVisible ? styles.animateIn : ""
      }`}
    >
      <h2 className={styles.aboutMeTitle}>關於我</h2>
      <p className={styles.aboutMeText}>
        我是一名充滿熱情的全端開發者，專注於打造流暢、美觀且實用的網頁應用程式。對於學習新技術抱有極大的熱忱，並樂於接受挑戰。
      </p>
      <p className={styles.aboutMeText}>
        擅長使用 React、Node.js 等現代網頁技術棧，並對 UI/UX
        設計有著濃厚的興趣。致力於透過程式碼解決實際問題，並為使用者帶來卓越的數位體驗。
      </p>
      <button
        className={`ctaButtonPrimary ${styles.aboutMeCta}`}
        onClick={() => navigate("/about")}
      >
        了解更多
      </button>
    </div>
  );
}

export default AboutMePreview;
