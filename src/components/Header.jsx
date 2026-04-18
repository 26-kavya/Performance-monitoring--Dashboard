import React, { useState, useEffect, useContext } from 'react';
import { Bell, Search, Mail, User, Phone, Lock, X, Save, Eye, EyeOff, Filter, Moon, Sun, Settings } from 'lucide-react';
import axios from 'axios';
import SmartAlertsPopup from './SmartAlertsPopup';
import { AdminFilterContext } from '../context/AdminFilterContext';
import { ThemeContext } from '../context/ThemeContext';

const Header = () => {
    const [isAlertsOpen, setIsAlertsOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        name: localStorage.getItem('userName') || 'Loading...',
        studentId: localStorage.getItem('userId') ? `#ID-${localStorage.getItem('userId').slice(-6).toUpperCase()}` : '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const [formData, setFormData] = useState({ ...profileData });
    const [showPassword, setShowPassword] = useState(false);
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    const filterContext = useContext(AdminFilterContext);
    const departmentFilter = filterContext?.departmentFilter;
    const setDepartmentFilter = filterContext?.setDepartmentFilter;
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('userToken');
            const role = localStorage.getItem('userRole');
            const userId = localStorage.getItem('userId');

            try {
                if (role === 'student') {
                    // In a real app authMiddleware would parse the token, but we are mocking it for the demo
                    const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/performance/student/dashboard`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data) {
                        setProfileData(prev => ({
                            ...prev,
                            name: res.data.name || prev.name,
                            email: res.data.email || '',
                            phoneNumber: res.data.phoneNumber || ''
                        }));
                        setFormData(prev => ({
                            ...prev,
                            name: res.data.name || prev.name,
                            email: res.data.email || '',
                            phoneNumber: res.data.phoneNumber || '',
                            password: ''
                        }));
                    }
                } else if (role === 'admin' || role === 'instructor') {
                    // Fetch from users table to get details
                    const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users`);
                    const adminUser = res.data.find(u => u._id === userId);
                    if (adminUser) {
                        setProfileData(prev => ({
                            ...prev,
                            name: adminUser.name || prev.name,
                            email: adminUser.email || '',
                            phoneNumber: adminUser.phoneNumber || '' // Assuming we add this later if needed
                        }));
                        setFormData(prev => ({
                            ...prev,
                            name: adminUser.name || prev.name,
                            email: adminUser.email || '',
                            phoneNumber: adminUser.phoneNumber || '',
                            password: ''
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileClick = () => {
        setFormData({ ...profileData, password: '' });
        setIsProfileModalOpen(true);
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        try {
            const updatePayload = {};
            if (formData.password) {
                updatePayload.password = formData.password;
            }
            if (isAdmin) {
                if (formData.name !== profileData.name) updatePayload.name = formData.name;
                if (formData.email !== profileData.email) updatePayload.email = formData.email;
                if (formData.phoneNumber !== profileData.phoneNumber) updatePayload.phoneNumber = formData.phoneNumber;
            }

            const token = localStorage.getItem('userToken');
            const userId = localStorage.getItem('userId');
            const userRole = localStorage.getItem('userRole');

            if (Object.keys(updatePayload).length > 0) {
                if (isAdmin) {
                    await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${userId}`, updatePayload, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'x-user-id': userId,
                            'x-user-role': userRole
                        }
                    });
                } else {
                    await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/performance/student/profile`, updatePayload, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'x-user-id': userId,
                            'x-user-role': userRole
                        }
                    });
                }
            }

            setProfileData({ ...formData, password: '' });
            setIsProfileModalOpen(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Failed to update profile.");
        }
    };

    return (
        <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border-b border-slate-200 dark:border-[#333] px-8 py-5 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">
                    {isAdmin ? 'Admin Dashboard' : localStorage.getItem('userRole') === 'instructor' ? 'Instructor Dashboard' : 'Dashboard'}
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {isAdmin && (
                    <div className="relative group hidden sm:flex items-center bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#333] rounded-lg ml-2 transition-all hover:border-indigo-300">
                        <Filter className="absolute left-3 text-slate-400 group-hover:text-indigo-500 transition-colors" size={16} />
                        <select
                            value={departmentFilter || 'All'}
                            onChange={(e) => setDepartmentFilter && setDepartmentFilter(e.target.value)}
                            className="appearance-none pl-9 pr-8 py-2 bg-transparent text-sm font-medium text-slate-700 dark:text-[#e0e0e0] focus:outline-none cursor-pointer"
                        >
                            <option value="All">All Departments</option>
                            <option value="CSE">Computer Science (CSE)</option>
                            <option value="EEE">Electrical (EEE)</option>
                            <option value="MECH">Mechanical (MECH)</option>
                        </select>
                    </div>
                )}

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#333] rounded-full text-sm focus:outline-none focus:border-indigo-500 w-64"
                    />
                </div>

                <div className="flex items-center gap-4 border-r border-slate-200 dark:border-[#333] pr-6 relative">
                    <button
                        onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                        className={`relative transition-colors ${isAlertsOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-[#a0aec0] hover:text-indigo-600 dark:text-indigo-400'}`}
                    >
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {isAlertsOpen && <SmartAlertsPopup onClose={() => setIsAlertsOpen(false)} />}

                    <button className="text-slate-500 dark:text-[#a0aec0] hover:text-indigo-600 dark:text-indigo-400 transition-colors">
                        <Mail size={20} />
                    </button>
                    <button className="p-2 text-slate-400 dark:text-[#a0aec0] hover:text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-slate-50 dark:hover:bg-[#121212] transition-colors">
                        <Settings size={20} />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-400 dark:text-[#a0aec0] hover:text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-slate-50 dark:hover:bg-[#121212] transition-colors"
                        title="Toggle Dark Mode"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <div
                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:bg-[#121212] p-2 rounded-lg transition-colors"
                    onClick={handleProfileClick}
                >
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-700 dark:text-[#e0e0e0]">{profileData.name}</p>
                        <p className="text-xs text-slate-500 dark:text-[#a0aec0]">ID: {profileData.studentId}</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200">
                        {profileData.name.charAt(0)}
                    </div>
                </div>
            </div>

            {/* Profile Edit Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-[#e0e0e0]">Edit Profile</h2>
                            <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-[#a0aec0]">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleProfileSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1 flex items-center gap-2">
                                    <User size={16} className="text-slate-400" /> Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => isAdmin && setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none ${isAdmin ? 'focus:ring-2 focus:ring-indigo-500' : 'bg-slate-50 dark:bg-[#121212] text-slate-500 dark:text-[#a0aec0] cursor-not-allowed'}`}
                                    readOnly={!isAdmin}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1 flex items-center gap-2">
                                    <Mail size={16} className="text-slate-400" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => isAdmin && setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none ${isAdmin ? 'focus:ring-2 focus:ring-indigo-500' : 'bg-slate-50 dark:bg-[#121212] text-slate-500 dark:text-[#a0aec0] cursor-not-allowed'}`}
                                    readOnly={!isAdmin}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1 flex items-center gap-2">
                                    <Phone size={16} className="text-slate-400" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => isAdmin && setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none ${isAdmin ? 'focus:ring-2 focus:ring-indigo-500' : 'bg-slate-50 dark:bg-[#121212] text-slate-500 dark:text-[#a0aec0] cursor-not-allowed'}`}
                                    readOnly={!isAdmin}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1 flex items-center gap-2">
                                    <Lock size={16} className="text-slate-400" /> New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Leave blank to keep current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-[#a0aec0] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-[#333]">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 dark:text-[#a0aec0] hover:bg-slate-100 dark:bg-[#2a2a2a] rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
