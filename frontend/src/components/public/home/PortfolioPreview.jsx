import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../pages/css/Home.module.css"; // Adjusted path for styles
import { portfolioService } from "../../../services/portfolioService"; // Import portfolioService

function PortfolioPreview() {
  const navigate = useNavigate();
  const portfolioSectionRef = useRef(null);
  const [isPortfolioSectionVisible, setIsPortfolioSectionVisible] =
    useState(false);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  // Fetch portfolio items for featured projects
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setProjectsLoading(true);
        setProjectsError("");
        const allItems = await portfolioService.getPortfolioItems();
        setFeaturedProjects(allItems.slice(0, 2)); // Select the first 2 items
      } catch (err) {
        setProjectsError(err.message || "無法載入精選專案內容。");
        console.error(err);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchFeaturedItems();
  }, []);

  // Intersection observer for Portfolio Preview section animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPortfolioSectionVisible(true);
        } else {
          setIsPortfolioSectionVisible(false);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    const currentPortfolioRef = portfolioSectionRef.current;
    if (currentPortfolioRef) observer.observe(currentPortfolioRef);
    return () => {
      if (currentPortfolioRef) observer.unobserve(currentPortfolioRef);
    };
  }, []);

  return (
    <div
      ref={portfolioSectionRef}
      className={`${styles.portfolioPreview} ${
        isPortfolioSectionVisible ? styles.animateIn : ""
      }`}
    >
      <div className={styles.portfolioInfo}>
        <h2 className={styles.portfolioPreviewTitle}>精選專案</h2>
        <p className={styles.portfolioPreviewText}>
          以下是我近期投入的幾個專案，它們展示了我在不同技術領域的探索與實踐。
          從前端的互動設計到後端的資料處理，每一個專案都凝聚了我的努力與思考。
        </p>
        <button
          className={`ctaButtonPrimary ${styles.portfolioPreviewCta}`}
          onClick={() => navigate("/portfolio")}
        >
          查看所有專案
        </button>
      </div>
      <div className={styles.portfolioCardsColumn}>
        {projectsLoading && <p>載入專案中...</p>}
        {projectsError && <p style={{ color: "red" }}>{projectsError}</p>}
        {!projectsLoading && !projectsError && featuredProjects.length > 0 && (
          <img
            src={featuredProjects[0].imageUrl}
            alt={featuredProjects[0].title}
            className={`${styles.portfolioCardItem} ${styles.cardAlignRight}`}
          />
        )}
        {!projectsLoading && !projectsError && featuredProjects.length > 1 && (
          <img
            src={featuredProjects[1].imageUrl}
            alt={featuredProjects[1].title}
            className={`${styles.portfolioCardItem} ${styles.cardAlignLeft}`}
          />
        )}
      </div>
    </div>
  );
}

export default PortfolioPreview;
