import React, { useState, useEffect, useContext } from 'react';
import { AlertCircle } from 'lucide-react';
import { AttendanceContext } from '../../context/AttendanceContext';
import { SettingsContext } from '../../context/SettingsContext';

const StudentAttendance = () => {
    const { globalAttendance } = useContext(AttendanceContext);
    const { settings } = useContext(SettingsContext);
    const limit = settings?.minAttendanceLimit || 75;
    const displayAttendance = globalAttendance !== null ? globalAttendance : 0;
    
    const circleRadius = 28;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset = circleCircumference - (displayAttendance / 100) * circleCircumference;

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Mock Data
    const attendanceData = [
        { id: 1, subject: 'Mathematics I', faculty: 'Prof. Alan Turing', attended: 42, total: 45, percentage: 93 },
        { id: 2, subject: 'Engineering Physics', faculty: 'Dr. Marie Curie', attended: 38, total: 45, percentage: 84 },
        { id: 3, subject: 'Chemistry', faculty: 'Dr. Linus Pauling', attended: 44, total: 45, percentage: 97 },
        { id: 4, subject: 'Computer Science', faculty: 'Prof. Ada Lovelace', attended: 45, total: 45, percentage: 100 },
        { id: 5, subject: 'English', faculty: 'Dr. William Shakespeare', attended: 28, total: 45, percentage: 62 }, // Low attendance
    ];

    const getBunkStatus = (attended, total, target = 75) => {
        let currentPct = parseFloat(((attended / total) * 100).toFixed(2));
        const targetDecimal = target / 100;
        
        if (Math.abs(currentPct - target) < 0.05 || currentPct === target) {
            return { type: 'exact', value: 0 };
        } else if (currentPct > target) {
            let safeSkips = Math.floor((attended - (targetDecimal * total)) / targetDecimal);
            safeSkips = Math.max(0, safeSkips);
            return { type: 'safe', value: safeSkips };
        } else {
            let needed = Math.ceil((targetDecimal * total) - attended);
            needed = Math.max(0, needed);
            return { type: 'danger', value: needed };
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">Attendance Record</h2>
                <p className="text-slate-500 dark:text-[#a0aec0]">Monitor your class attendance. Maintain {limit}% to appear for exams.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Overall Stats Card */}
                <div className="bg-indigo-600 dark:bg-indigo-500 rounded-xl p-6 text-white shadow-lg md:col-span-2 lg:col-span-3 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold opacity-90">Overall Attendance</h3>
                        <p className="text-3xl font-bold mt-1">
                            {globalAttendance !== null ? `${globalAttendance}%` : '-'}
                        </p>
                        <p className="text-sm opacity-75 mt-1">
                            {displayAttendance >= limit ? 'Good standing. Keep it up!' : `Attendance is below ${limit}%. Caution!`}
                        </p>
                    </div>
                    
                    {/* Circular Gauge */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg height="64" width="64" className="transform -rotate-90 absolute inset-0">
                            <circle
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="5"
                                fill="transparent"
                                r={circleRadius}
                                cx="32"
                                cy="32"
                            />
                            <circle
                                stroke="#ffffff"
                                strokeWidth="5"
                                strokeDasharray={circleCircumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="transparent"
                                r={circleRadius}
                                cx="32"
                                cy="32"
                                className="transition-all duration-1000 ease-in-out"
                            />
                        </svg>
                        <span className="font-bold text-lg relative z-10">
                            {globalAttendance !== null ? `${Math.round(globalAttendance)}%` : '-'}
                        </span>
                    </div>
                </div>

                {/* Subject-wise Cards */}
                {attendanceData.map((item) => {
                    const status = getBunkStatus(item.attended, item.total, 75);
                    return (
                        <div key={item.id} className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm hover:shadow-md transition-shadow duration-300 p-6 relative overflow-hidden group">
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                {item.percentage > 75 ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                        On Track
                                    </span>
                                ) : item.percentage >= 65 ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                                        Warning
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider">
                                        <AlertCircle size={10} className="mr-1" /> Critical
                                    </span>
                                )}
                            </div>

                            {/* Header */}
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{item.faculty}</p>
                            <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] text-lg mb-1 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">{item.subject}</h3>
                            <p className="text-sm text-slate-500 dark:text-[#a0aec0] mb-5">{item.attended} / {item.total} hours present</p>

                            {/* Progress Bar Container */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-3 bg-slate-100 dark:bg-[#2a2a2a] rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                            item.percentage >= 90 ? 'bg-emerald-500' :
                                            item.percentage >= limit ? 'bg-blue-500' :
                                            'bg-rose-500'
                                        }`}
                                        style={{ width: mounted ? `${item.percentage}%` : '0%' }}
                                    ></div>
                                </div>
                                <span className={`text-sm font-bold w-10 text-right ${
                                    item.percentage >= 90 ? 'text-emerald-600' :
                                    item.percentage >= limit ? 'text-blue-600' :
                                    'text-rose-600'
                                }`}>
                                    {item.percentage}%
                                </span>
                            </div>

                            {/* Mini Bunk Meter */}
                            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#333]">
                                {status.type === 'exact' ? (
                                    <p className="text-xs font-medium text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                        Attend next class to stay on track
                                    </p>
                                ) : status.type === 'safe' ? (
                                    <p className="text-xs font-medium text-slate-500 dark:text-[#a0aec0] flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        Safe to skip: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{status.value} classes</span>
                                    </p>
                                ) : (
                                    <p className="text-xs font-medium text-slate-500 dark:text-[#a0aec0] flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                        Attend next: <span className="text-rose-600 dark:text-rose-400 font-bold">{status.value} classes</span> to reach 75%
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentAttendance;
