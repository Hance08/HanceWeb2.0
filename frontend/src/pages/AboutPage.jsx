import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { aboutService } from '../services/aboutService';
import './css/AboutPage.css'; // Import the CSS file

function AboutPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await aboutService.getAllAboutSections();
        // Optional: sort sections if your backend doesn't or if you have an 'order' field
        // data.sort((a, b) => (a.order || 0) - (b.order || 0)); 
        setSections(data);
      } catch (err) {
        setError(err.message || '無法載入關於我的內容。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) {
    return <div className="loading-message">載入中...</div>;
  }

  if (error) {
    return <div className="error-message">錯誤: {error}</div>;
  }

  if (sections.length === 0) {
    return <div className="no-content-message">目前沒有關於我的內容。</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">關於我</h1>
      {sections.map((section) => {
        const sectionClasses = ['section-card'];
        const contentContainerClasses = ['content']; // Renamed for clarity

        if (section.sectionName === 'skills') {
          contentContainerClasses.push('skills-content');
        } else if (section.sectionName === 'education') {
          contentContainerClasses.push('education-content');
        } else if (section.sectionName === 'experience') {
          contentContainerClasses.push('experience-content');
        } else if (section.sectionName === 'contact') {
          contentContainerClasses.push('contact-content');
        }

        let contentElement;

        if (section.sectionName === 'skills') {
          if (Array.isArray(section.content) && section.content.length > 0) {
            contentElement = (
              <div className={contentContainerClasses.join(' ')}>
                {section.content.map((skill, index) => (
                  <div key={skill.name || index} className="skill-item-card">
                    {skill.icon && <i className={`${skill.icon} skill-icon`}></i>}
                    <h4 className="skill-name">{skill.name}</h4>
                    {skill.level && <p className="skill-level">程度: {skill.level}</p>}
                    {/* {skill.category && <p className="skill-category">分類: {skill.category}</p>} */}
                    {skill.description && <p className="skill-description">{skill.description}</p>}
                  </div>
                ))}
              </div>
            );
          } else {
            contentElement = <div className={contentContainerClasses.join(' ')}><p>尚未新增技能。</p></div>;
          }
        } else {
          // For other sections (introduction, education, experience, contact)
          if (section.isMarkdown) {
            contentElement = (
              <div className={contentContainerClasses.join(' ')}>
                <ReactMarkdown>
                  {section.content || ''}
                </ReactMarkdown>
              </div>
            );
          } else {
            contentElement = (
              <div className={contentContainerClasses.join(' ')} style={{ whiteSpace: 'pre-wrap' }}>
                {section.content || ''}
              </div>
            );
          }
        }

        return (
          <section key={section._id || section.sectionName} className={sectionClasses.join(' ')}>
            <h2 className="section-title">{section.title || section.sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
            {contentElement}
          </section>
        );
      })}
    </div>
  );
}

export default AboutPage; 