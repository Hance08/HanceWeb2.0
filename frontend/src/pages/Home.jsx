import React, { useEffect, useRef } from "react";
import styles from "./css/Home.module.css";
import { useMenuColor } from "../contexts/MenuColorContext";
import HeroSection from "../components/public/home/HeroSection";
import AboutMePreview from "../components/public/home/AboutMePreview";
import PortfolioPreview from "../components/public/home/PortfolioPreview";
import VirtualAssistant from "../components/public/home/VirtualAssistant";

function Home() {
  const { setMenuIconColor, setDarkSectionRef } = useMenuColor();
  const blackSectionRef = useRef(null);

  useEffect(() => {
    if (blackSectionRef.current) {
      setDarkSectionRef(blackSectionRef);
    }
    return () => {
      setDarkSectionRef(null);
      setMenuIconColor("dark");
    };
  }, [setDarkSectionRef, setMenuIconColor]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroContainer}>
        <HeroSection />
        <VirtualAssistant />
      </div>
      <div ref={blackSectionRef} className={styles.subBlackContainer}>
        <AboutMePreview />
      </div>
      <div className={styles.subWhiteContainer}>
        <PortfolioPreview />
      </div>
    </div>
  );
}

export default Home;
