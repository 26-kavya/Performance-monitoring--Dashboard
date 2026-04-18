import React, { useContext } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const AlertsSidebar = () => {
    const { settings } = useContext(SettingsContext);
    return (
        <div className="w-80 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border-l border-slate-200 dark:border-[#333] h-screen fixed right-0 top-0 p-6 overflow-y-auto hidden xl:block">
            <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0] mb-6">Smart Alerts</h3>

            <div className="space-y-6">
                {/* At Risk Flags */}
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2 text-red-700 font-semibold">
                        <AlertTriangle size={18} />
                        <h4>Action Required</h4>
                    </div>
                    <p className="text-sm text-red-600 mb-3">Attendance dropped below {settings?.minAttendanceLimit || 75}% in Computer Science.</p>
                    <button className="text-xs bg-white dark:bg-[#1e1e1e] dark:border-[#333333] text-red-600 px-3 py-1.5 rounded-lg border border-red-200 font-medium hover:bg-red-50 transition-colors">
                        View Details
                    </button>
                </div>

                {/* Upcoming Exams */}
                <div>
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-[#a0aec0] uppercase tracking-wider mb-4">Upcoming Exams</h4>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-[#121212] rounded-lg">
                            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-2 rounded border border-slate-100 dark:border-[#333] text-center min-w-[3rem]">
                                <span className="block text-xs text-slate-500 dark:text-[#a0aec0] font-bold">OCT</span>
                                <span className="block text-lg font-bold text-slate-800 dark:text-[#e0e0e0]">24</span>
                            </div>
                            <div>
                                <h5 className="font-semibold text-slate-700 dark:text-[#e0e0e0]">Data Structures</h5>
                                <p className="text-xs text-slate-500 dark:text-[#a0aec0] flex items-center gap-1 mt-1">
                                    <Clock size={12} /> 10:00 AM - 1:00 PM
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-[#121212] rounded-lg">
                            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-2 rounded border border-slate-100 dark:border-[#333] text-center min-w-[3rem]">
                                <span className="block text-xs text-slate-500 dark:text-[#a0aec0] font-bold">OCT</span>
                                <span className="block text-lg font-bold text-slate-800 dark:text-[#e0e0e0]">28</span>
                            </div>
                            <div>
                                <h5 className="font-semibold text-slate-700 dark:text-[#e0e0e0]">Database Mgmt</h5>
                                <p className="text-xs text-slate-500 dark:text-[#a0aec0] flex items-center gap-1 mt-1">
                                    <Clock size={12} /> 02:00 PM - 5:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-[#a0aec0] uppercase tracking-wider mb-4">Recent Activity</h4>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                            <div>
                                <p className="text-sm text-slate-700 dark:text-[#e0e0e0]">Assignment submitted <span className="font-semibold">"React Basics"</span></p>
                                <p className="text-xs text-slate-400 mt-0.5">2 hours ago</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                            <div>
                                <p className="text-sm text-slate-700 dark:text-[#e0e0e0]">Grade updated for <span className="font-semibold">"System Design"</span></p>
                                <p className="text-xs text-slate-400 mt-0.5">Yesterday</p>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default AlertsSidebar;
