import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [globalAttendance, setGlobalAttendance] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            const res = await axios.get('http://localhost:5000/api/performance/student/attendance', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-user-id': localStorage.getItem('userId'),
                    'x-user-role': localStorage.getItem('userRole')
                }
            });
            
            const data = res.data;
            if (data && data.total_classes !== undefined) {
                setAttendanceData(data);
                // Rely seamlessly on the single source of truth mapped straight from the Admin/DB level
                setGlobalAttendance(data.overall !== undefined ? Number(Number(data.overall).toFixed(1)) : 0);
            } else {
                setAttendanceData(null);
                setGlobalAttendance(null);
            }
        } catch (err) {
            console.error("Error fetching global attendance data:", err);
            setAttendanceData(null);
            setGlobalAttendance(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    return (
        <AttendanceContext.Provider value={{
            attendanceData,
            globalAttendance,
            loading,
            refreshAttendance: fetchAttendance
        }}>
            {children}
        </AttendanceContext.Provider>
    );
};
