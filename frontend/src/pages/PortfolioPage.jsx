import React, { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolioService';
import { Link } from 'react-router-dom';

// Basic styling for portfolio items (you can move this to a CSS file)
const itemStyle = {
  border: '1px solid #ddd',
  padding: '15px',
  marginBottom: '15px',
  borderRadius: '5px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  maxWidth: '600px',
};

const imageStyle = {
  maxWidth: '100%',
  height: 'auto',
  marginBottom: '10px',
  borderRadius: '4px',
};

const tagStyle = {
  display: 'inline-block',
  backgroundColor: '#eee',
  color: '#333',
  padding: '2px 8px',
  marginRight: '5px',
  marginBottom: '5px',
  borderRadius: '3px',
  fontSize: '0.9em',
};

function PortfolioPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await portfolioService.getPortfolioItems();
        setItems(data);
      } catch (err) {
        setError(err.message || '無法載入作品集內容。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>錯誤: {error}</div>;
  }

  if (items.length === 0) {
    return (
      <div>
        <nav><Link to="/">回到首頁</Link></nav>
        <h1>我的作品集</h1>
        <p>目前尚無作品可展示。</p>
      </div>
    );
  }

  return (
    <div>
      <nav>
        <Link to="/">回到首頁</Link>
      </nav>
      <h1>我的作品集</h1>
      <div>
        {items.map((item) => (
          <div key={item._id} style={itemStyle}>
            <h3>{item.title}</h3>
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} style={imageStyle} />
            )}
            <p>{item.description}</p>
            {item.tags && item.tags.length > 0 && (
              <div>
                <strong>技術棧:</strong>
                {item.tags.map((tag, index) => (
                  <span key={index} style={tagStyle}>{tag}</span>
                ))}
              </div>
            )}
            {item.projectUrl && (
              <p><a href={item.projectUrl} target="_blank" rel="noopener noreferrer">查看專案</a></p>
            )}
            {item.repositoryUrl && (
              <p><a href={item.repositoryUrl} target="_blank" rel="noopener noreferrer">查看原始碼</a></p>
            )}
            {/* Optional: Link to a detailed page for each item */}
            {/* <Link to={`/portfolio/${item._id}`}>查看詳情</Link> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioPage; 