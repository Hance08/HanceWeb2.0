import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink } from "react-router-dom";
import styles from "./InteractiveMenu.module.css";
import { useMenuColor } from "../../../contexts/MenuColorContext"; // Adjusted path if necessary
import { useAuth } from "../../../contexts/AuthContext"; // Import useAuth

const InteractiveMenu = () => {
  // Removed menuIconColor from props, will get from context
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { menuIconColor, setMenuIconColor, darkSectionRef } = useMenuColor();
  const { isAuthenticated } = useAuth(); // Get authentication status
  const hamburgerButtonRef = useRef(null); // Ref for the hamburger button itself

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLinkClick = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    if (isMenuOpen) document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMenuOpen]);

  // Scroll handler to check for overlap with dark section
  const handleScroll = useCallback(() => {
    if (
      !hamburgerButtonRef.current ||
      !darkSectionRef ||
      !darkSectionRef.current
    ) {
      // If home page is not active or elements are not rendered, default to dark
      // This check might be redundant if darkSectionRef is null when not on Home
      if (menuIconColor !== "dark") setMenuIconColor("dark");
      return;
    }

    const buttonRect = hamburgerButtonRef.current.getBoundingClientRect();
    const darkRect = darkSectionRef.current.getBoundingClientRect();

    // Check for vertical overlap
    const overlaps =
      buttonRect.top < darkRect.bottom && buttonRect.bottom > darkRect.top;

    if (overlaps) {
      if (menuIconColor !== "light") setMenuIconColor("light");
    } else {
      if (menuIconColor !== "dark") setMenuIconColor("dark");
    }
  }, [darkSectionRef, setMenuIconColor, menuIconColor]); // Added menuIconColor to dependencies

  useEffect(() => {
    // Only add scroll listener if darkSectionRef is provided (i.e., on Home page)
    if (darkSectionRef) {
      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // If not on a page with a dark section (e.g., navigating away from Home),
      // ensure the icon is dark.
      if (menuIconColor !== "dark") {
        setMenuIconColor("dark");
      }
    }
  }, [darkSectionRef, handleScroll, menuIconColor, setMenuIconColor]); // Added menuIconColor & setMenuIconColor

  const iconColorClass =
    menuIconColor === "light" ? styles.lightIcon : styles.darkIcon;

  return (
    <>
      <button
        ref={hamburgerButtonRef} // Assign ref to the button
        className={`${styles.hamburgerButton} ${
          isMenuOpen ? styles.isOpen : ""
        } ${iconColorClass}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      <div
        className={`${styles.menuOverlay} ${isMenuOpen ? styles.isOpen : ""}`}
        onClick={toggleMenu}
      ></div>

      <nav
        className={`${styles.menuPanel} ${isMenuOpen ? styles.isOpen : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <ul>
          <li>
            <NavLink
              to="/"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLink} ${styles.activeLink}`
                  : styles.navLink
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLink} ${styles.activeLink}`
                  : styles.navLink
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/portfolio"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLink} ${styles.activeLink}`
                  : styles.navLink
              }
            >
              Portfolio
            </NavLink>
          </li>
          {isAuthenticated && ( // Conditionally render the Admin link
            <li>
              <NavLink
                to="/admin"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.activeLink} ${styles.adminLink}`
                    : `${styles.navLink} ${styles.adminLink}`
                }
              >
                管理後台
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default InteractiveMenu;
