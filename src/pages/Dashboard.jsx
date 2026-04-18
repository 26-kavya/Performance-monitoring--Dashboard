import React, { useContext, useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import AdminControlBar from '../components/AdminControlBar';
import { SubjectPerformance, AttendanceRadial } from '../components/Charts';
import { MarksTrend, PassFailRatio } from '../components/AnalyticsSection';
import { BookOpen, GraduationCap, Clock, AlertTriangle, Send, Activity, UserX, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { AdminFilterContext } from '../context/AdminFilterContext';
import { SettingsContext } from '../context/SettingsContext';

const Dashboard = () => {
    const { departmentFilter } = useContext(AdminFilterContext) || { departmentFilter: 'All' };
    const { settings } = useContext(SettingsContext);
    const limit = settings?.min_attendance || 75;
    
    // Dynamic color logic: value < 80% shows amber instead of emerald. 
    // Set mock to 79.5% to demonstrate the color change.
    const averageAttendance = 79.5;
    const attendanceColor = averageAttendance < 80 ? 'bg-amber-500' : 'bg-emerald-500';

    const [atRiskStudents, setAtRiskStudents] = useState([]);
    const [notifiedStudents, setNotifiedStudents] = useState([]);
    const [toastMessage, setToastMessage] = useState('');
    const [recentActivities, setRecentActivities] = useState([]);

    const fetchActivities = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/activities');
            setRecentActivities(res.data);
        } catch (e) {
            console.error("Error fetching activities", e);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/students');
            setAtRiskStudents(res.data);
        } catch(e) {
            console.error("Error fetching students", e);
        }
    };

    const refreshData = () => {
        fetchStudents();
        fetchActivities();
    };

    useEffect(() => {
        refreshData();
    }, []);

    const filterAndSortStudents = () => {
        let filtered = atRiskStudents.filter(s => s.attendance < limit);
        if (departmentFilter !== 'All') {
            filtered = filtered.filter(s => s.department === departmentFilter);
        }
        return filtered.sort((a,b) => a.attendance - b.attendance);
    };

    const displayAtRisk = filterAndSortStudents();

    const handleWarn = async (student) => {
        if (notifiedStudents.includes(student._id)) return;
        
        try {
            await axios.post('http://localhost:5000/api/notifications', {
                 title: '⚠️ Low Attendance Warning',
                 message: `Hello ${student.name}, your attendance is currently ${student.attendance}%. You are at risk of being ineligible for exams. Please meet your coordinator.`,
                 type: 'warning',
                 priority: 'High',
                 recipientType: 'Selected Students',
                 recipientIds: [student._id]
            });
            setNotifiedStudents(prev => [...prev, student._id]);
            console.log(`Notification sent to Student ID: ${student._id} success`);
            localStorage.setItem('new_notification_for_student', student._id);
            localStorage.setItem('new_notification_timestamp', Date.now());
            setToastMessage(`Warning sent to ${student.name} successfully.`);
            setTimeout(() => setToastMessage(''), 4000);
            refreshData();
        } catch (error) {
            console.error("Error sending warning:", error);
            alert("Failed to send warning.");
        }
    };

    const timeAgo = (dateStr) => {
        const diff = new Date() - new Date(dateStr);
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} mins ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        return `${Math.floor(hours / 24)} days ago`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {departmentFilter !== 'All' && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
                    Viewing metrics filtered by department: {departmentFilter}
                </div>
            )}
            
            <AdminControlBar onActionComplete={refreshData} />

            {/* Academic Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
                <StatCard
                    title="Current GPA"
                    value="3.8"
                    subtext="last semester"
                    icon={GraduationCap}
                    color="bg-indigo-500"
                    trend="up"
                    trendValue="+0.2"
                />
                <StatCard
                    title="Total Attendance"
                    value={`${averageAttendance}%`}
                    subtext="across all subjects"
                    icon={Clock}
                    color={attendanceColor}
                    trend={averageAttendance < 80 ? 'down' : 'up'}
                    trendValue={averageAttendance < 80 ? '-2.5%' : '+5%'}
                />
                <StatCard
                    title="Total Credits"
                    value="112"
                    subtext="earned so far"
                    icon={BookOpen}
                    color="bg-blue-500"
                />
            </div>

            {/* Progress Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 h-80">
                    <SubjectPerformance />
                </div>
                <div className="h-80">
                    <AttendanceRadial />
                </div>
            </div>

            {/* Department Analytics + At Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="h-80">
                    <MarksTrend />
                </div>
                <div className="h-80">
                    <PassFailRatio />
                </div>
                
                {/* At-Risk Widget */}
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl border border-rose-100 shadow-sm flex flex-col h-80">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="text-rose-500" size={20} />
                        <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] text-lg">Action Required</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#a0aec0] mb-4 whitespace-nowrap">Students with attendance &lt; {limit}%</p>
                    <div className="flex-1 overflow-y-auto space-y-3 relative">
                        {toastMessage && (
                            <div className="absolute top-0 left-0 right-0 z-10 bg-emerald-100 border border-emerald-400 text-emerald-800 px-3 py-2 rounded-lg text-xs font-bold shadow flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle size={14} className="text-emerald-600" />
                                {toastMessage}
                            </div>
                        )}
                        {displayAtRisk.map(student => {
                            const isNotified = notifiedStudents.includes(student._id);
                            return (
                                <div key={student._id} className="flex items-center justify-between p-3 bg-rose-50/50 rounded-lg border border-rose-100">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-[#e0e0e0] flex items-center gap-1.5"><UserX size={14} className="text-slate-400"/> {student.name}</p>
                                        <p className="text-xs text-rose-600 font-bold mt-1">
                                            {student.attendance}% <span className="text-slate-400 font-normal">| {student.department}</span>
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleWarn(student)}
                                        disabled={isNotified}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors ${isNotified ? 'bg-slate-200 text-slate-500 dark:text-[#a0aec0] cursor-not-allowed' : 'bg-rose-200 text-rose-800 hover:bg-rose-600 hover:text-white'}`}
                                    >
                                        {isNotified ? 'Notified' : <><Send size={12} /> Warn</>}
                                    </button>
                                </div>
                            );
                        })}
                        {displayAtRisk.length === 0 && (
                            <div className="text-sm text-slate-400 text-center mt-8">No at-risk students right now.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl border border-slate-100 dark:border-[#333] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Activity className="text-indigo-500" size={24} />
                        <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] text-lg">Recent Activities</h3>
                    </div>
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer">View All</button>
                </div>
                <div className="space-y-4">
                    {recentActivities.map(activity => (
                        <div key={activity._id || activity.id} className="flex items-start gap-4 p-3 hover:bg-slate-50 dark:bg-[#121212] rounded-lg transition-colors border-l-2 border-transparent hover:border-indigo-400">
                            <p className="text-sm font-semibold text-slate-700 dark:text-[#e0e0e0] flex-1">{activity.action}</p>
                            <span className="text-xs text-slate-500 dark:text-[#a0aec0] font-medium whitespace-nowrap">{activity.createdAt ? timeAgo(activity.createdAt) : activity.time}</span>
                        </div>
                    ))}
                    {recentActivities.length === 0 && (
                        <div className="text-sm text-slate-400 text-center py-4">No recent activities.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
