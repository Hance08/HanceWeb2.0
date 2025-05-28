import React, { createContext, useState, useMemo, useCallback } from "react";

// Create the context
const MenuColorContext = createContext();

// Create a provider component
export function MenuColorProvider({ children }) {
  const [menuIconColor, setMenuIconColor] = useState("dark"); // Default to dark
  const [darkSectionRef, setDarkSectionRefState] = useState(null); // State to hold the ref

  // Callback to set the ref, ensuring stability if passed as a dependency
  const setDarkSectionRef = useCallback((ref) => {
    setDarkSectionRefState(ref);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      menuIconColor,
      setMenuIconColor,
      darkSectionRef, // Provide the ref itself (the object with .current)
      setDarkSectionRef, // Provide the function to set the ref state
    }),
    [menuIconColor, darkSectionRef, setDarkSectionRef]
  );

  return (
    <MenuColorContext.Provider value={value}>
      {children}
    </MenuColorContext.Provider>
  );
}

// Custom hook to use the MenuColorContext
export function useMenuColor() {
  const context = React.useContext(MenuColorContext);
  if (context === undefined) {
    throw new Error("useMenuColor must be used within a MenuColorProvider");
  }
  return context;
}
