import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Award, Users, Download, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PlacementHub = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students`);
                const sorted = [...res.data].sort((a, b) => (b.resume_score || 0) - (a.resume_score || 0));
                setStudents(sorted);
            } catch (err) {
                console.error("Error fetching students:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleStatusChange = async (id, name, newStatus) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students/${id}`, { placement_status: newStatus });
            setStudents(prevStudents => prevStudents.map(s => s._id === id ? { ...s, placement_status: newStatus } : s));
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status.");
        }
    };

    const exportTopResumes = () => {
        const topStudents = students.filter(s => (s.resume_score || 0) > 80);
        if (topStudents.length === 0) {
            alert('No students scoring above 80 found.');
            return;
        }

        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("Top Ready Candidates Report", 14, 22);
        
        const tableColumn = ["Name", "Department", "Resume Score", "Key Skills"];
        const tableRows = [];

        topStudents.forEach(student => {
            const studentData = [
                student.name,
                student.department || 'General',
                (student.resume_score || 0) + '%',
                (student.skills || []).join(', ')
            ];
            tableRows.push(studentData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save("top_candidates_report.pdf");
    };

    if (loading) {
        return <div className="p-8 text-center animate-pulse text-indigo-500 font-bold">Loading Placement Data...</div>;
    }

    // Calculations
    const totalWithScore = students.filter(s => (s.resume_score || 0) > 0);
    const avgScore = totalWithScore.length > 0 ? Math.round(totalWithScore.reduce((acc, curr) => acc + (curr.resume_score || 0), 0) / totalWithScore.length) : 0;
    const readyCount = students.filter(s => (s.resume_score || 0) > 80).length;
    const placedCount = students.filter(s => s.placement_status === 'Placed').length;

    // Skill frequencies
    const skillCounts = {};
    students.forEach(s => {
        (s.skills || []).forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
    });

    const sortedSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    const topSkill = sortedSkills.length > 0 ? sortedSkills[0].name : 'N/A';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0] flex items-center gap-2">
                        <Briefcase className="text-indigo-600 dark:text-indigo-400" /> Placement Hub
                    </h2>
                    <p className="text-slate-500 dark:text-[#a0aec0] mt-1 text-sm">Analyze batch readiness, track top skills, and export highly-ready candidate resumes.</p>
                </div>
                <button
                    onClick={exportTopResumes}
                    className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold font-sm hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                    <Download size={18} />
                    Export Top Resumes
                </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-sm border border-slate-200 dark:border-[#333] p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-[#a0aec0] uppercase tracking-wider">Batch Readiness</p>
                            <h3 className="text-3xl font-black text-slate-800 dark:text-[#e0e0e0] mt-1">{avgScore}%</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Award size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-blue-600 font-medium">Average Resume Score (AI)</p>
                </div>

                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-sm border border-slate-200 dark:border-[#333] p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-[#a0aec0] uppercase tracking-wider">Top Skill</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0] mt-1 truncate max-w-[150px]">{topSkill}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <Star size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-purple-600 font-medium">Most detected across batch</p>
                </div>

                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-sm border border-slate-200 dark:border-[#333] p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-[#a0aec0] uppercase tracking-wider">Placed / Ready</p>
                            <h3 className="text-3xl font-black text-slate-800 dark:text-[#e0e0e0] mt-1">{placedCount} / {readyCount}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600 font-medium">Students scoring &gt; 80</p>
                </div>
            </div>

            {/* Layout Grid for Chart and Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Skill Gap Chart */}
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-sm border border-slate-200 dark:border-[#333] p-6 lg:col-span-1">
                    <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] mb-6 text-lg">Top Technical Skills</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sortedSkills} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={90} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Readiness Table */}
                <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-sm border border-slate-200 dark:border-[#333] lg:col-span-2 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-[#333] pb-4">
                        <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] text-lg">Student Readiness Tracking</h3>
                        <p className="text-sm text-slate-500 dark:text-[#a0aec0]">Breakdown of individual resume parsing scores.</p>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#121212] text-slate-500 dark:text-[#a0aec0] text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-[#333]">Name</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-[#333]">Department</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-[#333] text-center">Score</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-[#333]">Key Skills</th>
                                    <th className="px-6 py-4 font-semibold border-b border-slate-200 dark:border-[#333]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#333]">
                                {students.map((student) => {
                                    let badgeColor = '';
                                    let badgeText = '';
                                    
                                    if ((student.resume_score || 0) > 80) {
                                        badgeColor = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                                        badgeText = 'Highly Ready';
                                    } else if ((student.resume_score || 0) >= 50) {
                                        badgeColor = 'bg-amber-100 text-amber-700 border-amber-200';
                                        badgeText = 'Developing';
                                    } else {
                                        badgeColor = 'bg-rose-100 text-rose-700 border-rose-200';
                                        badgeText = 'Needs Work';
                                    }

                                    return (
                                        <tr key={student._id || student.id} className="hover:bg-slate-50 dark:bg-[#121212] transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-[#e0e0e0]">{student.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-[#a0aec0]">{student.department || 'General'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-center">
                                                <span className={`px-2 py-1 rounded-md text-xs ${(student.resume_score || 0) > 80 ? 'text-emerald-700 bg-emerald-50' : (student.resume_score || 0) >= 50 ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50' }`}>
                                                    {(student.resume_score || 0)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-[#a0aec0]">
                                                <div className="flex flex-wrap gap-1">
                                                    {(student.skills || []).map((sk, idx) => (
                                                        <span key={idx} className="bg-slate-100 dark:bg-[#2a2a2a] text-slate-600 dark:text-[#a0aec0] px-2 py-0.5 rounded text-[10px] whitespace-nowrap">{sk}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap flex flex-row gap-2 items-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                                                    {badgeText}
                                                </span>
                                                <select
                                                    value={student.placement_status === 'Placed' ? 'Placed' : 'Open for Hire'}
                                                    onChange={(e) => handleStatusChange(student._id || student.id, student.name, e.target.value)}
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border appearance-none cursor-pointer outline-none transition-colors ${
                                                        student.placement_status === 'Placed'
                                                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    <option value="Open for Hire">Open for Hire</option>
                                                    <option value="Placed">Placed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                            No student records found to analyze.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacementHub;
