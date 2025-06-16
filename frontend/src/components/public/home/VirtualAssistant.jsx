import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import styles from "../../../pages/css/Home.module.css";

// 導入動畫檔案
import idleAnimation from "../../../assets/animations/idle.json";
import wavingAnimation from "../../../assets/animations/waving.json";

const VirtualAssistant = () => {
  const lottieRef = useRef();
  const [currentAnimation, setCurrentAnimation] = React.useState("idle");

  useEffect(() => {
    // 載入時播放揮手動畫
    setCurrentAnimation("waving");
    const timer = setTimeout(() => {
      setCurrentAnimation("idle");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 滑鼠移動時的互動
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!lottieRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // 計算滑鼠位置相對於視窗的百分比
      const xPercent = (clientX / innerWidth) * 100;
      const yPercent = (clientY / innerHeight) * 100;

      // 根據滑鼠位置調整動畫播放速度和方向
      if (lottieRef.current) {
        // 調整播放速度，讓角色有輕微反應
        lottieRef.current.setSpeed(0.8 + (yPercent / 100) * 0.4);

        // 如果需要，可以設置特定的動畫幀
        // lottieRef.current.goToAndPlay(frameNumber, true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const animationData =
    currentAnimation === "waving" ? wavingAnimation : idleAnimation;

  return (
    <div className={styles.assistantContainer}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={true}
        autoplay={true}
        className={styles.lottieAnimation}
        onComplete={() => {
          // 如果是揮手動畫完成，切換回待機動畫
          if (currentAnimation === "waving") {
            setCurrentAnimation("idle");
          }
        }}
      />
    </div>
  );
};

export default VirtualAssistant;
