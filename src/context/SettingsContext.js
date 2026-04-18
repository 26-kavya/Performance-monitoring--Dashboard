import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        institutionName: 'EduTrack',
        min_attendance: 75,
        autoWarning: false,
        emailWeeklyReport: false
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/settings');
            if (res.data) {
                setSettings(res.data);
            }
        } catch (error) {
            console.error("Failed to load global settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, setSettings, refreshSettings: fetchSettings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};
