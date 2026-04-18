import React, { useState } from 'react';
import { Check, Target, Cpu, Trophy, ExternalLink, Briefcase } from 'lucide-react';

const CareerRoadmap = () => {
    const [activePopup, setActivePopup] = useState(null);

    const togglePopup = (id) => {
        if (activePopup === id) setActivePopup(null);
        else setActivePopup(id);
    };

    const roadmapData = [
        {
            id: 1,
            title: 'Academic Basics',
            status: 'Completed',
            desc: 'Based on Sem 1-3 fundamentals.',
            icon: Check,
            nodeColor: 'bg-emerald-500',
            statusColor: 'text-emerald-700 bg-emerald-100',
            lineColor: 'bg-indigo-500 shadow-[0_0_8px_1px_rgba(99,102,241,0.6)] z-0', // Glowing line
            suggestions: [
                { name: 'Review Data Structures Checklist', url: '#' },
                { name: 'OOP Fundamentals Masterclass', url: '#' }
            ]
        },
        {
            id: 2,
            title: 'Current Focus',
            status: 'Active',
            desc: 'Sem 4 Subject Syllabus Tracking.',
            icon: Target,
            isPulsating: true,
            nodeColor: 'bg-indigo-600 dark:bg-indigo-500',
            statusColor: 'text-indigo-700 dark:text-indigo-300 bg-indigo-100',
            lineColor: 'bg-slate-200 z-0',
            suggestions: [
                { name: 'Advanced React Patterns (Udemy)', url: '#' },
                { name: 'College Library: Algorithms Deep Dive', url: '#' }
            ]
        },
        {
            id: 3,
            title: 'Skill Gap - AI Suggestion',
            status: 'Recommended',
            desc: 'Missing from Resume: Docker & CI/CD',
            icon: Cpu,
            nodeColor: 'bg-slate-300 text-slate-600 dark:text-[#a0aec0]',
            statusColor: 'text-slate-600 dark:text-[#a0aec0] bg-slate-100 dark:bg-[#2a2a2a]',
            lineColor: 'bg-slate-200 z-0',
            suggestions: [
                { name: 'Docker for Beginners (Coursera)', url: '#' },
                { name: 'AWS Cloud Practitioner Crash Course', url: '#' }
            ]
        },
        {
            id: 4,
            title: 'Placement Ready',
            status: 'Career Goal',
            desc: 'Final target timeline alignment.',
            icon: Trophy,
            nodeColor: 'bg-slate-300 text-slate-600 dark:text-[#a0aec0]',
            statusColor: 'text-slate-600 dark:text-[#a0aec0] bg-slate-100 dark:bg-[#2a2a2a]',
            isLast: true,
            suggestions: [
                { name: 'Cracking the Coding Interview Guide', url: '#' },
                { name: 'Campus Mock Interview Portal', url: '#' }
            ]
        }
    ];

    return (
        <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-sm border border-slate-100 dark:border-[#333] p-6 md:p-8 animate-in fade-in duration-500 mt-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-[#333] pb-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Briefcase size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-xl text-slate-800 dark:text-[#e0e0e0]">Personalized Career Roadmap</h3>
                    <p className="text-sm text-slate-500 dark:text-[#a0aec0]">Track your progress and close skill gaps tailored to your goals.</p>
                </div>
            </div>

            <div className="relative pl-6 md:pl-8 py-2">
                {roadmapData.map((node) => (
                    <div key={node.id} className="relative mb-12 last:mb-0">
                        {/* Connecting Line */}
                        {!node.isLast && (
                            <div className={`absolute top-10 left-[15px] w-0.5 h-full md:h-[120%] -ml-[1px] ${node.lineColor} transition-all duration-500`}></div>
                        )}
                        
                        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 relative">
                            {/* Visual Node */}
                            <div 
                                className="relative z-10 flex-shrink-0 cursor-pointer mt-1" 
                                onClick={() => togglePopup(node.id)}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white relative shadow-sm ${node.nodeColor} ${node.isPulsating ? 'ring-4 ring-indigo-100' : ''}`}>
                                    {node.isPulsating && (
                                        <span className="absolute flex h-full w-full">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        </span>
                                    )}
                                    <node.icon size={16} className="relative z-10" color={node.id >= 3 ? '#475569' : '#ffffff'} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div 
                                    className="cursor-pointer group flex flex-wrap items-center gap-3" 
                                    onClick={() => togglePopup(node.id)}
                                >
                                    <h4 className="font-bold text-slate-800 dark:text-[#e0e0e0] text-lg group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">{node.title}</h4>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${node.statusColor}`}>
                                        {node.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-[#a0aec0] mt-1 cursor-pointer" onClick={() => togglePopup(node.id)}>{node.desc}</p>

                                {/* Collapsible popover content */}
                                {activePopup === node.id && (
                                    <div className="mt-4 p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl animate-in slide-in-from-top-2 shadow-sm relative w-full md:max-w-xl">
                                        <div className="absolute -top-2 left-6 md:left-24 w-4 h-4 bg-indigo-50 dark:bg-indigo-900/30 border-t border-l border-indigo-100 rotate-45"></div>
                                        <h5 className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest mb-3 relative z-10 flex items-center gap-2">
                                            Suggested Courses & Resources
                                        </h5>
                                        <ul className="space-y-2.5 relative z-10">
                                            {node.suggestions.map((sug, idx) => (
                                                <li key={idx}>
                                                    <a href={sug.url} onClick={(e) => e.preventDefault()} className="text-sm font-semibold text-slate-700 dark:text-[#e0e0e0] hover:text-indigo-600 dark:text-indigo-400 flex items-center gap-2.5 transition-colors bg-white/60 hover:bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-2 rounded-lg border border-transparent hover:border-indigo-100">
                                                        <div className="p-1.5 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-md shadow-sm">
                                                            <ExternalLink size={14} className="text-indigo-500" />
                                                        </div>
                                                        {sug.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerRoadmap;
