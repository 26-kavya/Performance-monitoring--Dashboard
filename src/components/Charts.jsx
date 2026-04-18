import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-3 border border-slate-100 dark:border-[#333] shadow-lg rounded-lg">
                <p className="font-semibold text-slate-700 dark:text-[#e0e0e0]">{label}</p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">Marks: {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

export const SubjectPerformance = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard');
                setData(res.data.subjectPerformance);
            } catch (err) {
                console.error("Error fetching subject performance:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl border border-slate-100 dark:border-[#333] shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0] mb-6 flex-shrink-0">Subject Wise Performance</h3>
            <div className="flex-grow w-full relative" style={{ minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="marks" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const AttendanceRadial = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [presentPercentage, setPresentPercentage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard');
                const { present, absent } = res.data.attendanceRadial;

                const total = present + absent;
                const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
                setPresentPercentage(percentage);

                setAttendanceData([
                    { name: 'Present', value: present },
                    { name: 'Absent', value: absent },
                ]);
            } catch (err) {
                console.error("Error fetching attendance:", err);
            }
        };
        fetchData();
    }, []);

    const COLORS = ['#4f46e5', '#e2e8f0'];

    return (
        <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl border border-slate-100 dark:border-[#333] shadow-sm h-full flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0] mb-2 w-full text-left">Overall Attendance</h3>
            <div className="w-full relative flex items-center justify-center flex-grow" style={{ minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                        >
                            {attendanceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-bold text-slate-800 dark:text-[#e0e0e0]">{presentPercentage}%</span>
                    <span className="text-sm text-slate-400">Present</span>
                </div>
            </div>
            <div className="w-full mt-4 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500"></div>
                    <span className="text-sm text-slate-600 dark:text-[#a0aec0]">Present</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <span className="text-sm text-slate-600 dark:text-[#a0aec0]">Absent</span>
                </div>
            </div>
        </div>
    )
}
