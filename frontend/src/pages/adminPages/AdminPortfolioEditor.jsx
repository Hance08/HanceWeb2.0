import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { portfolioService } from '../../services/portfolioService';
import styles from './css/PortfolioEditor.module.css';

function AdminPortfolioEditor() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await portfolioService.getPortfolioItems();
      setPortfolioItems(data || []); // Ensure data is an array
    } catch (err) {
      setError(err.message || '無法獲取作品集項目');
      console.error('Fetch portfolio items error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (itemId) => {
    if (window.confirm('您確定要刪除此作品集項目嗎？此操作無法復原。')) {
      try {
        await portfolioService.deletePortfolioItem(itemId);
        setPortfolioItems(prevItems => prevItems.filter(item => item._id !== itemId)); // Assuming items have _id
        // Or, if your API returns the updated list or you prefer to refetch:
        // fetchItems(); 
      } catch (err) {
        setError(err.message || '刪除作品集項目失敗');
        console.error('Delete portfolio item error:', err);
      }
    }
  };

  if (loading) {
    return <p className={styles.loadingMessage}>載入作品集中...</p>;
  }

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.title}>管理作品集</h2>

      <div className={styles.actionsHeader}>
        <Link to="/admin/portfolio/new" className={styles.actionButton}>
          新增作品項目
        </Link>
        <Link to="/portfolio" target="_blank" rel="noopener noreferrer" className={`${styles.actionButton} ${styles.previewButton}`}>
          預覽作品集頁面
        </Link>
      </div>

      {error && <p className={styles.errorMessage}>錯誤: {error}</p>}

      {portfolioItems.length > 0 ? (
        <ul className={styles.itemList}>
          {portfolioItems.map(item => (
            <li key={item._id} className={styles.item}> {/* Assuming item._id exists */}
              <span className={styles.itemTitle}>{item.title || '未命名項目'}</span>
              <div className={styles.itemActions}>
                <Link to={`/admin/portfolio/edit/${item._id}`} className={styles.editButton}>
                  編輯
                </Link>
                <button onClick={() => handleDelete(item._id)} className={styles.deleteButton}>
                  刪除
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>目前沒有作品集項目。點擊「新增作品項目」來開始吧！</p>
      )}
    </div>
  );
}

export default AdminPortfolioEditor; 