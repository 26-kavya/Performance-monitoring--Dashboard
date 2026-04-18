import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Award, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';

const Grades = () => {
    // Mock Data
    const gradeData = [
        { subject: 'DBMS', internal: 25, external: 60, total: 85, grade: 'A' },
        { subject: 'OS', internal: 22, external: 55, total: 77, grade: 'B+' },
        { subject: 'CN', internal: 24, external: 58, total: 82, grade: 'A' },
        { subject: 'Math', internal: 20, external: 50, total: 70, grade: 'B' },
        { subject: 'Java', internal: 28, external: 65, total: 93, grade: 'O' },
    ];

    const distributionData = [
        { name: 'O', value: 1, color: '#4f46e5' },
        { name: 'A', value: 2, color: '#10b981' },
        { name: 'B+', value: 1, color: '#f59e0b' },
        { name: 'B', value: 1, color: '#ef4444' },
    ];

    const semesterTrendData = [
        { semester: 'Sem 1', gpa: 7.8 },
        { semester: 'Sem 2', gpa: 8.2 },
        { semester: 'Sem 3', gpa: 8.0 },
        { semester: 'Sem 4', gpa: 8.5 },
    ];

    const StatsCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl border border-slate-100 dark:border-[#333] shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 dark:text-[#a0aec0] text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">{value}</h3>
                    {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                    <Icon className={color.replace('bg-', 'text-')} size={24} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">Grade Book</h1>
                <p className="text-slate-500 dark:text-[#a0aec0]">Academic performance and analytics</p>
            </div>

            {/* GPA Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Credits" value="84" icon={BookOpen} color="bg-blue-500 text-blue-500" />
                <StatsCard title="Credit Points" value="672" icon={Award} color="bg-purple-500 text-purple-500" />
                <StatsCard title="SGPA (Sem 4)" value="8.5" icon={TrendingUp} color="bg-emerald-500 text-emerald-500" subtext="+0.5 from last sem" />
                <StatsCard title="CGPA" value="8.12" icon={AlertCircle} color="bg-indigo-500 text-indigo-500" subtext="First Class with Dist." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Grade Table */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-100 dark:border-[#333] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-[#333]">
                        <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0]">Current Semester Grades</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-[#121212] text-slate-500 dark:text-[#a0aec0] text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4 text-center">Internal</th>
                                    <th className="px-6 py-4 text-center">External</th>
                                    <th className="px-6 py-4 text-center">Total</th>
                                    <th className="px-6 py-4 text-center">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#333]">
                                {gradeData.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50 dark:bg-[#121212] transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-[#e0e0e0]">{row.subject}</td>
                                        <td className="px-6 py-4 text-center text-slate-600 dark:text-[#a0aec0]">{row.internal}</td>
                                        <td className="px-6 py-4 text-center text-slate-600 dark:text-[#a0aec0]">{row.external}</td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-[#e0e0e0]">{row.total}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${row.grade === 'O' ? 'bg-indigo-100 text-indigo-700 dark:text-indigo-300' :
                                                    row.grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {row.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Grade Distribution Chart */}
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-100 dark:border-[#333] shadow-sm p-6 flex flex-col items-center justify-center">
                    <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] w-full mb-4">Grade Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Performance Bar Chart */}
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-100 dark:border-[#333] shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] mb-6">Subject Performance</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gradeData} barGap={0} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Legend />
                                <Bar dataKey="internal" name="Internal" fill="#818cf8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="external" name="External" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Semester Trend Line Chart */}
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-100 dark:border-[#333] shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] mb-6">GPA Trend</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={semesterTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="gpa"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grades;
