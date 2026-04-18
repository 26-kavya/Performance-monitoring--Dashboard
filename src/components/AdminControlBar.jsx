import React, { useState, useRef } from 'react';
import { Download, Upload, UserPlus, X, BellPlus } from 'lucide-react';
import axios from 'axios';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SendNotificationModal from './SendNotificationModal';

const AdminControlBar = ({ onActionComplete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
    const initialFormState = {
        name: '',
        email: '',
        gpa: '',
        attendance: '',
        department: 'Computer Science',
        marks: {
            Maths: '',
            Science: '',
            English: '',
            History: '',
            Art: '',
            CS: ''
        }
    };
    const [formData, setFormData] = useState(initialFormState);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMarkChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            marks: {
                ...formData.marks,
                [name]: value
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert marks to numbers
            const formattedMarks = {};
            Object.keys(formData.marks).forEach(key => {
                if (formData.marks[key]) {
                    formattedMarks[key] = Number(formData.marks[key]);
                }
            });

            const payload = {
                ...formData,
                gpa: formData.gpa ? Number(formData.gpa) : 0,
                attendance: Number(formData.attendance),
                marks: formattedMarks
            };

            await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students`, payload);
            alert('Student added successfully!');
            setIsModalOpen(false);
            setFormData(initialFormState);
            if (onActionComplete) onActionComplete();
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to add student';
            alert(`Error: ${errorMsg}`);
        }
    };

    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);

    const processBulkUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rawStudents = results.data;
                const formattedStudents = [];
                // 1. Pre-process and validate locally (optional, but good for data sanitation)
                const parseMark = (val) => {
                    const num = Number(val);
                    return isNaN(num) ? 0 : num;
                };

                for (const student of rawStudents) {
                    // Check for essential fields (adapt as needed)
                    if ((!student.name && !student.Name) || (!student.email && !student.Email)) {
                        continue; // Skip empty/invalid rows locally
                    }

                    const marks = {
                        Maths: parseMark(student.Maths || student.maths),
                        Science: parseMark(student.Science || student.science),
                        English: parseMark(student.English || student.english),
                        History: parseMark(student.History || student.history),
                        Art: parseMark(student.Art || student.art),
                        CS: parseMark(student.CS || student.cs)
                    };
                    // Remove 0 marks to avoid cluttering DB if not present
                    Object.keys(marks).forEach(key => marks[key] === 0 && delete marks[key]);

                    formattedStudents.push({
                        name: student.Name || student.name,
                        email: student.Email || student.email,
                        gpa: Number(student.GPA || student.gpa || 0.0),
                        attendance: Number(student.Attendance || student.attendance || 0),
                        department: student.Department || student.department || 'General',
                        marks: marks
                    });
                }

                if (formattedStudents.length === 0) {
                    alert('No valid student data found in CSV.');
                    return;
                }

                // 2. Send to Backend
                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students/bulk`, formattedStudents);
                    const { successCount, failCount, errors: backendErrors } = response.data;

                    let message = `Bulk Upload Complete.\nSuccess: ${successCount}\nFailed: ${failCount}`;

                    if (backendErrors && backendErrors.length > 0) {
                        message += `\n\nErrors:\n${backendErrors.slice(0, 5).join('\n')}${backendErrors.length > 5 ? '\n...' : ''}`;
                    }

                    alert(message);
                    setIsBulkUploadModalOpen(false);
                    if (onActionComplete) onActionComplete();

                } catch (error) {
                    console.error('Bulk Upload request failed:', error);
                    const errorMsg = error.response?.data?.message || error.message || 'Server error during bulk upload.';
                    alert(`Failed to upload students: ${errorMsg}`);
                }
            },
            error: (error) => {
                console.error('CSV Parsing Error:', error);
                alert('Failed to parse CSV file.');
            }
        });

        // Reset input value so same file can be selected again
        event.target.value = null;
    };

    const handleExportPDF = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/students`);
            const students = res.data;

            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text('Student Performance Report', 14, 22);

            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            const tableColumn = ["Name", "Email", "Department", "GPA", "Attendance (%)"];
            const tableRows = [];

            students.forEach(student => {
                const studentData = [
                    student.name,
                    student.email,
                    student.department || 'General',
                    student.gpa,
                    `${student.attendance}%`,
                ];
                tableRows.push(studentData);
            });

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'grid',
                styles: { fontSize: 10 },
                headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
            });

            doc.save(`student_report_${new Date().toISOString().slice(0, 10)}.pdf`);

        } catch (error) {
            console.error("Export PDF Error:", error);
            alert("Failed to export PDF.");
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-4 rounded-xl border border-slate-100 dark:border-[#333] shadow-sm flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0]">Quick Actions</h2>
                    <p className="text-sm text-slate-500 dark:text-[#a0aec0]">Manage student data and reports</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={processBulkUpload}
                        accept=".csv"
                        className="hidden"
                    />
                    <button
                        onClick={() => setIsBulkUploadModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border border-slate-200 dark:border-[#333] text-slate-700 dark:text-[#e0e0e0] rounded-lg hover:bg-slate-50 dark:bg-[#121212] transition-colors text-sm font-medium"
                    >
                        <Upload size={16} />
                        Bulk Upload
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border border-slate-200 dark:border-[#333] text-slate-700 dark:text-[#e0e0e0] rounded-lg hover:bg-slate-50 dark:bg-[#121212] transition-colors text-sm font-medium"
                    >
                        <Download size={16} />
                        Export PDF
                    </button>
                    <button
                        onClick={() => setIsNotifModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-[#333] bg-white dark:bg-[#1e1e1e] dark:border-[#333333] text-slate-700 dark:text-[#e0e0e0] rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors text-sm font-medium"
                    >
                        <BellPlus size={16} />
                        Send Notification
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm shadow-indigo-200"
                    >
                        <UserPlus size={16} />
                        Add Student
                    </button>
                </div>
            </div>

            {/* Bulk Upload Instructions Modal */}
            {isBulkUploadModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0]">Bulk Upload Students</h3>
                            <button onClick={() => setIsBulkUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-[#a0aec0]">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#333] text-sm text-slate-700 dark:text-[#e0e0e0]">
                                <p className="font-semibold mb-2">Required CSV Format:</p>
                                <p className="mb-2">Headers:</p>
                                <code className="block bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-2 rounded border border-slate-200 dark:border-[#333] font-mono text-xs mb-3 break-all">
                                    Name, Email, GPA, Attendance, Department, Maths, Science, English, History, Art, CS
                                </code>
                                <p className="text-xs text-slate-500 dark:text-[#a0aec0]">
                                    <strong>Note:</strong> Subject marks (Maths, Science...) are used to calculate average performance.
                                    <br />
                                    <strong>GPA:</strong> If left empty, it will be calculated from marks.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsBulkUploadModalOpen(false)}
                                className="flex-1 py-2 border border-slate-200 dark:border-[#333] rounded-lg text-slate-600 dark:text-[#a0aec0] font-medium hover:bg-slate-50 dark:bg-[#121212] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Upload size={18} />
                                Select File
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] p-6 rounded-xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0]">Add New Student</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-[#a0aec0]">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Department</label>
                                <select name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Business">Business</option>
                                    <option value="Arts">Arts</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Attendance (%)</label>
                                    <input type="number" name="attendance" value={formData.attendance} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">GPA (Optional)</label>
                                    <input type="number" step="0.1" name="gpa" value={formData.gpa} onChange={handleChange} placeholder="Auto-calc if empty" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-[#333] pt-4">
                                <h4 className="text-sm font-bold text-slate-700 dark:text-[#e0e0e0] mb-3">Subject Marks (0-100)</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Maths', 'Science', 'English', 'History', 'Art', 'CS'].map((subject) => (
                                        <div key={subject}>
                                            <label className="block text-xs font-medium text-slate-500 dark:text-[#a0aec0] mb-1">{subject}</label>
                                            <input
                                                type="number"
                                                name={subject}
                                                value={formData.marks[subject]}
                                                onChange={handleMarkChange}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-2">
                                Add Student
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <SendNotificationModal isOpen={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} onActionComplete={onActionComplete} />
        </>
    );
};

export default AdminControlBar;
