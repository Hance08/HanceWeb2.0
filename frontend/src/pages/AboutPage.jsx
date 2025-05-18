import React, { useState, useEffect } from 'react';
import { aboutService } from '../services/aboutService';
import { Link } from 'react-router-dom';
// Optional: For rendering Markdown content
// import ReactMarkdown from 'react-markdown'; 

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
    return <div>載入中...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>錯誤: {error}</div>;
  }

  if (sections.length === 0) {
    return <div>目前沒有關於我的內容。</div>;
  }

  return (
    <div>
      <nav>
        <Link to="/">回到首頁</Link>
      </nav>
      <h1>關於我</h1>
      {sections.map((section) => (
        <section key={section._id || section.sectionName} style={{ marginBottom: '2em' }}>
          <h2>{section.title || section.sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
          {/* If content is Markdown, use ReactMarkdown or similar */}
          {/* <ReactMarkdown>{section.content}</ReactMarkdown> */}
          {/* For plain text or HTML (ensure it's sanitized if HTML comes from user input) */}
          <div dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }} />
          {/* A safer way for plain text: 
          <p style={{ whiteSpace: 'pre-wrap' }}>{section.content}</p> 
          */}
        </section>
      ))}
    </div>
  );
}

export default AboutPage; 