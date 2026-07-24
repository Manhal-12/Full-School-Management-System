import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import CoursesPage from './pages/CoursesPage';
import ClassesPage from './pages/ClassesPage';
import EnrollmentsPage from './pages/EnrollmentsPage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public: Login without navbar */}
        <Route path="/login" element={<LoginPage />} />

        {/* All other routes with navbar */}
        <Route path="*" element={
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/students" element={<PrivateRoute><StudentsPage /></PrivateRoute>} />
              <Route path="/teachers" element={<PrivateRoute><TeachersPage /></PrivateRoute>} />
              <Route path="/courses" element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
              <Route path="/classes" element={<PrivateRoute><ClassesPage /></PrivateRoute>} />
              <Route path="/enrollments" element={<PrivateRoute><EnrollmentsPage /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
            </Routes>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
