import React, { useState, useEffect, useCallback } from 'react';
import { aboutService } from '../../services/aboutService';
import { Link } from 'react-router-dom';

const sectionFriendlyNames = {
  introduction: '簡介',
  skills: '技能',
  education: '學歷',
  experience: '經歷',
  contact: '聯絡方式',
};

function AdminAboutPage() {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editStates, setEditStates] = useState({}); // To store title/content for each section being edited

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutService.getAllAboutSections();
      const sectionsMap = data.reduce((acc, section) => {
        acc[section.sectionName] = section;
        return acc;
      }, {});
      setSections(sectionsMap);
      // Initialize editStates with fetched data
      const initialEditStates = {};
      for (const section of data) {
        initialEditStates[section.sectionName] = {
          title: section.title || '',
          content: section.content || '',
          isMarkdown: section.isMarkdown || false,
          saving: false,
          saveError: null,
        };
      }
      setEditStates(initialEditStates);
    } catch (err) {
      setError(err.message || '無法載入關於我內容。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleInputChange = (sectionName, field, value) => {
    setEditStates(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [field]: value,
        saveError: null, // Clear previous error on input change
      }
    }));
  };

  const handleSubmit = async (sectionName) => {
    const sectionData = editStates[sectionName];
    if (!sectionData) return;

    setEditStates(prev => ({ ...prev, [sectionName]: { ...prev[sectionName], saving: true, saveError: null } }));

    try {
      const payload = {
        title: sectionData.title,
        content: sectionData.content,
        isMarkdown: sectionData.isMarkdown,
      };
      const updatedSection = await aboutService.updateAboutSection(sectionName, payload);
      
      // Update local state with the response from the server
      setSections(prev => ({
        ...prev,
        [sectionName]: updatedSection,
      }));
      // Also update editStates to reflect saved data, especially if server modifies it (e.g., trims whitespace)
      setEditStates(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          title: updatedSection.title,
          content: updatedSection.content,
          isMarkdown: updatedSection.isMarkdown,
          saving: false,
        }
      }));
      alert(`「${sectionFriendlyNames[sectionName] || sectionName}」區塊已更新！`);
    } catch (err) {
      console.error(`Error updating section ${sectionName}:`, err);
      setEditStates(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          saving: false,
          saveError: err.response?.data?.message || err.message || '儲存失敗',
        }
      }));
    }
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>錯誤: {error} <button onClick={fetchSections}>重試</button></div>;
  }

  // Ensure all expected sections have an entry in editStates for form rendering
  const allPossibleSectionNames = Object.keys(sectionFriendlyNames);
  for (const name of allPossibleSectionNames) {
    if (!editStates[name]) {
      editStates[name] = { title: '', content: '', isMarkdown: false, saving: false, saveError: null };
    }
  }


  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/admin">返回管理後台</Link>
      </nav>
      <h1>編輯「關於我」內容</h1>
      {allPossibleSectionNames.map((sectionName) => {
        const sectionData = sections[sectionName]; // Original data from server
        const currentEditState = editStates[sectionName] || { title: '', content: '', isMarkdown: false, saving: false, saveError: null };

        return (
          <div key={sectionName} style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
            <h2>{sectionFriendlyNames[sectionName] || sectionName}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(sectionName); }}>
              <div>
                <label htmlFor={`title-${sectionName}`} style={{ display: 'block', marginBottom: '5px' }}>標題:</label>
                <input
                  type="text"
                  id={`title-${sectionName}`}
                  value={currentEditState.title}
                  onChange={(e) => handleInputChange(sectionName, 'title', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor={`content-${sectionName}`} style={{ display: 'block', marginBottom: '5px' }}>內容:</label>
                <textarea
                  id={`content-${sectionName}`}
                  value={currentEditState.content}
                  onChange={(e) => handleInputChange(sectionName, 'content', e.target.value)}
                  rows="8"
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor={`markdown-${sectionName}`} style={{ marginRight: '10px' }}>
                  使用 Markdown 格式:
                </label>
                <input
                  type="checkbox"
                  id={`markdown-${sectionName}`}
                  checked={currentEditState.isMarkdown || false}
                  onChange={(e) => handleInputChange(sectionName, 'isMarkdown', e.target.checked)}
                />
              </div>
              <button type="submit" disabled={currentEditState.saving}>
                {currentEditState.saving ? '儲存中...' : '儲存變更'}
              </button>
              {currentEditState.saveError && (
                <p style={{ color: 'red', marginTop: '10px' }}>儲存失敗: {currentEditState.saveError}</p>
              )}
              {sectionData && sectionData.updatedAt && (
                 <p style={{fontSize: '0.8em', color: '#555'}}>上次更新時間: {new Date(sectionData.updatedAt).toLocaleString()}</p>
              )}
            </form>
          </div>
        );
      })}
    </div>
  );
}

export default AdminAboutPage; 