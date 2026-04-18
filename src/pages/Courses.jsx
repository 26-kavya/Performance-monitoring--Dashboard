import React, { useState } from 'react';
import { Search, Filter, BookOpen, User, Calendar, Plus, Trash2 } from 'lucide-react';

const Courses = () => {
    // Mock Data for Courses
    const initialCourses = [
        {
            id: 1,
            code: 'CS101',
            name: 'Introduction to Computer Science',
            instructor: 'Dr. Sarah Wilson',
            credits: 4,
            semester: 'Sem 1',
            status: 'Completed',
            progress: 100,
            color: 'from-blue-500 to-indigo-600',
            iconColor: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100'
        },
        {
            id: 2,
            code: 'MATH101',
            name: 'Calculus I',
            instructor: 'Prof. James Miller',
            credits: 3,
            semester: 'Sem 1',
            status: 'Completed',
            progress: 100,
            color: 'from-emerald-500 to-teal-600',
            iconColor: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100'
        },
        {
            id: 3,
            code: 'CS201',
            name: 'Data Structures & Algorithms',
            instructor: 'Dr. Alan Grant',
            credits: 4,
            semester: 'Sem 2',
            status: 'In Progress',
            progress: 65,
            color: 'from-violet-500 to-purple-600',
            iconColor: 'text-violet-600',
            bg: 'bg-violet-50',
            border: 'border-violet-100'
        },
        {
            id: 4,
            code: 'ENG210',
            name: 'Technical Writing',
            instructor: 'Ms. Emily Chen',
            credits: 2,
            semester: 'Sem 2',
            status: 'In Progress',
            progress: 40,
            color: 'from-amber-400 to-orange-500',
            iconColor: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100'
        },
        {
            id: 5,
            code: 'DB301',
            name: 'Database Management Systems',
            instructor: 'Dr. Michael Chang',
            credits: 4,
            semester: 'Sem 3',
            status: 'Upcoming',
            progress: 0,
            color: 'from-cyan-500 to-blue-600',
            iconColor: 'text-cyan-600',
            bg: 'bg-cyan-50',
            border: 'border-cyan-100'
        },
        {
            id: 6,
            code: 'AI401',
            name: 'Artificial Intelligence',
            instructor: 'Dr. Sarah Wilson',
            credits: 4,
            semester: 'Sem 4',
            status: 'Upcoming',
            progress: 0,
            color: 'from-rose-500 to-pink-600',
            iconColor: 'text-rose-600',
            bg: 'bg-rose-50',
            border: 'border-rose-100'
        }
    ];

    const [courses, setCourses] = useState(initialCourses);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('All');
    
    // Add/Delete State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ code: '', name: '', instructor: '', credits: 3, semester: 'Sem 1' });

    const handleDeleteCourse = (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    const handleAddCourse = (e) => {
        e.preventDefault();
        const nextId = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
        const colorPalette = [
            'from-indigo-500 to-purple-600',
            'from-rose-400 to-red-500',
            'from-emerald-400 to-cyan-500',
            'from-amber-400 to-orange-500',
            'from-fuchsia-500 to-pink-600'
        ];
        const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        const courseToAdd = {
            id: nextId,
            ...newCourse,
            status: 'Upcoming',
            progress: 0,
            color: randomColor,
        };
        setCourses([...courses, courseToAdd]);
        setIsAddModalOpen(false);
        setNewCourse({ code: '', name: '', instructor: '', credits: 3, semester: 'Sem 1' });
    };

    // Filter Logic
    const filteredCourses = courses.filter(course => {
        const matchesSearch =
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSemester = selectedSemester === 'All' || course.semester === selectedSemester;

        return matchesSearch && matchesSemester;
    });



    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">My Courses</h1>
                    <p className="text-slate-500 dark:text-[#a0aec0] mt-1">Manage your academic journey and track progress</p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium whitespace-nowrap">
                        <Plus size={18} /> Add Course
                    </button>
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 dark:border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64 transition-all shadow-sm focus:shadow-md"
                        />
                    </div>

                    <div className="relative group w-full sm:w-auto">
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="w-full sm:w-auto appearance-none pl-10 pr-8 py-2 border border-slate-200 dark:border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] cursor-pointer hover:bg-slate-50 dark:bg-[#121212] transition-colors shadow-sm"
                        >
                            <option value="All">All Semesters</option>
                            <option value="Sem 1">Semester 1</option>
                            <option value="Sem 2">Semester 2</option>
                            <option value="Sem 3">Semester 3</option>
                            <option value="Sem 4">Semester 4</option>
                            <option value="Sem 5">Semester 5</option>
                            <option value="Sem 6">Semester 6</option>
                            <option value="Sem 7">Semester 7</option>
                            <option value="Sem 8">Semester 8</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={18} />
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative cursor-pointer flex flex-col h-full bg-gradient-to-br ${course.color}`}
                        >
                            {/* Decorative Icon */}
                            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                                <BookOpen size={150} className="text-white" />
                            </div>

                            {/* Header */}
                            <div className="p-6 relative z-10 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20 shadow-sm">
                                        {course.code}
                                    </span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }} 
                                        className="text-white/70 hover:text-red-200 transition-colors p-1.5 rounded-full hover:bg-white/10 z-20 relative"
                                        title="Delete Course"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <h3 className="text-2xl font-bold text-white leading-tight mb-1 drop-shadow-md">
                                    {course.name}
                                </h3>
                            </div>

                            {/* Body */}
                            <div className="px-6 pb-6 flex-1 flex flex-col relative z-10">
                                {/* Instructor */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 shadow-sm">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-50/80 font-medium uppercase tracking-wide">Instructor</p>
                                        <p className="text-sm font-semibold text-white tracking-wide">{course.instructor}</p>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="mb-6 mt-auto">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm text-blue-50 font-medium">Progress</span>
                                        <span className="text-lg font-bold text-white">
                                            {course.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden backdrop-blur-sm border border-white/10">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 ease-out bg-white dark:bg-[#1e1e1e] dark:border-[#333333] shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-sm text-white font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                                        <Calendar size={14} />
                                        <span>{course.semester}</span>
                                    </div>
                                    <div className={`px-3 py-1.5 text-xs font-bold rounded-lg backdrop-blur-sm shadow-sm
                                        ${course.status === 'Completed' ? 'bg-emerald-400/20 text-emerald-50 border border-emerald-400/30' :
                                            course.status === 'In Progress' ? 'bg-blue-400/20 text-blue-50 border border-blue-400/30' :
                                                'bg-slate-400/20 text-slate-50 border border-slate-400/30'}`}>
                                        {course.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-[#121212] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-700 dark:text-[#e0e0e0]">No courses found</h3>
                        <p className="text-slate-500 dark:text-[#a0aec0]">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Add Course Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-[#e0e0e0] mb-6">Add New Course</h2>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Course Name</label>
                                <input required type="text" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Machine Learning" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Course Code</label>
                                    <input required type="text" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. CS401" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Credits</label>
                                    <input required type="number" min="1" max="6" value={newCourse.credits} onChange={e => setNewCourse({...newCourse, credits: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Instructor</label>
                                <input required type="text" value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Dr. John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-[#e0e0e0] mb-1">Semester</label>
                                <select value={newCourse.semester} onChange={e => setNewCourse({...newCourse, semester: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map(sem => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-[#333]">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-[#a0aec0] hover:bg-slate-100 dark:bg-[#2a2a2a] rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors">Add Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;
