import React, { useState, useEffect, useCallback } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

// Basic styling (can be moved to a CSS file)
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thTdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

const buttonStyle = {
  marginRight: '5px',
  padding: '5px 10px',
  cursor: 'pointer',
};

function AdminPortfolioPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await portfolioService.getPortfolioItems();
      setItems(data);
    } catch (err) {
      setError(err.message || '無法載入作品集項目。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除這個作品集項目嗎？')) {
      try {
        await portfolioService.deletePortfolioItem(id);
        setItems(prevItems => prevItems.filter(item => item._id !== id));
        alert('作品集項目已刪除。');
      } catch (err) {
        alert('刪除失敗：' + (err.response?.data?.message || err.message));
        console.error('Error deleting portfolio item:', err);
      }
    }
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>錯誤: {error} <button onClick={fetchItems}>重試</button></div>;
  }

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/admin">返回管理後台</Link>
      </nav>
      <h1>管理作品集</h1>
      <Link to="/admin/portfolio/new" style={{ ...buttonStyle, textDecoration: 'none', backgroundColor: '#28a745', color: 'white' }}>
        新增作品項目
      </Link>

      {items.length === 0 ? (
        <p>目前沒有作品集項目。</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>標題</th>
              <th style={thTdStyle}>簡述</th>
              <th style={thTdStyle}>圖片預覽</th>
              <th style={thTdStyle}>標籤</th>
              <th style={thTdStyle}>建立日期</th>
              <th style={thTdStyle}>操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td style={thTdStyle}>{item.title}</td>
                <td style={thTdStyle}>{item.description?.substring(0, 50)}{item.description?.length > 50 ? '...' : ''}</td>
                <td style={thTdStyle}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ width: '100px', height: 'auto' }} />}
                </td>
                <td style={thTdStyle}>{item.tags?.join(', ')}</td>
                <td style={thTdStyle}>{item.projectDate ? new Date(item.projectDate).toLocaleDateString() : '未指定'}</td>
                <td style={thTdStyle}>
                  <button 
                    style={buttonStyle} 
                    onClick={() => navigate(`/admin/portfolio/edit/${item._id}`)}
                  >
                    編輯
                  </button>
                  <button 
                    style={{...buttonStyle, backgroundColor: '#dc3545', color: 'white'}}
                    onClick={() => handleDelete(item._id)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPortfolioPage; 