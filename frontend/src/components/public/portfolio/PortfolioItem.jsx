import React from "react";
import styles from "../../../pages/css/Portfolio.module.css"; // Adjusted path

function PortfolioItem({ item }) {
  return (
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
          <div className={styles.tagContainer}>
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
      </div>
    </div>
  );
}

export default PortfolioItem;
