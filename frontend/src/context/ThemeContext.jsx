import React, { createContext, useState, useEffect } from 'react';

// initialize my theme context here to avoid prop-drilling my visual state down to DOM tree
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // explicitly default this state to false because my system architecture dictates Light Mode by default.
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    useEffect(() => {
        const root = window.document.documentElement;

        // mutating the classList and setting CSS variables directly on the document root.
        // This completely eliminates visual flickering or style-flash layout shifts during mount cycles.
        if (isDarkMode) {
            root.classList.add('dark');
            root.style.setProperty('--bg-app', '#0b0f17');
            root.style.setProperty('--bg-card', '#111827');
            root.style.setProperty('--text-main', '#f8fafc');
        } else {
            root.classList.remove('dark');
            root.style.setProperty('--bg-app', '#f4f6fa');
            root.style.setProperty('--bg-card', '#ffffff');
            root.style.setProperty('--text-main', '#0f172a');
        }
    }, [isDarkMode]);

    // encapsulate my state modifiers in an expressive handler to expose a clean API to my consumer components.
    const toggleTheme = () => setIsDarkMode(prev => !prev);

    return(
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};