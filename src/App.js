import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Grades from './pages/Grades';
import PlacementHub from './pages/PlacementHub';
import AdminSettings from './pages/AdminSettings';
// Student Imports
import StudentLayout from './components/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentMarks from './pages/student/StudentMarks';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentProfile from './pages/student/StudentProfile';
import StudentResume from './pages/student/StudentResume';



// Protected Route Components
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('userRole');
  if (role !== 'admin' && role !== 'instructor') {
    return (
      <div style={{ padding: '50px', backgroundColor: 'red', color: 'white', textAlign: 'center' }}>
        <h1>AUTH FAILED. You were kicked out!</h1>
        <h2>Current Role in LocalStorage: "{role}"</h2>
      </div>
    );
  }
  return children;
};

const StudentRoute = ({ children }) => {
  const role = localStorage.getItem('userRole');
  if (role !== 'student') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><MainLayout /></AdminRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="courses" element={<Courses />} />
            <Route path="grades" element={<Grades />} />
            <Route path="placement" element={<PlacementHub />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<StudentRoute><StudentLayout /></StudentRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="marks" element={<StudentMarks />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="resume" element={<StudentResume />} />
            <Route path="notifications" element={<StudentNotifications />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          <Route path="*" element={(
            <div style={{ padding: '50px', backgroundColor: 'purple', color: 'white', textAlign: 'center' }}>
              <h1>404 ROUTE NOT FOUND. React Router failed to match the link you clicked.</h1>
              <h2>You clicked a link that goes nowhere!</h2>
            </div>
          )} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
