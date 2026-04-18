import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import axios from 'axios';

const SendNotificationModal = ({ isOpen, onClose, onActionComplete }) => {
    const initialFormState = {
        title: '',
        message: '',
        type: 'info',
        recipientType: 'All Students',
        department: 'Computer Science', // default
        recipientIds: [],
    };

    const [formData, setFormData] = useState(initialFormState);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch students to populate the specific selected students multi-picker
        if (isOpen && formData.recipientType === 'Selected Students') {
            const fetchStudents = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students`);
                    setStudents(res.data);
                } catch (err) {
                    console.error("Failed to fetch students:", err);
                }
            };
            fetchStudents();
        }
    }, [isOpen, formData.recipientType]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStudentSelect = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, recipientIds: selectedOptions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications`, formData);
            alert('Notification successfully broadcasted!');
            setFormData(initialFormState);
            onClose();
            if (onActionComplete) onActionComplete();
        } catch (error) {
            console.error("Failed to push notification:", error);
            const errorMsg = error.response?.data?.message || 'Server error';
            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl shadow-xl w-full max-w-lg mt-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-[#e0e0e0] flex items-center gap-2">
                        <Send size={20} className="text-indigo-600 dark:text-indigo-400" /> Let's Broadcast
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-[#a0aec0]">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Targeting Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Target Audience</label>
                            <select 
                                name="recipientType" 
                                value={formData.recipientType} 
                                onChange={handleChange} 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-[#1e1e1e] dark:border-[#333333]"
                            >
                                <option value="All Students">All Students</option>
                                <option value="Specific Department">Specific Department</option>
                                <option value="Selected Students">Selected Students</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Alert Color / Type</label>
                            <select 
                                name="type" 
                                value={formData.type} 
                                onChange={handleChange} 
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-[#1e1e1e] dark:border-[#333333]
                                    ${formData.type === 'info' ? 'border-blue-300 text-blue-700 focus:ring-blue-500' : ''}
                                    ${formData.type === 'warning' ? 'border-red-300 text-red-700 focus:ring-red-500' : ''}
                                    ${formData.type === 'success' ? 'border-emerald-300 text-emerald-700 focus:ring-emerald-500' : ''}
                                `}
                            >
                                <option value="info">Info (Blue)</option>
                                <option value="warning">Warning/Alert (Red)</option>
                                <option value="success">Success (Green)</option>
                            </select>
                        </div>
                    </div>

                    {/* Conditional Selectors */}
                    {formData.recipientType === 'Specific Department' && (
                        <div className="animate-in fade-in duration-300">
                            <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Select Department</label>
                            <select 
                                name="department" 
                                value={formData.department} 
                                onChange={handleChange} 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-[#1e1e1e] dark:border-[#333333]"
                            >
                                <option value="Computer Science">Computer Science</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Business">Business</option>
                                <option value="Arts">Arts</option>
                            </select>
                        </div>
                    )}

                    {formData.recipientType === 'Selected Students' && (
                        <div className="animate-in fade-in duration-300">
                            <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Select Individual Students <span className="text-xs text-slate-400 font-normal">(Hold Ctrl/Cmd to select multiple)</span></label>
                            <select 
                                multiple 
                                name="recipientIds" 
                                value={formData.recipientIds} 
                                onChange={handleStudentSelect} 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-[#121212] min-h-[120px]"
                                required
                            >
                                {students.length === 0 ? <option disabled>Loading students...</option> : null}
                                {students.map(student => (
                                    <option key={student._id} value={student._id} className="p-1 border-b border-slate-100 dark:border-[#333] last:border-0 hover:bg-indigo-50 dark:bg-indigo-900/30">
                                        {student.name} ({student.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Notification Title</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                            placeholder="e.g. Server Maintenance Notice"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Message Detail</label>
                        <textarea 
                            name="message" 
                            value={formData.message} 
                            onChange={handleChange} 
                            required 
                            rows="4"
                            placeholder="Write your broadcast message here..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" 
                        ></textarea>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-2 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2
                                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 hover:shadow-lg shadow-indigo-500/30'}
                            `}
                        >
                            {loading ? (
                                <>Sending...</>
                            ) : (
                                <>Broadcast Now <Send size={16} /></>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SendNotificationModal;
