import React, { useState, useEffect } from "react";
import { portfolioService } from "../services/portfolioService";
import styles from "./css/Portfolio.module.css";

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
            <div key={item._id} className={styles.portfolioItem}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={styles.portfolioImage}
                />
              )}
              <div className={styles.itemTextContent}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div>
                    {item.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className={styles.actionLinks}>
                  {item.projectUrl && (
                    <p>
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        查看專案詳情
                      </a>
                    </p>
                  )}
                  {item.repositoryUrl && (
                    <p>
                      <a
                        href={item.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        查看原始碼
                      </a>
                    </p>
                  )}
                </div>
                {/* Optional: Link to a detailed page for each item */}
                {/* <Link to={`/portfolio/${item._id}`}>查看詳情</Link> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Portfolio;
