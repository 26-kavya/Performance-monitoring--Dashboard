import React from 'react';

const StudentMarks = () => {
    // Mock Data
    const marks = [
        { id: 1, subject: 'Mathematics I', code: 'MAT101', internal: 35, external: 50, total: 85, grade: 'A' },
        { id: 2, subject: 'Engineering Physics', code: 'PHY101', internal: 28, external: 50, total: 78, grade: 'B' },
        { id: 3, subject: 'Chemistry', code: 'CHE101', internal: 38, external: 54, total: 92, grade: 'A+' },
        { id: 4, subject: 'Computer Science', code: 'CS101', internal: 36, external: 52, total: 88, grade: 'A' },
        { id: 5, subject: 'English', code: 'ENG101', internal: 20, external: 25, total: 45, grade: 'F' }, // Fail example
    ];

    const getGradeBadge = (grade) => {
        if (grade === 'F') return <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-bold text-xs">F</span>;
        if (grade === 'A+' || grade === 'A') return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-bold text-xs">{grade}</span>;
        return <span className="px-2 py-1 rounded bg-slate-100 dark:bg-[#2a2a2a] text-slate-700 dark:text-[#e0e0e0] font-bold text-xs">{grade}</span>;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">Academic Performance</h2>
                <p className="text-slate-500 dark:text-[#a0aec0]">View your detailed marks and grades for this semester.</p>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-sm border border-slate-200 dark:border-[#333] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-[#121212] text-slate-500 dark:text-[#a0aec0] font-semibold border-b border-slate-200 dark:border-[#333]">
                            <tr>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4 text-center">Internal (40)</th>
                                <th className="px-6 py-4 text-center">External (60)</th>
                                <th className="px-6 py-4 text-center">Total (100)</th>
                                <th className="px-6 py-4 text-center">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#333]">
                            {marks.map((row) => (
                                <tr key={row.id} className={`hover:bg-slate-50 dark:bg-[#121212] transition-colors ${row.grade === 'F' ? 'bg-red-50/50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-800 dark:text-[#e0e0e0]">{row.subject}</p>
                                        <p className="text-xs text-slate-500 dark:text-[#a0aec0]">{row.code}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-600 dark:text-[#a0aec0]">{row.internal}</td>
                                    <td className="px-6 py-4 text-center text-slate-600 dark:text-[#a0aec0]">{row.external}</td>
                                    <td className="px-6 py-4 text-center font-bold text-indigo-900">{row.total}</td>
                                    <td className="px-6 py-4 text-center">
                                        {getGradeBadge(row.grade)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentMarks;
