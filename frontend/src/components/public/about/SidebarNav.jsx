import React from "react";

function SidebarNav({ sections, activeSection, onLinkClick, styles }) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <nav className={styles["sidebar-nav"]}>
      <ul>
        {sections.map((section) => (
          <li
            key={section.sectionName}
            className={
              activeSection === section.sectionName ? styles.active : ""
            }
          >
            <a
              href={`#${section.sectionName}`}
              onClick={(e) => {
                e.preventDefault();
                onLinkClick(section.sectionName);
              }}
            >
              {section.title ||
                section.sectionName
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SidebarNav;
