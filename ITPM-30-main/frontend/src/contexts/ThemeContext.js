import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Get theme from localStorage or default to 'light'
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    useEffect(() => {
        // Apply theme class to document body
        document.body.className = `theme-${theme}`;
        
        // Save theme to localStorage
        localStorage.setItem('theme', theme);
        
        // Update CSS custom properties for theme
        const root = document.documentElement;
        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', '#1a1a1a');
            root.style.setProperty('--bg-secondary', '#2d2d2d');
            root.style.setProperty('--bg-tertiary', '#3d3d3d');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b3b3b3');
            root.style.setProperty('--text-muted', '#808080');
            root.style.setProperty('--border-color', '#404040');
            root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.3)');
            root.style.setProperty('--accent-color', '#4f9eff');
            root.style.setProperty('--success-color', '#5cb85c');
            root.style.setProperty('--warning-color', '#f0ad4e');
            root.style.setProperty('--danger-color', '#d9534f');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8f9fa');
            root.style.setProperty('--bg-tertiary', '#e9ecef');
            root.style.setProperty('--text-primary', '#212529');
            root.style.setProperty('--text-secondary', '#6c757d');
            root.style.setProperty('--text-muted', '#adb5bd');
            root.style.setProperty('--border-color', '#dee2e6');
            root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
            root.style.setProperty('--accent-color', '#007bff');
            root.style.setProperty('--success-color', '#28a745');
            root.style.setProperty('--warning-color', '#ffc107');
            root.style.setProperty('--danger-color', '#dc3545');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const value = {
        theme,
        toggleTheme,
        isDark: theme === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
