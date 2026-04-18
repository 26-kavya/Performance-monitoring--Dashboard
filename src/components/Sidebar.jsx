import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { LayoutDashboard, Users, BookOpen, GraduationCap, Briefcase, Settings, LogOut } from 'lucide-react';

import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { settings } = useContext(SettingsContext);
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = React.useState(null);
    const fileInputRef = React.useRef(null);
    const [isUploading, setIsUploading] = React.useState(false);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Import dynamically to avoid issues if service isn't ready
            const { uploadImage } = await import('../services/cloudinaryService');
            const data = await uploadImage(file);
            setProfileImage(data.url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Students', path: '/admin/students' },
        { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
        { icon: GraduationCap, label: 'Grades', path: '/admin/grades' },
        { icon: Briefcase, label: 'Placement Hub', path: '/admin/placement' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="w-64 bg-gradient-to-b from-[#B76E79] to-[#9e5d69] border-r border-[#8a4f5a] h-screen flex flex-col fixed left-0 top-0 z-50 shadow-lg">
            <div className="p-6 flex items-center gap-3">
                <div className="relative group">
                    <div
                        className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden shadow-inner backdrop-blur-sm transform transition-transform hover:scale-105"
                        onClick={() => fileInputRef.current.click()}
                        title="Click to change avatar"
                    >
                        {isUploading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white font-bold text-lg">E</span>
                        )}
                    </div>
                    {/* Edit Overlay */}
                    <div
                        className="absolute inset-0 bg-black/40 rounded-lg hidden group-hover:flex items-center justify-center cursor-pointer transition-opacity"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <span className="text-[10px] text-white font-medium uppercase tracking-wide">Edit</span>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                />
                <span className="text-xl font-bold text-white tracking-tight drop-shadow-sm">{settings?.institutionName || 'EduTrack'}</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isActive
                                ? 'bg-white/20 text-white shadow-sm font-semibold'
                                : 'text-white/70 hover:bg-white/10 hover:text-white font-medium'}`}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={isActive ? "text-white" : "text-white/70 group-hover:text-white transition-colors"} />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
