import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';

const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-3 border border-slate-100 dark:border-[#333] shadow-lg rounded-lg">
                <p className="font-semibold text-slate-700 dark:text-[#e0e0e0]">{label}</p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">Avg: {payload[0].value}%</p>
            </div>
        );
    }
    return null;
};

export const MarksTrend = () => {
    const [trendData, setTrendData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard');
                setTrendData(res.data.marksTrend);
            } catch (err) {
                console.error("Error fetching trends:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl border border-slate-100 dark:border-[#333] shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0] mb-6 flex-shrink-0">Average Marks Trend</h3>
            <div className="flex-grow w-full relative" style={{ minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[60, 100]} />
                        <Tooltip content={<CustomLineTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="avg"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const PassFailRatio = () => {
    const [passFailData, setPassFailData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard');
                setPassFailData(res.data.passFailRatio);
            } catch (err) {
                console.error("Error fetching pass/fail data:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl border border-slate-100 dark:border-[#333] shadow-sm h-full flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0] mb-2 w-full text-left">Pass / Fail Ratio</h3>
            <div className="w-full relative flex items-center justify-center flex-grow" style={{ minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={passFailData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            cornerRadius={6}
                        >
                            {passFailData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
