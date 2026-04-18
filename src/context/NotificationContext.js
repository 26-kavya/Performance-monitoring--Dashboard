import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) return;
            
            const res = await axios.get('http://localhost:5000/api/performance/student/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-user-id': localStorage.getItem('userId'),
                    'x-user-role': localStorage.getItem('userRole')
                }
            });
            const data = res.data;
            const loggedInUser = { id: localStorage.getItem('userId') };
            const myNotifications = data.filter(n => n.recipient_id === loggedInUser.id || !n.recipient_id || n.recipient_id === undefined);
            
            // To ensure compatibility if some items are lacking a strict recipient_id structure in mock datasets:
            const filteredData = myNotifications.length === 0 && data.length > 0 ? data : myNotifications;
            
            setNotifications(filteredData);
            setUnreadCount(filteredData.filter(n => !n.is_read).length);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const handleStorageChange = (e) => {
            if (e.key === 'new_notification_timestamp') {
                const targetStudentId = localStorage.getItem('new_notification_for_student');
                const currentUserId = localStorage.getItem('userId');
                if (targetStudentId === currentUserId) {
                    fetchNotifications();
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Setup polling just in case, every 30s
        const intervalId = setInterval(fetchNotifications, 30000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, []);

    const markRead = async (ids) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.patch('http://localhost:5000/api/performance/student/notifications/read', 
                { notificationIds: ids },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-user-id': localStorage.getItem('userId'),
                        'x-user-role': localStorage.getItem('userRole')
                    }
                }
            );

            setNotifications(prev => {
                const refreshed = prev.map(notif => ids.includes(notif._id) ? { ...notif, is_read: true } : notif);
                setUnreadCount(refreshed.filter(n => !n.is_read).length);
                return refreshed;
            });
        } catch (error) {
            console.error("Failed to mark read:", error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, loading, markRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
