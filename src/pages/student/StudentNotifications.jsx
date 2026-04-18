import React, { useContext } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { NotificationContext } from '../../context/NotificationContext';

const StudentNotifications = () => {
    const { notifications, loading, markRead } = useContext(NotificationContext);

    const markAllRead = () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n._id);
        if (unreadIds.length > 0) {
            markRead(unreadIds);
        }
    };


    const markSingleRead = (id, currentReadState) => {
        if (!currentReadState) {
            markRead([id]);
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'Just now';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500 dark:text-[#a0aec0] animate-pulse">Loading notifications...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">Notifications</h2>
                    <p className="text-slate-500 dark:text-[#a0aec0]">Stay updated with latest announcements.</p>
                </div>
                <button
                    onClick={markAllRead}
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 hover:bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg transition-colors"
                >
                    Mark all as read
                </button>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-[#333]">
                    {notifications.map((notif) => (
                        <div
                            key={notif._id || notif.id}
                            onClick={() => markSingleRead(notif._id, notif.is_read)}
                            className={`p-6 flex gap-4 transition-colors cursor-pointer ${notif.is_read ? 'bg-white dark:bg-[#1e1e1e] dark:border-[#333333]' : 'bg-indigo-50/40'}`}
                        >
                            <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notif.type === 'warning' ? 'bg-red-100 text-red-600' :
                                    notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {notif.type === 'warning' && <AlertTriangle size={20} />}
                                {notif.type === 'success' && <CheckCircle size={20} />}
                                {notif.type === 'info' && <Info size={20} />}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-bold text-slate-800 dark:text-[#e0e0e0] ${!notif.is_read && 'text-indigo-900'}`}>{notif.title}</h3>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{formatTime(notif.createdAt)}</span>
                                </div>
                                <p className="text-slate-600 dark:text-[#a0aec0] text-sm mt-1">{notif.message}</p>
                            </div>

                            {!notif.is_read && (
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {notifications.length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No new notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentNotifications;
