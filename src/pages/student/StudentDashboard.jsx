import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, UserCheck, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import BunkMeter from '../../components/student/BunkMeter';
import CareerRoadmap from '../../components/student/CareerRoadmap';
import { AttendanceContext } from '../../context/AttendanceContext';
import { SettingsContext } from '../../context/SettingsContext';

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { globalAttendance } = useContext(AttendanceContext);
    const { settings } = useContext(SettingsContext);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const res = await axios.get('http://localhost:5000/api/performance/student/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-user-id': localStorage.getItem('userId'),
                        'x-user-role': localStorage.getItem('userRole')
                    }
                });
                setDashboardData(res.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const marksData = [
        { subject: 'Math', marks: 85 },
        { subject: 'Phy', marks: 78 },
        { subject: 'Chem', marks: 92 },
        { subject: 'CS', marks: 88 },
        { subject: 'Eng', marks: 74 },
    ];

    // Logic: Perform a count operation on the list of subjects assigned to the student.
    // Fallback: Default to the number of unique labels on the X-axis (subject) if database query fails.
    const uniqueSubjectsCount = new Set(marksData.map(item => item.subject)).size;
    const totalSubjectsValue = dashboardData?.totalSubjects || uniqueSubjectsCount;

    const pendingTasksCount = dashboardData?.pendingAssignments;
    const isAllCaughtUp = pendingTasksCount === 0;

    const pendingTasksCard = isAllCaughtUp 
        ? { title: 'Pending Tasks', value: 'All Caught Up!', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-l-4 border-emerald-500' }
        : { title: 'Pending Tasks', value: pendingTasksCount ?? '-', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-l-4 border-orange-500' };

    // Use fetched data or fallback to defaults while loading
    const summaryData = [
        { title: 'Total Subjects', value: totalSubjectsValue, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-l-4 border-blue-500' },
        { title: 'Overall GPA', value: dashboardData?.gpa ?? '-', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-l-4 border-purple-500' },
        { title: 'Attendance', value: globalAttendance !== null ? `${globalAttendance}%` : '-', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100', border: 'border-l-4 border-green-500' },
        pendingTasksCard,
        { title: 'Status', value: dashboardData?.performanceStatus || 'Loading...', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-l-4 border-emerald-500' },
    ];

    const trendData = [
        { semester: 'Sem 1', gpa: 3.2 },
        { semester: 'Sem 2', gpa: 3.4 },
        { semester: 'Sem 3', gpa: 3.6 },
        { semester: 'Sem 4', gpa: 3.8 },
    ];

    const gradeDistribution = [
        { name: 'A Grade', value: 4, color: '#10b981' },
        { name: 'B Grade', value: 3, color: '#3b82f6' },
        { name: 'C Grade', value: 1, color: '#f59e0b' },
    ];

    if (loading) {
        return <div className="p-8 text-center text-slate-500 dark:text-[#a0aec0]">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">Overview</h2>
                <p className="text-slate-500 dark:text-[#a0aec0]">Welcome back, {dashboardData?.name || localStorage.getItem('userName') || 'Student'}! Here's your performance summary.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {summaryData.map((item, index) => (
                    <div key={index} className={`bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-sm p-4 flex items-center justify-between transition-transform hover:scale-105 ${item.border}`}>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-[#a0aec0] uppercase tracking-wide">{item.title}</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0] mt-1">{item.value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                            <item.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Personalized Bunk Meter */}
            <BunkMeter />

            {/* Personalized Career Roadmap Timeline */}
            <CareerRoadmap />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Bar Chart: Marks */}
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-[#333]">
                    <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] mb-4">Subject-wise Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marksData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="marks" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart: GPA Trend */}
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-[#333]">
                    <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] mb-4">gpa Progression</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="gpa" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Grades */}
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-[#333] lg:col-span-1">
                    <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] mb-4">Grade Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gradeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {gradeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity / Notifications Preview */}
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-[#333] lg:col-span-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0]">Recent Alerts</h3>
                        <Link to="/student/notifications" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer">View All</Link>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start p-3 bg-red-50 rounded-lg border border-red-100">
                            <AlertTriangle size={18} className="text-red-500 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-700">Attendance Warning</h4>
                                <p className="text-xs text-red-600 mt-1">Your attendance in English is below {settings?.min_attendance || 75}%.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <BookOpen size={18} className="text-blue-500 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-blue-700">New Assignment</h4>
                                <p className="text-xs text-blue-600 mt-1">Calculus Problem Set 3 due in 2 days.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
