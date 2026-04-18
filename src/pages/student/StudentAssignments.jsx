import React, { useState, useRef, useEffect } from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

const SubmitButton = ({ assignmentId, onSuccess }) => {
    const fileInputRef = useRef(null);
    const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'success'

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setStatus('uploading');
            setTimeout(() => {
                setStatus('success');
                onSuccess(assignmentId);
            }, 2000);
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    if (status === 'success') {
        return (
            <button className="flex items-center gap-1 px-4 py-2 bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 text-sm rounded-lg cursor-default transition-all duration-300">
                <CheckCircle size={16} /> Success
            </button>
        );
    }

    if (status === 'uploading') {
        return (
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg cursor-wait opacity-90 transition-all" disabled>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Uploading...
            </button>
        );
    }

    return (
        <>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.docx,.zip" 
                onChange={handleFileChange} 
            />
            <button 
                onClick={handleClick}
                className="px-4 py-2 bg-[#4F46E5] text-white text-sm font-medium rounded-lg hover:bg-opacity-90 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
            >
                Submit Now
            </button>
        </>
    );
};

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/performance/student/assignments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-user-id': localStorage.getItem('userId'),
                        'x-user-role': localStorage.getItem('userRole')
                    }
                });
                setAssignments(res.data);
            } catch (err) {
                console.error("Error fetching assignments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    const handleSubmissionSuccess = async (id) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.patch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/performance/student/assignments/${id}`, 
                { status: 'Submitted' },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-user-id': localStorage.getItem('userId'),
                        'x-user-role': localStorage.getItem('userRole')
                    }
                }
            );

            // Immediately update the status badge to 'Submitted', hiding this button
            setAssignments(prev => prev.map(item => 
                item._id === id ? { ...item, status: 'Submitted' } : item
            ));
        } catch (err) {
            console.error("Failed to update status in DB:", err);
        }
    };

    const handleUnsubmit = async (id) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.patch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/performance/student/assignments/${id}`, 
                { status: 'Pending' },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-user-id': localStorage.getItem('userId'),
                        'x-user-role': localStorage.getItem('userRole')
                    }
                }
            );

            setAssignments(prev => prev.map(item => 
                item._id === id ? { ...item, status: 'Pending' } : item
            ));
        } catch (err) {
            console.error("Failed to update status in DB:", err);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500 dark:text-[#a0aec0] animate-pulse">Loading assignments...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">Assignments & Tasks</h2>
                <p className="text-slate-500 dark:text-[#a0aec0]">Track upcoming deadlines and submitted work.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map(item => (
                    <div key={item._id || item.id} className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm p-5 hover:shadow-md transition-shadow relative">
                        <div className="flex justify-between items-start mb-3">
                            <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-[#2a2a2a] text-xs font-bold text-slate-600 dark:text-[#a0aec0] uppercase tracking-wide">
                                {item.subject}
                            </span>
                            {item.status === 'Pending' && <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full"><Clock size={12} /> Pending</span>}
                            {item.status === 'Submitted' && <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full"><CheckCircle size={12} /> Submitted</span>}
                            {item.status === 'Graded' && <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full"><CheckCircle size={12} /> {item.marks}</span>}
                        </div>

                        <h3 className="font-bold text-slate-800 dark:text-[#e0e0e0] mb-2">{item.title}</h3>

                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#a0aec0] mb-4">
                            <Calendar size={16} />
                            <span>Due: {item.dueDate}</span>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-[#333] flex justify-end gap-2">
                            {item.status === 'Pending' && (
                                <SubmitButton assignmentId={item._id} onSuccess={handleSubmissionSuccess} />
                            )}
                            {item.status === 'Submitted' && (
                                <>
                                    <button onClick={() => handleUnsubmit(item._id)} className="px-4 py-2 border border-slate-200 dark:border-[#333] text-slate-600 dark:text-[#a0aec0] text-sm font-medium rounded-lg hover:bg-slate-50 dark:bg-[#121212] transition-colors">
                                        Un-submit
                                    </button>
                                    <button className="px-4 py-2 bg-slate-100 dark:bg-[#2a2a2a] text-slate-600 dark:text-[#a0aec0] text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                                        View Details
                                    </button>
                                </>
                            )}
                            {item.status === 'Graded' && (
                                <button className="px-4 py-2 bg-slate-100 dark:bg-[#2a2a2a] text-slate-600 dark:text-[#a0aec0] text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                                    View Details
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentAssignments;
