import { useState, useEffect } from 'react';
import { authService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { LoadingSpinner, EmptyState } from '../components/StatusComponents';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', fullName: '', role: 'ROLE_STUDENT', phone: '', address: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate('/dashboard'); return; }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await authService.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ username: '', email: '', password: '', fullName: '', role: 'ROLE_STUDENT', phone: '', address: '' });
    setFormErrors({});
    setEditingUser(null);
  };

  const openCreateModal = () => { resetForm(); setShowModal(true); };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '', email: user.email || '', password: '',
      fullName: user.fullName || '', role: user.role || 'ROLE_STUDENT',
      phone: user.phone || '', address: user.address || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = 'Username is required';
    else if (formData.username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Email is invalid';
    if (!editingUser && !formData.password) errs.password = 'Password is required';
    else if (!editingUser && formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      if (editingUser) {
        await authService.updateUser(editingUser.id, formData);
      } else {
        await authService.register(formData);
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      setFormErrors({ api: err.response?.data?.message || 'Operation failed' });
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try { await authService.deleteUser(id); fetchUsers(); } catch (err) { alert('Failed to delete user'); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'bg-purple-100 text-purple-700';
      case 'ROLE_TEACHER': return 'bg-blue-100 text-blue-700';
      case 'ROLE_STUDENT': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (role) => role?.replace('ROLE_', '');

  if (loading) return <LoadingSpinner message="Loading users..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-500 mt-1">Admin-only: Create and manage system users</p>
          </div>
          <button onClick={openCreateModal} className="mt-4 sm:mt-0 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all">
            + Add User
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">{error}</div>}

        {users.length === 0 ? (
          <EmptyState message="No users found." />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-blue-50">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase">User</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Role</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Phone</th>
                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="text-sm font-semibold text-slate-900">{u.fullName}</div>
                        <div className="text-xs text-slate-400">@{u.username}</div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-700">{u.email}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadge(u.role)}`}>
                          {getRoleLabel(u.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-700">{u.phone || '-'}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button onClick={() => openEditModal(u)} className="text-amber-600 hover:text-amber-800 font-medium text-sm mr-3">Edit</button>
                        <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingUser ? 'Edit User' : 'Create New User'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.api && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{formErrors.api}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${formErrors.fullName ? 'border-red-300' : 'border-gray-200 focus:border-amber-500'}`} />
                {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Role *</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500 bg-white">
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_TEACHER">Teacher</option>
                  <option value="ROLE_STUDENT">Student</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Username *</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${formErrors.username ? 'border-red-300' : 'border-gray-200 focus:border-amber-500'}`} />
                {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${formErrors.email ? 'border-red-300' : 'border-gray-200 focus:border-amber-500'}`} />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Password {!editingUser && '*'} {editingUser && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
              </label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${formErrors.password ? 'border-red-300' : 'border-gray-200 focus:border-amber-500'}`} />
              {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-500" />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-slate-700 font-medium text-sm hover:bg-gray-50 transition-all">Cancel</button>
              <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-800 to-blue-900 text-white font-medium text-sm hover:shadow-lg transition-all disabled:opacity-60 border border-amber-500/20">
                {submitting ? 'Saving...' : editingUser ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default UsersPage;
