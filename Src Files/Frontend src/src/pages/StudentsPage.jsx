import { useState, useEffect } from 'react';
import { studentService, classService } from '../services/dataService';
import Modal from '../components/Modal';
import { LoadingSpinner, EmptyState } from '../components/StatusComponents';
import { useAuth } from '../context/AuthContext';

const StudentsPage = () => {
  const { isAdmin, isTeacher } = useAuth();
  const canEdit = isAdmin || isTeacher;
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '', firstName: '', lastName: '', email: '', phone: '',
    dateOfBirth: '', address: '', gender: 'MALE', grade: '',
    enrollmentDate: '', guardianName: '', guardianPhone: '', classId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchStudents(); classService.getAll().then(res => setClasses(res.data)).catch(() => {}); }, []);

  const fetchStudents = async () => {
    try { const res = await studentService.getAll(); setStudents(res.data); } catch (err) { setError('Failed to load students'); } finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ studentId: '', firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', address: '', gender: 'MALE', grade: '', enrollmentDate: '', guardianName: '', guardianPhone: '', classId: '' });
    setFormErrors({});
    setEditingStudent(null);
  };

  const openCreateModal = () => { if (canEdit) { resetForm(); setShowModal(true); } };
  const openEditModal = (student) => {
    if (!canEdit) return;
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId || '', firstName: student.firstName || '', lastName: student.lastName || '',
      email: student.email || '', phone: student.phone || '', dateOfBirth: student.dateOfBirth || '',
      address: student.address || '', gender: student.gender || 'MALE', grade: student.grade || '',
      enrollmentDate: student.enrollmentDate || '', guardianName: student.guardianName || '',
      guardianPhone: student.guardianPhone || '', classId: student.classId || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.studentId.trim()) errs.studentId = 'Student ID is required';
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.grade.trim()) errs.grade = 'Grade is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      const payload = { ...formData, classId: formData.classId ? Number(formData.classId) : null };
      if (editingStudent) { await studentService.update(editingStudent.id, payload); }
      else { await studentService.create(payload); }
      setShowModal(false); resetForm(); fetchStudents();
    } catch (err) { setFormErrors({ api: err.response?.data?.message || 'Operation failed' }); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) { alert('Only admin can delete students'); return; }
    if (!window.confirm('Delete this student?')) return;
    try { await studentService.delete(id); fetchStudents(); } catch (err) { alert('Failed to delete'); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setFormErrors({ ...formErrors, [e.target.name]: '' }); };

  if (loading) return <LoadingSpinner message="Loading students..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Students</h1>
            <p className="text-slate-500 mt-1">Manage student records</p>
          </div>
          {canEdit && (
            <button onClick={openCreateModal} className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all">
              + Add Student
            </button>
          )}
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">{error}</div>}

        {students.length === 0 ? (
          <EmptyState message="No students found." />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Gender</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Grade</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Class</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Guardian</th>
                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-blue-600">{s.studentId}</td>
                      <td className="px-4 py-3.5"><div className="text-sm font-semibold text-slate-900">{s.firstName} {s.lastName}</div><div className="text-xs text-slate-400">{s.email}</div></td>
                      <td className="px-4 py-3.5"><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s.gender === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{s.gender}</span></td>
                      <td className="px-4 py-3.5 text-sm text-slate-700">{s.grade}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-700">{s.className || '-'}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-700">{s.guardianName || '-'}</td>
                      <td className="px-4 py-3.5 text-right">
                        {canEdit && <button onClick={() => openEditModal(s)} className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3">Edit</button>}
                        {isAdmin && <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingStudent ? 'Edit Student' : 'Add New Student'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.api && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{formErrors.api}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Student ID *</label><input type="text" name="studentId" value={formData.studentId} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${formErrors.studentId ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`} />{formErrors.studentId && <p className="text-red-500 text-xs mt-1">{formErrors.studentId}</p>}</div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Gender</label><select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500"><option value="MALE">Male</option><option value="FEMALE">Female</option></select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">First Name *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${formErrors.firstName ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`} />{formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}</div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Last Name *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${formErrors.lastName ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`} />{formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth</label><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Grade *</label><input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="e.g. 9, 10" className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${formErrors.grade ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`} />{formErrors.grade && <p className="text-red-500 text-xs mt-1">{formErrors.grade}</p>}</div>
            </div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Enrollment Date</label><input type="date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Class</label><select name="classId" value={formData.classId} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500"><option value="">No Class</option>{classes.map(c => <option key={c.id} value={c.id}>{c.className}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Guardian Name</label><input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Guardian Phone</label><input type="text" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500" /></div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-slate-700 font-medium text-sm hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-800 to-blue-900 text-white font-medium text-sm hover:shadow-lg disabled:opacity-60 border border-amber-500/20">{submitting ? 'Saving...' : editingStudent ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default StudentsPage;
