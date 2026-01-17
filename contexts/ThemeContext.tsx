import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    setTheme: (theme: Theme) => void;
    colors: {
        background: string;
        surface: string;
        card: string;
        text: string;
        textSecondary: string;
        border: string;
        primary: string;
        error: string;
        success: string;
    };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors = {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    primary: '#3B82F6',
    error: '#EF4444',
    success: '#10B981',
};

const darkColors = {
    background: '#111827',
    surface: '#1F2937',
    card: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#4B5563',
    primary: '#60A5FA',
    error: '#F87171',
    success: '#34D399',
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');
    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        loadTheme();
    }, []);

    useEffect(() => {
        if (theme === 'system') {
            setIsDark(systemColorScheme === 'dark');
        } else {
            setIsDark(theme === 'dark');
        }
    }, [theme, systemColorScheme]);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('app_theme');
            if (savedTheme) {
                setThemeState(savedTheme as Theme);
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const setTheme = async (newTheme: Theme) => {
        try {
            await AsyncStorage.setItem('app_theme', newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const colors = isDark ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, isDark, setTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
