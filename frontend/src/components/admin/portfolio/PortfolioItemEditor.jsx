import React, { useState, useEffect } from 'react';

// Basic styling (can be moved to a CSS file or a style object)
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '600px',
  margin: '0 auto',
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
};

const inputStyle = {
  marginBottom: '15px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1em',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '100px',
  resize: 'vertical',
};

const buttonStyle = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1em',
  marginTop: '10px',
};

function PortfolioItemEditor({ initialData, onSubmit, isSaving, error }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    repositoryUrl: '',
    tags: '', // Comma-separated string for tags
    projectDate: '', // YYYY-MM-DD format
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      let isoDate = '';
      if (initialData.projectDate) {
        const date = new Date(initialData.projectDate);
        if (!isNaN(date.getTime())) {
          isoDate = date.toISOString().split('T')[0];
        }
      }
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        projectUrl: initialData.projectUrl || '',
        repositoryUrl: initialData.repositoryUrl || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
        projectDate: isoDate,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        projectUrl: '',
        repositoryUrl: '',
        tags: '',
        projectDate: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      return newState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      projectDate: formData.projectDate || null,
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div>
        <label htmlFor="title" style={labelStyle}>標題:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>
      <div>
        <label htmlFor="description" style={labelStyle}>描述:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>
      <div>
        <label htmlFor="imageUrl" style={labelStyle}>圖片 URL:</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="projectUrl" style={labelStyle}>專案 URL:</label>
        <input
          type="url"
          id="projectUrl"
          name="projectUrl"
          value={formData.projectUrl}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="repositoryUrl" style={labelStyle}>原始碼庫 URL:</label>
        <input
          type="url"
          id="repositoryUrl"
          name="repositoryUrl"
          value={formData.repositoryUrl}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="tags" style={labelStyle}>標籤 (以逗號分隔):</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          style={inputStyle}
          placeholder="例如: React, Node.js, MongoDB"
        />
      </div>
      <div>
        <label htmlFor="projectDate" style={labelStyle}>專案日期:</label>
        <input
          type="date"
          id="projectDate"
          name="projectDate"
          value={formData.projectDate}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <button type="submit" disabled={isSaving} style={buttonStyle}>
        {isSaving ? '儲存中...' : '儲存'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>錯誤: {error}</p>}
    </form>
  );
}

export default PortfolioItemEditor; 