import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { AdminFilterProvider } from '../context/AdminFilterContext';

const MainLayout = () => {
    return (
        <AdminFilterProvider>
            <div className="flex bg-slate-50 dark:bg-[#121212] min-h-screen font-sans">
                {/* Left Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 ml-64 transition-all duration-300">
                    <Header />
                    <main className="p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </AdminFilterProvider>
    );
};

export default MainLayout;
