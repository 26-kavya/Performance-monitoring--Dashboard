import React, { useState, useRef } from 'react';
import { User, Mail, Hash, Book, Building, Github, Linkedin, Edit2, Save, X, Camera, Code } from 'lucide-react';

const StudentProfile = () => {
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Default data structure acting as our source of truth
    const [profileData, setProfileData] = useState({
        name: localStorage.getItem('userName') || 'Student Name',
        email: localStorage.getItem('userEmail') || 'student@university.edu',
        bio: 'Passionate computer science student deeply interested in Full Stack Development and AI. Always eager to learn new technologies and build impactful applications.',
        linkedin: 'https://linkedin.com/in/student',
        github: 'https://github.com/student',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'Git'],
        registerNo: 'REG2023001',
        department: 'Computer Science & Engineering',
        semester: '4th Semester',
        profilePic: null
    });

    const [editForm, setEditForm] = useState({ ...profileData });

    const handleSave = () => {
        setProfileData(editForm);
        setIsEditing(false);
        // Persist email changes manually if they happen
        if(editForm.email !== profileData.email) localStorage.setItem('userEmail', editForm.email);
    };

    const handleCancel = () => {
        setEditForm({ ...profileData });
        setIsEditing(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const picString = reader.result;
                setProfileData(prev => ({ ...prev, profilePic: picString }));
                setEditForm(prev => ({ ...prev, profilePic: picString }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">My Profile</h2>
                    <p className="text-slate-500 dark:text-[#a0aec0]">View and verify your personal academic details.</p>
                </div>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border border-slate-200 dark:border-[#333] text-slate-700 dark:text-[#e0e0e0] font-medium px-4 py-2 rounded-lg hover:bg-slate-50 dark:bg-[#121212] transition-colors shadow-sm"
                    >
                        <Edit2 size={16} /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button 
                            onClick={handleCancel}
                            className="flex items-center gap-2 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] border border-slate-200 dark:border-[#333] text-slate-500 dark:text-[#a0aec0] font-medium px-4 py-2 rounded-lg hover:bg-slate-50 dark:bg-[#121212] transition-colors shadow-sm"
                        >
                            <X size={16} /> Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <Save size={16} /> Save
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm overflow-hidden">
                <div className="bg-indigo-600 dark:bg-indigo-500 h-32 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-white dark:bg-[#1e1e1e] dark:border-[#333333] overflow-hidden shadow-md flex items-center justify-center text-slate-300 relative">
                                {profileData.profilePic ? (
                                    <img src={profileData.profilePic} alt="Profile Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} />
                                )}
                            </div>
                            
                            {/* Upload Trigger */}
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-1 -right-1 bg-slate-800 text-white p-2 rounded-full border-2 border-white shadow-sm hover:bg-slate-700 transition-colors z-10"
                                title="Change Profile Picture"
                            >
                                <Camera size={14} />
                            </button>
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0]">{profileData.name}</h3>
                    <p className="text-slate-500 dark:text-[#a0aec0] font-medium">{profileData.department}</p>
                    
                    {/* Bio Section */}
                    <div className="mt-4">
                        {isEditing ? (
                            <textarea 
                                value={editForm.bio}
                                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-600 dark:text-[#a0aec0] text-sm"
                                rows="3"
                                placeholder="Write a short bio about yourself..."
                            />
                        ) : (
                            <p className="text-slate-600 dark:text-[#a0aec0] text-sm max-w-2xl leading-relaxed">
                                {profileData.bio}
                            </p>
                        )}
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 pt-6 border-t border-slate-100 dark:border-[#333]">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Register Number</label>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-[#e0e0e0] font-medium bg-slate-50 dark:bg-[#121212] p-2.5 rounded-lg border border-slate-100 dark:border-[#333]">
                                <Hash size={18} className="text-indigo-500" />
                                {profileData.registerNo}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Semester</label>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-[#e0e0e0] font-medium bg-slate-50 dark:bg-[#121212] p-2.5 rounded-lg border border-slate-100 dark:border-[#333]">
                                <Book size={18} className="text-indigo-500" />
                                {profileData.semester}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                Email Address & Socials
                            </label>
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <div className="relative w-full">
                                        <Mail size={18} className="text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input 
                                            type="email" 
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                            className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 dark:text-[#e0e0e0] font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between text-slate-700 dark:text-[#e0e0e0] font-medium bg-slate-50 dark:bg-[#121212] p-2.5 rounded-lg border border-slate-100 dark:border-[#333]">
                                    <div className="flex items-center gap-2 truncate">
                                        <Mail size={18} className="text-indigo-500 shrink-0" />
                                        <span className="truncate">{profileData.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 border-l border-slate-300 pl-3 shrink-0">
                                        <a href={profileData.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#0a66c2] transition-colors" title="LinkedIn">
                                            <Linkedin size={18} />
                                        </a>
                                        <a href={profileData.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:text-[#e0e0e0] transition-colors" title="GitHub">
                                            <Github size={18} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-[#e0e0e0] font-medium bg-slate-50 dark:bg-[#121212] p-2.5 rounded-lg border border-slate-100 dark:border-[#333]">
                                <Building size={18} className="text-indigo-500" />
                                {profileData.department}
                            </div>
                        </div>
                    </div>

                    {/* Technical Skills Section */}
                    <div className="mt-10 pt-6 border-t border-slate-100 dark:border-[#333]">
                        <div className="flex items-center gap-2 mb-4">
                            <Code size={20} className="text-indigo-600 dark:text-indigo-400" />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-[#e0e0e0]">Technical Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profileData.skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 rounded-full text-sm font-medium shadow-sm flex items-center gap-1.5 transition-colors hover:bg-indigo-100 cursor-default">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                    {skill}
                                </span>
                            ))}
                            {isEditing && (
                                <button className="px-3 py-1 bg-slate-50 dark:bg-[#121212] text-slate-500 dark:text-[#a0aec0] border border-dashed border-slate-300 rounded-full text-sm font-medium hover:bg-slate-100 dark:bg-[#2a2a2a] hover:text-slate-700 dark:text-[#e0e0e0] transition-colors">
                                    + Add Skill
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
