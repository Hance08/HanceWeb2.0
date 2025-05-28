import React, { useState, useEffect, useRef } from "react";
import { aboutService } from "../services/aboutService";
import "./css/Icon.css";
import styles from "./css/About.module.css";
import SidebarNav from "../components/public/about/SidebarNav";
import SectionDisplay from "../components/public/about/SectionDisplay";

function About() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const sectionRefs = useRef({});
  const [flippedSkills, setFlippedSkills] = useState(new Set()); // State for flipped skill cards

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await aboutService.getAllAboutSections();
        setSections(data);
        if (data.length > 0) {
          // Initialize refs for each section
          data.forEach((section) => {
            sectionRefs.current[section.sectionName] = React.createRef();
          });
          // Set the first section as active by default if not already set by scroll
          if (!activeSection) {
            setActiveSection(data[0].sectionName);
          }
        }
      } catch (err) {
        setError(err.message || "無法載入關於我的內容。");
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
      rootMargin: "0px",
      threshold: 0.5, // 50% of the item is visible
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sections]); // Re-run when sections are loaded

  const handleNavLinkClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // setActiveSection(sectionId); // IntersectionObserver will handle this
    }
  };

  // Function to handle skill card click
  const handleSkillCardClick = (skillId) => {
    setFlippedSkills((prevFlippedSkills) => {
      const newFlippedSkills = new Set(prevFlippedSkills);
      if (newFlippedSkills.has(skillId)) {
        newFlippedSkills.delete(skillId);
      } else {
        newFlippedSkills.add(skillId);
      }
      return newFlippedSkills;
    });
  };

  if (loading) {
    return <div className={styles["loading-message"]}>載入中...</div>;
  }

  if (error) {
    return <div className={styles["error-message"]}>錯誤: {error}</div>;
  }

  if (sections.length === 0) {
    return (
      <div className={styles["no-content-message"]}>目前沒有關於我的內容。</div>
    );
  }

  return (
    <div className={styles["about-page-layout"]}>
      <SidebarNav
        sections={sections}
        activeSection={activeSection}
        onLinkClick={handleNavLinkClick}
        styles={styles}
      />

      <div className={styles["main-content"]}>
        {sections.map((section, sectionIndex) => {
          // Added sectionIndex for a potential key if _id is not reliable for skills
          return (
            <SectionDisplay
              key={section._id || section.sectionName || sectionIndex}
              section={section}
              sectionRef={sectionRefs.current[section.sectionName]}
              styles={styles}
              // Pass flipped state and handler only if it's the skills section
              isSkillsSection={section.sectionName === "skills"}
              flippedSkills={
                section.sectionName === "skills" ? flippedSkills : undefined
              }
              onSkillCardClick={
                section.sectionName === "skills"
                  ? handleSkillCardClick
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export default About;
