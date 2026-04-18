import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SettingsContext } from '../context/SettingsContext';
import {
    Users, BookOpen, Settings, Activity, Search, Plus,
    Trash2, Edit2, Shield, Save, AlertTriangle, X, ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle
} from 'lucide-react';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('users');

    // Users State
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users`);
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const [semesters] = useState([
        {
            id: 1, name: 'Semester 1', year: '2025-26',
            subjects: [
                { id: 101, name: 'Mathematics I', code: 'MAT101', credits: 4, instructor: 'Dr. Kani' },
                { id: 102, name: 'Physics', code: 'PHY101', credits: 3, instructor: 'Dr. Sathya' }
            ]
        },
        {
            id: 2, name: 'Semester 2', year: '2025-26',
            subjects: []
        }
    ]);

    // UI States
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [expandedSemester, setExpandedSemester] = useState(1);
    const [searchUserTerm, setSearchUserTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '', role: 'Instructor', status: 'Active' });
    const [showUserPassword, setShowUserPassword] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Global Settings State
    const { settings, refreshSettings } = useContext(SettingsContext);
    const [systemSettings, setSystemSettings] = useState({
        institutionName: 'Tech University',
        min_attendance: 75,
        autoWarning: false,
        emailWeeklyReport: false
    });

    useEffect(() => {
        if (settings) {
            setSystemSettings({
                institutionName: settings.institutionName || 'Tech University',
                min_attendance: settings.min_attendance || 75,
                autoWarning: settings.autoWarning || false,
                emailWeeklyReport: settings.emailWeeklyReport || false
            });
        }
    }, [settings]);

    const handleSaveSystemSettings = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/settings`, systemSettings);
            refreshSettings();
            setToastMessage("Saved Successfully");
            setTimeout(() => setToastMessage(''), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            setToastMessage("Failed to save settings");
            setTimeout(() => setToastMessage(''), 3000);
        }
    };
    const handleOpenAddUser = () => {
        setEditingUser(null);
        setUserFormData({ name: '', email: '', password: '', role: 'Instructor', status: 'Active' });
        setIsUserModalOpen(true);
    };

    const handleOpenEditUser = (user) => {
        setEditingUser(user);
        setUserFormData({ name: user.name, email: user.email, password: '', role: user.role, status: user.status });
        setIsUserModalOpen(true);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to remove this user?')) {
            try {
                if (typeof id === 'number') {
                    // Fallback for mocked static data without DB _id
                    setUsers(users.filter(u => u.id !== id && u._id !== id));
                    return;
                }
                await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${id}`);
                setUsers(users.filter(u => u._id !== id && u.id !== id));
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user");
            }
        }
    };

    const handleSaveUser = async () => {
        if (!userFormData.name || !userFormData.email) {
            alert('Name and email are required');
            return;
        }

        const payload = { ...userFormData };
        if (editingUser && !payload.password) {
            delete payload.password; // Do not overwrite password with empty string when editing
        } else if (!editingUser && !payload.password) {
            alert('Password is required for new users');
            return;
        }

        try {
            if (editingUser && editingUser._id) {
                const res = await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${editingUser._id}`, payload);
                setUsers(users.map(u => u._id === editingUser._id ? res.data : u));
            } else if (editingUser && editingUser.id) {
                // Fallback for editing mocked static data
                setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...payload } : u));
            } else {
                const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users`, payload);
                setUsers([...users, res.data]);
            }
            setIsUserModalOpen(false);
        } catch (error) {
            console.error("Error saving user:", error);
            alert(error.response?.data?.message || "Failed to save user");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchUserTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchUserTerm.toLowerCase())
    );

    // Render Components
    const UserManagement = () => (
        <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-slate-100 dark:border-[#333] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0]">User Management</h3>
                    <p className="text-sm text-slate-500 dark:text-[#a0aec0]">Manage monitoring system access</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchUserTerm}
                            onChange={(e) => setSearchUserTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                    </div>
                    <button
                        onClick={handleOpenAddUser}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={16} />
                        Add User
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-[#121212] text-slate-500 dark:text-[#a0aec0] font-semibold border-b border-slate-100 dark:border-[#333]">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#333]">
                        {filteredUsers.length > 0 ? filteredUsers.map(user => (
                            <tr key={user._id || user.id} className="hover:bg-slate-50 dark:bg-[#121212] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#2a2a2a] flex items-center justify-center text-slate-500 dark:text-[#a0aec0] font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-[#e0e0e0]">{user.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-[#a0aec0]">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'Instructor' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 dark:bg-[#2a2a2a] text-slate-700 dark:text-[#e0e0e0]'
                                        }`}>
                                        {user.role === 'Admin' && <Shield size={10} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-slate-400">
                                        <button onClick={() => handleOpenEditUser(user)} className="hover:text-indigo-600 dark:text-indigo-400 p-1"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDeleteUser(user._id || user.id)} className="hover:text-red-600 p-1"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-[#a0aec0]">
                                    No users found matching "{searchUserTerm}".
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const AcademicControl = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0]">Academic Structure</h3>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1e1e1e] dark:border-[#333333] text-slate-700 dark:text-[#e0e0e0] rounded-lg text-sm font-medium hover:bg-slate-50 dark:bg-[#121212]">
                    <Plus size={16} />
                    New Semester
                </button>
            </div>

            <div className="space-y-4">
                {semesters.map(sem => (
                    <div key={sem.id} className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm overflow-hidden">
                        <div
                            className="p-4 bg-slate-50 dark:bg-[#121212] flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:bg-[#2a2a2a] transition-colors"
                            onClick={() => setExpandedSemester(expandedSemester === sem.id ? null : sem.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded border border-slate-200 dark:border-[#333] text-indigo-600 dark:text-indigo-400">
                                    <BookOpen size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-[#e0e0e0]">{sem.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-[#a0aec0]">Academic Year: {sem.year}</p>
                                </div>
                            </div>
                            {expandedSemester === sem.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                        </div>

                        {expandedSemester === sem.id && (
                            <div className="p-4 border-t border-slate-200 dark:border-[#333]">
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="text-sm font-semibold text-slate-700 dark:text-[#e0e0e0]">Detailed Subjects</h5>
                                    <button className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium">
                                        <Plus size={14} /> Add Subject
                                    </button>
                                </div>
                                {sem.subjects.length > 0 ? (
                                    <div className="space-y-2">
                                        {sem.subjects.map(sub => (
                                            <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-100 dark:border-[#333]">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-[#e0e0e0]">{sub.name} <span className="text-xs text-slate-500 dark:text-[#a0aec0] font-normal">({sub.code})</span></p>
                                                    <p className="text-xs text-slate-500 dark:text-[#a0aec0]">Instructor: {sub.instructor} • {sub.credits} Credits</p>
                                                </div>
                                                <button className="text-slate-400 hover:text-indigo-600 dark:text-indigo-400"><Edit2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-slate-400 text-sm italic">
                                        No subjects added yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const SystemSettings = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
            {/* General Config */}
            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm p-6">
                <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] mb-4 flex items-center gap-2">
                    <Settings size={18} className="text-slate-400" />
                    General Configuration
                </h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Institution Name</label>
                        <input 
                            type="text" 
                            value={systemSettings.institutionName} 
                            onChange={(e) => setSystemSettings({...systemSettings, institutionName: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Academic Year</label>
                        <input type="text" defaultValue="2025-2026" className="w-full px-3 py-2 border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Contact Email</label>
                        <input type="email" defaultValue="admin@univ.edu" className="w-full px-3 py-2 border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="pt-2">
                        <button type="button" onClick={handleSaveSystemSettings} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Thresholds & Rules */}
            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm p-6">
                <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-slate-400" />
                    Alert Rules
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-[#e0e0e0]">Minimum Attendance (%)</label>
                            <span className="text-xs font-bold text-red-600">{systemSettings.min_attendance}%</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="90"
                            value={systemSettings.min_attendance}
                            onChange={(e) => setSystemSettings({...systemSettings, min_attendance: Number(e.target.value)})}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-xs text-slate-500 dark:text-[#a0aec0] mt-1">Students below this threshold will be flagged 'At Risk'.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-[#333]">
                        <h4 className="text-sm font-medium text-slate-800 dark:text-[#e0e0e0] mb-3">Automated Actions</h4>
                        
                        <div className="flex items-center justify-between mb-3 bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-100 dark:border-[#333]">
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-[#e0e0e0]">Send auto-warning to students below threshold</p>
                                <p className="text-xs text-slate-500 dark:text-[#a0aec0]">Automatically dispatches a notification alert.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={systemSettings.autoWarning} 
                                    onChange={(e) => setSystemSettings({...systemSettings, autoWarning: e.target.checked})}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-[#1e1e1e] dark:border-[#333333] after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-indigo-500"></div>
                            </label>
                        </div>
                        
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-100 dark:border-[#333]">
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-[#e0e0e0]">Email weekly performance report to faculty</p>
                                <p className="text-xs text-slate-500 dark:text-[#a0aec0]">Sends aggregated metric logs every Friday.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={systemSettings.emailWeeklyReport} 
                                    onChange={(e) => setSystemSettings({...systemSettings, emailWeeklyReport: e.target.checked})}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-[#1e1e1e] dark:border-[#333333] after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-indigo-500"></div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-[#333]">
                        <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-2">GPA Grade Scale</label>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 border border-slate-200 dark:border-[#333] rounded bg-slate-50 dark:bg-[#121212]">A: 90-100%</div>
                            <div className="p-2 border border-slate-200 dark:border-[#333] rounded bg-slate-50 dark:bg-[#121212]">B: 80-89%</div>
                            <div className="p-2 border border-slate-200 dark:border-[#333] rounded bg-slate-50 dark:bg-[#121212]">C: 70-79%</div>
                            <div className="p-2 border border-slate-200 dark:border-[#333] rounded bg-slate-50 dark:bg-[#121212]">D: 60-69%</div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <button type="button" onClick={handleSaveSystemSettings} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 w-full justify-center">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">Admin Settings</h1>
                    <p className="text-slate-500 dark:text-[#a0aec0]">System configuration and user management</p>
                </div>
                <div className="bg-indigo-100 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200 flex items-center gap-2">
                    <Shield size={14} /> ADMIN ACCESS
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Settings Sidebar */}
                <div className="md:col-span-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'users' ? 'bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border border-slate-200 dark:border-[#333] shadow-sm text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-500 dark:text-[#a0aec0] hover:bg-slate-100 dark:bg-[#2a2a2a]'}`}
                    >
                        <Users size={18} /> User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('academic')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'academic' ? 'bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border border-slate-200 dark:border-[#333] shadow-sm text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-500 dark:text-[#a0aec0] hover:bg-slate-100 dark:bg-[#2a2a2a]'}`}
                    >
                        <BookOpen size={18} /> Academic Control
                    </button>
                    <button
                        onClick={() => setActiveTab('system')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'system' ? 'bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border border-slate-200 dark:border-[#333] shadow-sm text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-500 dark:text-[#a0aec0] hover:bg-slate-100 dark:bg-[#2a2a2a]'}`}
                    >
                        <Settings size={18} /> System Config
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'logs' ? 'bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border border-slate-200 dark:border-[#333] shadow-sm text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-500 dark:text-[#a0aec0] hover:bg-slate-100 dark:bg-[#2a2a2a]'}`}
                    >
                        <Activity size={18} /> Activity Logs
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-3">
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'academic' && <AcademicControl />}
                    {activeTab === 'system' && <SystemSettings />}
                    {activeTab === 'logs' && (
                        <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm p-6 text-center text-slate-500 dark:text-[#a0aec0] animate-in fade-in">
                            <Activity size={32} className="mx-auto mb-2 text-slate-300" />
                            <p>System activity logs will appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* User Modal */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-xl w-full max-w-md p-6 m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0]">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                            <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-[#a0aec0]">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={userFormData.name}
                                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={userFormData.email}
                                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">
                                    Password {editingUser && <span className="text-xs text-slate-400 font-normal">(Leave blank to keep current)</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showUserPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={userFormData.password}
                                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                                        className="w-full pl-3 pr-10 py-2 border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required={!editingUser}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowUserPassword(!showUserPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-[#a0aec0] transition-colors"
                                    >
                                        {showUserPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Role</label>
                                <select
                                    value={userFormData.role}
                                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-[#333] rounded-lg text-sm text-slate-600 dark:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Instructor">Instructor</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            {editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Status</label>
                                    <select
                                        value={userFormData.status}
                                        onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-[#333] rounded-lg text-sm text-slate-600 dark:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            )}
                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsUserModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 dark:text-[#a0aec0] hover:bg-slate-100 dark:bg-[#2a2a2a] rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    {editingUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Toast Message */}
            {toastMessage && (
                <div className="fixed bottom-4 right-4 bg-slate-800 dark:bg-slate-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
                    <CheckCircle size={20} className="text-emerald-400" />
                    <span className="font-medium text-sm">{toastMessage}</span>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
