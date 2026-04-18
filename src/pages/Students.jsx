import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Search, Filter, MoreHorizontal, User } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const Students = () => {
    const { settings } = useContext(SettingsContext);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // All, Active, At Risk
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students`);
                setStudents(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching students:", error);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuId && !event.target.closest('.action-menu-container')) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    const toggleMenu = (id, e) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleEditClick = (student) => {
        setEditingStudent(student);
        setIsEditModalOpen(true);
        setOpenMenuId(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students/${editingStudent._id}`, editingStudent);
            setStudents(students.map(student => (student._id === editingStudent._id ? res.data : student)));
            setIsEditModalOpen(false);
            setEditingStudent(null);
            alert("Student updated successfully!");
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Failed to update student");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students/${id}`);
                setStudents(students.filter(student => student._id !== id));
                setOpenMenuId(null);
            } catch (error) {
                console.error("Error deleting student:", error);
                alert("Failed to delete student");
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 dark:text-[#a0aec0]">Loading students...</div>;

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (filterStatus === 'Active') matchesFilter = student.gpa >= 2.0;
        if (filterStatus === 'At Risk') matchesFilter = student.gpa < 2.0;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">Students</h1>
                    <p className="text-slate-500 dark:text-[#a0aec0]">Manage and view all student records</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50 dark:bg-[#121212] transition-colors ${filterStatus !== 'All' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-[#333] text-slate-600 dark:text-[#a0aec0]'}`}
                        >
                            <Filter size={20} />
                            <span>{filterStatus === 'All' ? 'Filter' : filterStatus}</span>
                        </button>

                        {showFilterMenu && (
                            <div className="absolute right-0 top-12 z-20 w-40 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-lg shadow-lg border border-slate-100 dark:border-[#333] py-1 animate-in fade-in zoom-in-95 duration-200">
                                {['All', 'Active', 'At Risk'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setFilterStatus(status);
                                            setShowFilterMenu(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:bg-[#121212] ${filterStatus === status ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-700 dark:text-[#e0e0e0]'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-200 dark:border-[#333] overflow-hidden shadow-sm h-[calc(100vh-200px)] overflow-y-auto overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-[#121212] z-10 shadow-sm">
                        <tr className="border-b border-slate-200 dark:border-[#333] text-slate-500 dark:text-[#a0aec0] text-sm uppercase">
                            <th className="px-6 py-4 font-semibold">Student</th>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold">GPA</th>
                            <th className="px-6 py-4 font-semibold">Attendance</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#333]">
                        {filteredStudents.map((student) => (
                            <tr key={student._id} className="hover:bg-slate-50 dark:bg-[#121212] transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 dark:text-indigo-400 overflow-hidden">
                                        {student.profilePic && !student.profilePic.includes('anonymous-avatar') ? (
                                            <img src={student.profilePic} alt={student.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={20} />
                                        )}
                                    </div>
                                    <span className="font-medium text-slate-800 dark:text-[#e0e0e0]">{student.name}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-[#a0aec0]">{student.email}</td>
                                <td className="px-6 py-4 font-medium text-slate-800 dark:text-[#e0e0e0]">{student.gpa}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-slate-100 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${student.attendance >= 85 ? 'bg-emerald-500' : student.attendance >= (settings?.minAttendanceLimit || 75) ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${student.attendance}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-slate-500 dark:text-[#a0aec0]">{student.attendance}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.gpa >= 2.0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {student.gpa >= 2.0 ? 'Active' : 'At Risk'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right relative action-menu-container">
                                    <button
                                        onClick={(e) => toggleMenu(student._id, e)}
                                        className="p-1 text-slate-400 hover:text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-slate-100 dark:bg-[#2a2a2a] transition-colors"
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openMenuId === student._id && (
                                        <div className="absolute right-0 top-18 z-50 w-32 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-lg shadow-lg border border-slate-100 dark:border-[#333] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <button
                                                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-[#e0e0e0] hover:bg-slate-50 dark:bg-[#121212] flex items-center gap-2"
                                                onClick={() => handleEditClick(student)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                onClick={() => handleDelete(student._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-[#a0aec0]">
                                    No students found. Add one using the "Add Student" button on the Dashboard.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-[#e0e0e0] mb-4">Edit Student</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editingStudent.name}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editingStudent.email}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">GPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="4.0"
                                        value={editingStudent.gpa}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, gpa: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Attendance (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={editingStudent.attendance}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, attendance: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 dark:text-[#a0aec0] hover:bg-slate-100 dark:bg-[#2a2a2a] rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 rounded-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
