import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dataService';
import StatCard from '../components/StatCard';
import { LoadingSpinner } from '../components/StatusComponents';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <div className="text-center py-20"><div className="bg-red-50 text-red-700 p-6 rounded-xl inline-block">{error}</div></div>;
  if (!stats) return null;

  const statsCards = [
    { title: 'Total Students', value: stats.totalStudents, icon: '👩‍🎓', gradient: 'bg-gradient-to-br from-blue-600 to-cyan-500' },
    { title: 'Total Teachers', value: stats.totalTeachers, icon: '👨‍🏫', gradient: 'bg-gradient-to-br from-emerald-600 to-teal-500' },
    { title: 'Total Courses', value: stats.totalCourses, icon: '📚', gradient: 'bg-gradient-to-br from-violet-600 to-purple-500' },
    { title: 'Total Classes', value: stats.totalClasses, icon: '🏫', gradient: 'bg-gradient-to-br from-amber-600 to-orange-500' },
    { title: 'Enrollments', value: stats.totalEnrollments, icon: '📋', gradient: 'bg-gradient-to-br from-rose-600 to-pink-500' },
  ];

  const genderData = [
    { name: 'Male', value: stats.maleStudents, color: '#3b82f6' },
    { name: 'Female', value: stats.femaleStudents, color: '#ec4899' },
  ];

  const barData = [
    { name: 'Students', count: stats.totalStudents, fill: '#3b82f6' },
    { name: 'Teachers', count: stats.totalTeachers, fill: '#10b981' },
    { name: 'Courses', count: stats.totalCourses, fill: '#8b5cf6' },
    { name: 'Classes', count: stats.totalClasses, fill: '#f59e0b' },
    { name: 'Enrollments', count: stats.totalEnrollments, fill: '#f43f5e' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome, {user?.fullName?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 mt-1">School overview and statistics — {user?.role?.replace('ROLE_', '')}</p>
          </div>
          <div className="mt-4 sm:mt-0 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100 text-sm text-slate-600">
            📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statsCards.map((card, idx) => (
            <StatCard key={idx} {...card} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">📊 Overview Statistics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, idx) => (<Cell key={idx} fill={entry.fill} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">👥 Student Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {genderData.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
