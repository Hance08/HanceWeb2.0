import React, { useState, useEffect } from "react";
import { portfolioService } from "../services/portfolioService";
import styles from "./css/Portfolio.module.css";
import PortfolioItem from "../components/public/portfolio/PortfolioItem";

function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await portfolioService.getPortfolioItems();
        setItems(data);
      } catch (err) {
        setError(err.message || "無法載入作品集內容。");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <div className={styles.loadingMessage}>載入中...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>錯誤: {error}</div>;
  }

  return (
    <div className={styles.portfolioContainer}>
      {items.length === 0 ? (
        <p className={styles.noItemsMessage}>目前尚無作品可展示。</p>
      ) : (
        <div className={styles.portfolioGrid}>
          {items.map((item) => (
            <PortfolioItem key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Portfolio;
