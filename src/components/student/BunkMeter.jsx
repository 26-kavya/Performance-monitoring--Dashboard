import React, { useContext } from 'react';
import { AttendanceContext } from '../../context/AttendanceContext';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { SettingsContext } from '../../context/SettingsContext';

const BunkMeter = () => {
    const { attendanceData, globalAttendance, loading } = useContext(AttendanceContext);
    const { settings } = useContext(SettingsContext);

    if (loading) {
        return <div className="p-6 bg-white/30 backdrop-blur-md rounded-2xl animate-pulse h-64 border border-white/40 shadow-xl"></div>;
    }

    if (!attendanceData || attendanceData.total_classes === undefined) {
        return null;
    }

    const { attended_classes, total_classes } = attendanceData;
    const currentPercent = globalAttendance !== null ? globalAttendance : (total_classes === 0 ? 0 : (attended_classes / total_classes) * 100);
    const limit = settings?.min_attendance || 75;
    const limitFraction = limit / 100;
    
    let safeToBunk = 0;
    let mustAttend = 0;
    
    if (currentPercent >= limit) {
        safeToBunk = Math.floor((attended_classes / limitFraction) - total_classes);
    } else {
        mustAttend = Math.ceil((limitFraction * total_classes - attended_classes) / (1 - limitFraction));
    }

    let colorName = '';
    let textColor = '';
    let bgColor = '';
    let strokeColor = '';
    let icon = null;

    if (currentPercent > 80) {
        colorName = 'green';
        textColor = 'text-emerald-700';
        bgColor = 'bg-emerald-50';
        strokeColor = '#10b981'; // emerald-500
        icon = <CheckCircle className="text-emerald-500 mb-2" size={32} />;
    } else if (currentPercent >= limit) {
        colorName = 'orange';
        textColor = 'text-amber-700';
        bgColor = 'bg-amber-50';
        strokeColor = '#f59e0b'; // amber-500
        icon = <AlertTriangle className="text-amber-500 mb-2" size={32} />;
    } else {
        colorName = 'red';
        textColor = 'text-red-700';
        bgColor = 'bg-red-50';
        strokeColor = '#ef4444'; // red-500
        icon = <ShieldAlert className="text-red-500 mb-2" size={32} />;
    }

    const decorColors = {
        green: { d1: 'bg-emerald-400', d2: 'bg-emerald-600' },
        orange: { d1: 'bg-amber-400', d2: 'bg-amber-600' },
        red: { d1: 'bg-red-400', d2: 'bg-red-600' }
    };
    const decors = decorColors[colorName];

    const circleRadius = 55;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset = circleCircumference - (currentPercent / 100) * circleCircumference;

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-6 relative overflow-hidden transition-all hover:shadow-3xl">
            {/* Soft decorative blur circles */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-3xl opacity-30 ${decors.d1}`}></div>
            <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${decors.d2}`}></div>
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-[#e0e0e0] mb-6 z-10 relative">Bunk Meter</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
                
                {/* Circular Progress Ring */}
                <div className="flex flex-col items-center justify-center relative pl-4 md:pl-0">
                    <svg height="150" width="150" className="transform -rotate-90">
                        <circle
                            stroke="#e2e8f0"
                            strokeWidth="10"
                            fill="transparent"
                            r={circleRadius}
                            cx="75"
                            cy="75"
                        />
                        <circle
                            stroke={strokeColor}
                            strokeWidth="10"
                            strokeDasharray={circleCircumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="transparent"
                            r={circleRadius}
                            cx="75"
                            cy="75"
                            className="transition-all duration-1000 ease-in-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-slate-800 dark:text-[#e0e0e0]">{currentPercent.toFixed(1)}%</span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-[#a0aec0] mt-1 uppercase tracking-widest">Attendance</span>
                    </div>
                </div>

                {/* Status Message Block */}
                <div className="flex-1 text-center md:text-left">
                    <div className={`flex flex-col items-center md:items-start p-5 rounded-2xl ${bgColor} border border-white/60 shadow-sm w-full h-full justify-center bg-opacity-70 backdrop-blur-sm`}>
                        {icon}
                        
                        {safeToBunk > 0 && currentPercent >= limit && (
                            <div className={textColor}>
                                <h4 className="font-extrabold text-xl mb-1 tracking-tight">Safe Zone!</h4>
                                <p className="text-sm font-medium leading-relaxed">You are in the Safe Zone! You can safely bunk the next <strong className="text-2xl px-1 font-black">{safeToBunk}</strong> classes.</p>
                            </div>
                        )}
                        
                        {safeToBunk === 0 && currentPercent >= limit && (
                            <div className={textColor}>
                                <h4 className="font-extrabold text-xl mb-1 tracking-tight">Caution!</h4>
                                <p className="text-sm font-medium leading-relaxed">Caution! If you miss the next class, your attendance will drop below {limit}%.</p>
                            </div>
                        )}
                        
                        {currentPercent < limit && (
                            <div className={textColor}>
                                <h4 className="font-extrabold text-xl mb-1 tracking-tight">Danger Zone!</h4>
                                <p className="text-sm font-medium leading-relaxed">Danger Zone! You must attend the next <strong className="text-2xl px-1 font-black">{mustAttend}</strong> classes without fail to reach {limit}%.</p>
                            </div>
                        )}

                        <div className="mt-5 flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                             <span>{attended_classes} Attended</span>
                             <span>•</span>
                             <span>{total_classes} Total</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BunkMeter;
