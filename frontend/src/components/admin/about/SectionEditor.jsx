import React from 'react';

function SectionEditor({ sectionName, sectionFriendlyName, editState, onInputChange, onSubmit, sectionData }) {
  const currentEditState = editState || { title: '', content: '', isMarkdown: false, saving: false, saveError: null };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
      <h2>{sectionFriendlyName || sectionName}</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(sectionName); }}>
        <div>
          <label htmlFor={`title-${sectionName}`} style={{ display: 'block', marginBottom: '5px' }}>標題:</label>
          <input
            type="text"
            id={`title-${sectionName}`}
            value={currentEditState.title || ''}
            onChange={(e) => onInputChange(sectionName, 'title', e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor={`content-${sectionName}`} style={{ display: 'block', marginBottom: '5px' }}>內容:</label>
          <textarea
            id={`content-${sectionName}`}
            value={currentEditState.content || ''}
            onChange={(e) => onInputChange(sectionName, 'content', e.target.value)}
            rows="8"
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor={`markdown-${sectionName}`} style={{ marginRight: '10px' }}>
              使用 Markdown 格式:
            </label>
            <input
              type="checkbox"
              id={`markdown-${sectionName}`}
              checked={currentEditState.isMarkdown || false}
              onChange={(e) => onInputChange(sectionName, 'isMarkdown', e.target.checked)}
            />
          </div>
        </div>
        <button type="submit" disabled={currentEditState.saving || false}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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
}

export default SectionEditor; 