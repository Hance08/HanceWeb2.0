import React from 'react';

function SkillsEditor({ sectionName, sectionFriendlyName, editState, onInputChange, onSkillChange, onAddSkill, onRemoveSkill, onSubmit, sectionData }) {
  const currentEditState = editState || { title: '', content: [], saving: false, saveError: null };

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
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>技能列表:</label>
          {(currentEditState.content || []).map((skill, index) => (
            <div key={index} style={{ border: '1px solid #e0e0e0', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0 }}>技能 #{index + 1}</h4>
                <button type="button" onClick={() => onRemoveSkill(index)} style={{ color: 'white', backgroundColor: '#dc3545', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>移除此技能</button>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px'}}>
                <div>
                  <label htmlFor={`skill-${index}-name`} style={{display: 'block', fontSize: '0.9em', marginBottom: '3px'}}>名稱:</label>
                  <input
                    type="text"
                    id={`skill-${index}-name`}
                    placeholder="技能名稱 (例如: JavaScript)"
                    value={skill.name || ''}
                    onChange={(e) => onSkillChange(index, 'name', e.target.value)}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label htmlFor={`skill-${index}-level`} style={{display: 'block', fontSize: '0.9em', marginBottom: '3px'}}>程度:</label>
                  <input
                    type="text"
                    id={`skill-${index}-level`}
                    placeholder="技能程度 (例如: 精通)"
                    value={skill.level || ''}
                    onChange={(e) => onSkillChange(index, 'level', e.target.value)}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label htmlFor={`skill-${index}-category`} style={{display: 'block', fontSize: '0.9em', marginBottom: '3px'}}>分類:</label>
                  <input
                    type="text"
                    id={`skill-${index}-category`}
                    placeholder="技能分類 (例如: 前端)"
                    value={skill.category || ''}
                    onChange={(e) => onSkillChange(index, 'category', e.target.value)}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label htmlFor={`skill-${index}-icon`} style={{display: 'block', fontSize: '0.9em', marginBottom: '3px'}}>圖示 (Class/URL):</label>
                  <input
                    type="text"
                    id={`skill-${index}-icon`}
                    placeholder="例如: fab fa-react 或 /icons/react.png"
                    value={skill.icon || ''}
                    onChange={(e) => onSkillChange(index, 'icon', e.target.value)}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <label htmlFor={`skill-${index}-description`} style={{display: 'block', fontSize: '0.9em', marginBottom: '3px'}}>描述:</label>
                  <textarea
                    id={`skill-${index}-description`}
                    placeholder="技能描述"
                    value={skill.description || ''}
                    onChange={(e) => onSkillChange(index, 'description', e.target.value)}
                    rows="3"
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={onAddSkill} style={{ marginTop: '10px', marginBottom: '20px', padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            新增技能項目
          </button>
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

export default SkillsEditor; 