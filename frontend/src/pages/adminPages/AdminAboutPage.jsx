import React, { useState, useEffect, useCallback } from 'react';
import { aboutService } from '../../services/aboutService';
import { Link } from 'react-router-dom';
import SectionEditor from '../../components/admin/about/SectionEditor';
import SkillsEditor from '../../components/admin/about/SkillsEditor';

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
  const [editStates, setEditStates] = useState({});

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
      const initialEditStates = {};
      for (const section of data) {
        if (section.sectionName === 'skills') {
          initialEditStates[section.sectionName] = {
            title: section.title || '',
            content: Array.isArray(section.content) ? section.content : [],
            saving: false,
            saveError: null,
          };
        } else {
          initialEditStates[section.sectionName] = {
            title: section.title || '',
            content: section.content || '',
            isMarkdown: section.isMarkdown || false,
            saving: false,
            saveError: null,
          };
        }
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
        saveError: null,
      }
    }));
  };

  const handleSkillChange = (skillIndex, field, value) => {
    setEditStates(prev => {
      const skillsState = prev.skills || { content: [], title: '' }; // Ensure skills state exists
      const newSkillsContent = skillsState.content ? [...skillsState.content] : [];
      
      if (skillIndex >= newSkillsContent.length || skillIndex < 0) return prev; // Boundary check

      newSkillsContent[skillIndex] = {
        ...(newSkillsContent[skillIndex] || {}), // Ensure skill item object exists
        [field]: value,
      };
      return {
        ...prev,
        skills: {
          ...skillsState, // Preserve other potential fields like title
          content: newSkillsContent,
          saveError: null,
        }
      };
    });
  };

  const addSkill = () => {
    setEditStates(prev => {
      const newSkill = { name: '', level: '', category: '', icon: '', description: '' };
      const skillsState = prev.skills || { content: [], title: '' }; // Ensure skills state exists
      const currentSkillsContent = skillsState.content ? [...skillsState.content] : [];
      return {
        ...prev,
        skills: {
          ...skillsState,
          content: [...currentSkillsContent, newSkill],
          saveError: null,
        }
      };
    });
  };

  const removeSkill = (skillIndex) => {
    setEditStates(prev => {
      const skillsState = prev.skills || { content: [] }; // Ensure skills state exists
      const currentSkillsContent = skillsState.content ? [...skillsState.content] : [];
      if (skillIndex >= currentSkillsContent.length || skillIndex < 0) return prev; // Boundary check

      const newSkillsContent = currentSkillsContent.filter((_, index) => index !== skillIndex);
      return {
        ...prev,
        skills: {
          ...skillsState,
          content: newSkillsContent,
          saveError: null,
        }
      };
    });
  };

  const handleSubmit = async (sectionName) => {
    const sectionDataToSave = editStates[sectionName];
    if (!sectionDataToSave) return;

    // Frontend validation for skill names if section is 'skills'
    if (sectionName === 'skills') {
      const skillsContent = sectionDataToSave.content || [];
      const hasEmptySkillName = skillsContent.some(skill => !skill.name || skill.name.trim() === '');
      if (hasEmptySkillName) {
        setEditStates(prev => ({
          ...prev,
          [sectionName]: {
            ...(prev[sectionName] || {}),
            saving: false, // Stop saving animation
            saveError: '所有技能都必須填寫名稱。請檢查並重試。',
          }
        }));
        return; // Stop submission
      }
    }

    setEditStates(prev => ({ ...prev, [sectionName]: { ...(prev[sectionName] || {}), saving: true, saveError: null } }));

    try {
      let payload;
      if (sectionName === 'skills') {
        payload = {
          title: sectionDataToSave.title,
          content: sectionDataToSave.content, 
        };
      } else {
        payload = {
          title: sectionDataToSave.title,
          content: sectionDataToSave.content,
          isMarkdown: sectionDataToSave.isMarkdown,
        };
      }
      const updatedSection = await aboutService.updateAboutSection(sectionName, payload);
      
      setSections(prev => ({
        ...prev,
        [sectionName]: updatedSection,
      }));

      // Update editStates with the latest data from the server, especially for 'content'
      // to ensure consistency, for example, if the backend modifies the content (e.g. sanitizes it)
      setEditStates(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName], // Keep existing edit state like 'saving', 'saveError'
          title: updatedSection.title,
          content: updatedSection.content, // This is crucial for skills as well
          ...(sectionName !== 'skills' && { isMarkdown: updatedSection.isMarkdown }), // Only for non-skill sections
          saving: false, // Reset saving state
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

  const allPossibleSectionNames = Object.keys(sectionFriendlyNames);
  allPossibleSectionNames.forEach(name => {
    if (!editStates[name]) {
      if (name === 'skills') {
        editStates[name] = { title: '', content: [], saving: false, saveError: null };
      } else {
        editStates[name] = { title: '', content: '', isMarkdown: false, saving: false, saveError: null };
      }
    }
  });

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/admin">返回管理後台</Link>
      </nav>
      <h1>編輯「關於我」內容</h1>
      {allPossibleSectionNames.map((sectionName) => {
        const sectionAPIData = sections[sectionName]; 
        const currentEditState = editStates[sectionName];
        // Fallback for editState if somehow not initialized, though the forEach above should handle it
        const safeEditState = currentEditState || 
                              (sectionName === 'skills' ? 
                               { title: '', content: [], saving: false, saveError: null } : 
                               { title: '', content: '', isMarkdown: false, saving: false, saveError: null });
        
        if (sectionName === 'skills') {
          return (
            <SkillsEditor
              key={sectionName}
              sectionName={sectionName}
              sectionFriendlyName={sectionFriendlyNames[sectionName]}
              editState={safeEditState}
              onInputChange={handleInputChange}
              onSkillChange={handleSkillChange}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
              onSubmit={handleSubmit}
              sectionData={sectionAPIData}
            />
          );
        } else {
          return (
            <SectionEditor
              key={sectionName}
              sectionName={sectionName}
              sectionFriendlyName={sectionFriendlyNames[sectionName]}
              editState={safeEditState}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              sectionData={sectionAPIData}
            />
          );
        }
      })}
    </div>
  );
}

export default AdminAboutPage; 