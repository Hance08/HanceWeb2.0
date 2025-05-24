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

        const contentClasses = ['content'];
        switch (section.sectionName) {
          case 'skills':
            contentClasses.push('skills-content');
            break;
          case 'education':
            contentClasses.push('education-content');
            break;
          case 'experience':
            contentClasses.push('experience-content');
            break;
          case 'contact':
            contentClasses.push('contact-content');
            break;
          default:
            break;
        }

        return (
          <section key={section._id || section.sectionName} className={sectionClasses.join(' ')}>
            <h2 className="section-title">{section.title || section.sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
            {/* Conditional rendering based on section.isMarkdown */}
            {section.isMarkdown ? (
              <ReactMarkdown 
                components={{
                  div: ({node, ...props}) => <div className={contentClasses.join(' ')} {...props} />
                }}
              >
                {section.content || ''}
              </ReactMarkdown>
            ) : (
              <div 
                className={contentClasses.join(' ')} 
                dangerouslySetInnerHTML={{ __html: section.content ? section.content.replace(/\n/g, '<br />') : '' }} 
              />
            )}
            {/* A safer way for plain text: 
            <p style={{ whiteSpace: 'pre-wrap' }}>{section.content}</p> 
            */}
          </section>
        );
      })}
    </div>
  );
}

export default AboutPage; 