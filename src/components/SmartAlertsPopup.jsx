import React, { useContext } from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const SmartAlertsPopup = ({ onClose }) => {
    const { settings } = useContext(SettingsContext);
    return (
        <div className="absolute right-0 top-16 w-80 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border border-slate-200 dark:border-[#333] rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-[#333] flex justify-between items-center bg-slate-50 dark:bg-[#121212]">
                <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0]">Smart Alerts</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-[#a0aec0]">
                    <X size={18} />
                </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                {/* At Risk Flags */}
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1 text-red-700 font-semibold text-sm">
                        <AlertTriangle size={16} />
                        <h4>Action Required</h4>
                    </div>
                    <p className="text-xs text-red-600 mb-2">Attendance dropped below {settings?.minAttendanceLimit || 75}% in Computer Science.</p>
                    <button className="text-xs bg-white dark:bg-[#1e1e1e] dark:border-[#333333] text-red-600 px-2 py-1 rounded border border-red-200 font-medium hover:bg-red-50 transition-colors">
                        View Details
                    </button>
                </div>

                {/* Upcoming Exams */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Upcoming Exams</h4>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-[#121212] rounded-lg">
                            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-1.5 rounded border border-slate-100 dark:border-[#333] text-center min-w-[2.5rem]">
                                <span className="block text-[10px] text-slate-500 dark:text-[#a0aec0] font-bold">OCT</span>
                                <span className="block text-sm font-bold text-slate-800 dark:text-[#e0e0e0]">24</span>
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-slate-700 dark:text-[#e0e0e0]">Data Structures</h5>
                                <p className="text-[10px] text-slate-500 dark:text-[#a0aec0] flex items-center gap-1 mt-0.5">
                                    <Clock size={10} /> 10:00 AM - 1:00 PM
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-[#121212] rounded-lg">
                            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-1.5 rounded border border-slate-100 dark:border-[#333] text-center min-w-[2.5rem]">
                                <span className="block text-[10px] text-slate-500 dark:text-[#a0aec0] font-bold">OCT</span>
                                <span className="block text-sm font-bold text-slate-800 dark:text-[#e0e0e0]">28</span>
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-slate-700 dark:text-[#e0e0e0]">Database Mgmt</h5>
                                <p className="text-[10px] text-slate-500 dark:text-[#a0aec0] flex items-center gap-1 mt-0.5">
                                    <Clock size={10} /> 02:00 PM - 5:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Activity</h4>
                    <ul className="space-y-3">
                        <li className="flex gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                            <div>
                                <p className="text-xs text-slate-700 dark:text-[#e0e0e0]">Assignment submitted <span className="font-semibold">"React Basics"</span></p>
                                <p className="text-[10px] text-slate-400 mt-0.5">2 hours ago</p>
                            </div>
                        </li>
                        <li className="flex gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                            <div>
                                <p className="text-xs text-slate-700 dark:text-[#e0e0e0]">Grade updated for <span className="font-semibold">"System Design"</span></p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Yesterday</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SmartAlertsPopup;
