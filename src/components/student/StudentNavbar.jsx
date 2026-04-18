import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Moon, Sun, User } from 'lucide-react';
import { NotificationContext } from '../../context/NotificationContext';
import { ThemeContext } from '../../context/ThemeContext';

const StudentNavbar = ({ toggleSidebar, user }) => {
    const { unreadCount } = useContext(NotificationContext) || { unreadCount: 0 };
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <header className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border-b border-slate-200 dark:border-[#333] h-16 flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden text-slate-500 dark:text-[#a0aec0] hover:text-indigo-600 dark:text-indigo-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <h1 className="text-lg font-semibold text-slate-800 dark:text-[#e0e0e0] hidden sm:block">Student Dashboard</h1>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="p-2 text-slate-400 dark:text-[#a0aec0] hover:text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-slate-50 dark:hover:bg-[#121212] transition-colors relative"
                    title="Toggle Dark Mode"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="relative">
                    <Link to="/student/notifications" className="p-2 block text-slate-400 hover:text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-slate-50 dark:bg-[#121212] transition-colors relative">
                        <Bell size={20} />
                        {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>}
                    </Link>
                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-[#333]">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 dark:text-[#e0e0e0]">{user?.name || 'Student User'}</p>
                        <p className="text-xs text-slate-500 dark:text-[#a0aec0]">{user?.dept || 'Computer Science'}</p>
                    </div>
                    <Link to="/student/profile" className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 overflow-hidden">
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={18} />
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default StudentNavbar;
