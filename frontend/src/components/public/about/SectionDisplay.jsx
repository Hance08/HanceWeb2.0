import React from "react";
import ReactMarkdown from "react-markdown";

function SectionDisplay({
  section,
  sectionRef,
  styles,
  isSkillsSection,
  flippedSkills,
  onSkillCardClick,
}) {
  const sectionClasses = [styles["section-card"]];
  const contentContainerClasses = [styles.content];

  if (section.sectionName === "skills") {
    contentContainerClasses.push(styles["skills-content"]);
  } else if (section.sectionName === "introduction") {
    contentContainerClasses.push(styles["introduction-content"]);
  } else if (section.sectionName === "education") {
    contentContainerClasses.push(styles["education-content"]);
  } else if (section.sectionName === "experience") {
    contentContainerClasses.push(styles["experience-content"]);
  } else if (section.sectionName === "contact") {
    contentContainerClasses.push(styles["contact-content"]);
  }

  let contentElement;

  if (
    isSkillsSection &&
    Array.isArray(section.content) &&
    section.content.length > 0
  ) {
    contentElement = (
      <div className={contentContainerClasses.join(" ")}>
        {section.content.map((skill, index) => {
          const skillId = skill.name || `skill-${index}`;
          const isFlipped = flippedSkills && flippedSkills.has(skillId);
          const cardClasses = [
            styles["skill-item-card"],
            isFlipped ? styles["is-flipped"] : "",
          ].join(" ");

          return (
            <div
              key={skillId}
              className={cardClasses}
              onClick={() => onSkillCardClick && onSkillCardClick(skillId)}
            >
              <div className={styles["skill-card-front"]}>
                {skill.icon && (
                  <i className={`${skill.icon} ${styles["skill-icon"]}`}></i>
                )}
                <h4 className={styles["skill-name"]}>{skill.name}</h4>
              </div>
              <div className={styles["skill-card-back"]}>
                {skill.level && (
                  <p className={styles["skill-level"]}>程度: {skill.level}</p>
                )}
                {skill.description && (
                  <p className={styles["skill-description"]}>
                    {skill.description}
                  </p>
                )}
                {!skill.level && !skill.description && <p>更多資訊...</p>}
              </div>
            </div>
          );
        })}
      </div>
    );
  } else if (section.sectionName === "skills") {
    contentElement = (
      <div className={contentContainerClasses.join(" ")}>
        <p>尚未新增技能。</p>
      </div>
    );
  } else {
    if (section.isMarkdown) {
      contentElement = (
        <div className={contentContainerClasses.join(" ")}>
          <ReactMarkdown>{section.content || ""}</ReactMarkdown>
        </div>
      );
    } else {
      contentElement = (
        <div
          className={contentContainerClasses.join(" ")}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {section.content || ""}
        </div>
      );
    }
  }

  return (
    <section
      id={section.sectionName}
      ref={sectionRef}
      className={sectionClasses.join(" ")}
    >
      <h2 className={styles["section-title"]}>
        {section.title ||
          section.sectionName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
      </h2>
      {contentElement}
    </section>
  );
}

export default SectionDisplay;
