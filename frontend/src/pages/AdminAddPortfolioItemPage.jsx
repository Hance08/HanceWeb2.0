import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import AdminPortfolioItemForm from '../components/AdminPortfolioItemForm';

function AdminAddPortfolioItemPage() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Use useMemo to ensure a stable reference for initialData in "add" mode
  const stableInitialData = useMemo(() => ({ 
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    repositoryUrl: '',
    tags: '',
    projectDate: '',
  }), []);

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    setError('');
    try {
      await portfolioService.createPortfolioItem(formData);
      alert('作品集項目已成功新增！');
      navigate('/admin/portfolio'); // Navigate back to the list page
    } catch (err) {
      console.error('Error creating portfolio item:', err);
      setError(err.response?.data?.message || err.message || '新增失敗，請檢查輸入內容。');
    } finally {
      setIsSaving(false); // Ensure isSaving is reset in all cases
    }
  };

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/admin/portfolio')} style={{ marginRight: '10px' }}>返回作品集管理</button>
      </nav>
      <h1>新增作品集項目</h1>
      <AdminPortfolioItemForm 
        initialData={stableInitialData} // Pass the stable initial data reference
        onSubmit={handleSubmit} 
        isSaving={isSaving} 
        error={error} 
      />
    </div>
  );
}

export default AdminAddPortfolioItemPage; 