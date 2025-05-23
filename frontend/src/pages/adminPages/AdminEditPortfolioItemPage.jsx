import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { portfolioService } from '../../services/portfolioService';
import AdminPortfolioItemForm from '../../components/AdminPortfolioItemForm';

function AdminEditPortfolioItemPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  const fetchItem = useCallback(async () => {
    if (!itemId) return;
    setLoading(true);
    setFetchError('');
    try {
      const data = await portfolioService.getPortfolioItemById(itemId);
      setInitialData(data);
    } catch (err) {
      console.error(`Error fetching portfolio item ${itemId}:`, err);
      setFetchError(err.response?.data?.message || err.message || '無法載入項目資料。');
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    setError('');
    try {
      await portfolioService.updatePortfolioItem(itemId, formData);
      alert('作品集項目已成功更新！');
      navigate('/admin/portfolio'); // Navigate back to the list page
    } catch (err) {
      console.error(`Error updating portfolio item ${itemId}:`, err);
      setError(err.response?.data?.message || err.message || '更新失敗，請檢查輸入內容。');
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>載入項目資料中...</div>;
  }

  if (fetchError) {
    return (
      <div>
        <nav style={{ marginBottom: '20px' }}>
          <button onClick={() => navigate('/admin/portfolio')} style={{ marginRight: '10px' }}>返回作品集管理</button>
        </nav>
        <p style={{ color: 'red' }}>錯誤: {fetchError}</p>
        <button onClick={fetchItem}>重試</button>
      </div>
    );
  }

  if (!initialData) {
    return (
        <div>
            <nav style={{ marginBottom: '20px' }}>
             <button onClick={() => navigate('/admin/portfolio')} style={{ marginRight: '10px' }}>返回作品集管理</button>
            </nav>
            <p>找不到指定的作品集項目。</p>
        </div>
    );
  }

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/admin/portfolio')} style={{ marginRight: '10px' }}>返回作品集管理</button>
      </nav>
      <h1>編輯作品集項目</h1>
      <AdminPortfolioItemForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        isSaving={isSaving} 
        error={error} 
      />
    </div>
  );
}

export default AdminEditPortfolioItemPage; 