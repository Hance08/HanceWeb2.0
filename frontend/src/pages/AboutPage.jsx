import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { aboutService } from '../services/aboutService';
import './css/AboutPage.css'; // Import the CSS file

function AboutPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await aboutService.getAllAboutSections();
        setSections(data);
        if (data.length > 0) {
          // Initialize refs for each section
          data.forEach(section => {
            sectionRefs.current[section.sectionName] = React.createRef();
          });
          // Set the first section as active by default if not already set by scroll
          if (!activeSection) {
            setActiveSection(data[0].sectionName);
          }
        }
      } catch (err) {
        setError(err.message || '無法載入關於我的內容。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []); // Removed activeSection from dependencies to prevent re-fetch on scroll

  useEffect(() => {
    const observerOptions = {
      root: null, // observing for viewport
      rootMargin: '0px',
      threshold: 0.5, // 50% of the item is visible
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs.current).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sections]); // Re-run when sections are loaded

  const handleNavLinkClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // setActiveSection(sectionId); // IntersectionObserver will handle this
    }
  };

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
    <div className="about-page-layout"> {/* New overall layout container */}
      <nav className="sidebar-nav">
        <ul>
          {sections.map((section) => (
            <li key={section.sectionName} className={activeSection === section.sectionName ? 'active' : ''}>
              <a onClick={() => handleNavLinkClick(section.sectionName)}>
                {section.title || section.sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="main-content"> {/* Container for the sections */}
        {sections.map((section) => {
          const sectionClasses = ['section-card'];
          const contentContainerClasses = ['content']; 

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
            // Assign ref and id to the section element
            <section 
              key={section._id || section.sectionName} 
              id={section.sectionName} // Use sectionName as ID for navigation
              ref={sectionRefs.current[section.sectionName]} // Assign ref for IntersectionObserver
              className={sectionClasses.join(' ')}
            >
              <h2 className="section-title">{section.title || section.sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
              {contentElement}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default AboutPage; 