import React, { useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, CheckCircle, FileText, Bell, User, LogOut } from 'lucide-react';

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
    const { settings } = useContext(SettingsContext);
    const navigate = useNavigate();
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
        { icon: GraduationCap, label: 'Marks', path: '/student/marks' },
        { icon: CheckCircle, label: 'Attendance', path: '/student/attendance' },
        { icon: FileText, label: 'Assignments', path: '/student/assignments' },
        { icon: FileText, label: 'Resume', path: '/student/resume' },
        { icon: Bell, label: 'Notifications', path: '/student/notifications' },
        { icon: User, label: 'Profile', path: '/student/profile' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <aside className={`fixed left-0 top-0 z-40 h-screen bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border-r border-slate-200 dark:border-[#333] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}>
            {/* Keeping existing code... */}
            <div className="flex items-center justify-between p-6 h-16 border-b border-slate-100 dark:border-[#333]">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{settings?.institutionName || 'EduTrack'}</span>
                <button onClick={toggleSidebar} className="md:hidden text-slate-500 dark:text-[#a0aec0]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <nav className="p-4 space-y-2">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-[#a0aec0] hover:bg-slate-50 dark:bg-[#121212] hover:text-slate-800 dark:text-[#e0e0e0]'}`}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-[#a0aec0]'} />
                                <span className="font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 dark:border-[#333] flex flex-col gap-2">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 dark:text-[#a0aec0] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default StudentSidebar;
