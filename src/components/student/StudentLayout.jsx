import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import StudentNavbar from './StudentNavbar';
import { AttendanceProvider } from '../../context/AttendanceContext';
import { NotificationProvider } from '../../context/NotificationContext';

const StudentLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // User payload for navbar display based on login data
    const user = {
        name: localStorage.getItem('userName') || 'Student',
        email: localStorage.getItem('userEmail') || '',
        dept: 'Computer Science',
        profilePic: null
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <AttendanceProvider>
            <NotificationProvider>
                <div className="min-h-screen bg-slate-50 dark:bg-[#121212] font-sans flex text-slate-900 dark:text-[#e0e0e0]">
                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

                {/* Main Content Wrapper */}
                <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                    <StudentNavbar toggleSidebar={toggleSidebar} user={user} />

                    <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
                </div>
            </NotificationProvider>
        </AttendanceProvider>
    );
};

export default StudentLayout;
