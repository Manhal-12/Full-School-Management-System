import { useState, useEffect } from "react";
import { studentService, classService } from "../services/dataService";
import Modal from "../components/Modal";
import { LoadingSpinner, EmptyState } from "../components/StatusComponents";
import { useAuth } from "../context/AuthContext";

const StudentsPage = () => {
  const { isAdmin, isTeacher, isStudent } = useAuth();

  const canView = isAdmin || isTeacher || isStudent;
  const canCreate = isAdmin || isTeacher;
  const canEdit = isAdmin || isTeacher;
  const canDelete = isAdmin;

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    gender: "MALE",
    grade: "",
    enrollmentDate: "",
    guardianName: "",
    guardianPhone: "",
    classId: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();

    classService
      .getAll()
      .then((res) => setClasses(res.data))
      .catch(() => {});
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentService.getAll();
      setStudents(res.data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      gender: "MALE",
      grade: "",
      enrollmentDate: "",
      guardianName: "",
      guardianPhone: "",
      classId: "",
    });

    setFormErrors({});
    setEditingStudent(null);
  };

  const openCreateModal = () => {
    if (!canCreate) return;

    resetForm();
    setShowModal(true);
  };

  const openEditModal = (student) => {
    if (!canEdit) return;

    setEditingStudent(student);

    setFormData({
      studentId: student.studentId || "",
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phone: student.phone || "",
      dateOfBirth: student.dateOfBirth || "",
      address: student.address || "",
      gender: student.gender || "MALE",
      grade: student.grade || "",
      enrollmentDate: student.enrollmentDate || "",
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
      classId: student.classId || "",
    });

    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errors = {};

    if (!formData.studentId.trim()) errors.studentId = "Student ID is required";

    if (!formData.firstName.trim()) errors.firstName = "First Name is required";

    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";

    if (!formData.grade.trim()) errors.grade = "Grade is required";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        classId: formData.classId ? Number(formData.classId) : null,
      };

      if (editingStudent) {
        await studentService.update(editingStudent.id, payload);
      } else {
        await studentService.create(payload);
      }

      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors({
          ...err.response.data.errors,
          api: err.response.data.message,
        });
      } else {
        setFormErrors({
          api: err.response?.data?.message || "Operation failed",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      alert("Only Admin can delete students.");
      return;
    }

    if (!window.confirm("Delete this student?")) return;

    try {
      await studentService.delete(id);
      fetchStudents();
    } catch (err) {
      alert("Failed to delete student.");
    }
  };

  // Search & Filter
  const filteredStudents = students.filter((student) => {
    const keyword = search.toLowerCase();

    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();

    const matchesSearch =
      student.studentId?.toLowerCase().includes(keyword) ||
      fullName.includes(keyword) ||
      student.email?.toLowerCase().includes(keyword);

    const matchesGender =
      genderFilter === "" || student.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
  };

  if (loading) return <LoadingSpinner message="Loading students..." />;

  if (!canView) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Students</h1>

            <p className="text-slate-500 mt-1">Manage student records</p>
          </div>

          {canCreate && (
            <button
              onClick={openCreateModal}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              + Add Student
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by ID, Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        {filteredStudents.length === 0 ? (
          <EmptyState message="No students found." />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <th className="px-4 py-4 text-left">ID</th>

                    <th className="px-4 py-4 text-left">Name</th>

                    <th className="px-4 py-4 text-left">Gender</th>

                    <th className="px-4 py-4 text-left">Grade</th>

                    <th className="px-4 py-4 text-left">Class</th>

                    <th className="px-4 py-4 text-left">Guardian</th>

                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-blue-600 font-semibold">
                        {s.studentId}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold">
                          {s.firstName} {s.lastName}
                        </div>

                        <div className="text-xs text-gray-500">{s.email}</div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            s.gender === "MALE"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-pink-100 text-pink-700"
                          }`}
                        >
                          {s.gender}
                        </span>
                      </td>

                      <td className="px-4 py-3">{s.grade}</td>

                      <td className="px-4 py-3">{s.className || "-"}</td>

                      <td className="px-4 py-3">{s.guardianName || "-"}</td>

                      <td className="px-4 py-3 text-right">
                        {canEdit && (
                          <button
                            onClick={() => openEditModal(s)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Edit
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          title={editingStudent ? "Edit Student" : "Add Student"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.api && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                {formErrors.api}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Student ID
                </label>

                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />

                {formErrors.studentId && (
                  <p className="text-red-500 text-sm">{formErrors.studentId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />

                {formErrors.firstName && (
                  <p className="text-red-500 text-sm">{formErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />

                {formErrors.lastName && (
                  <p className="text-red-500 text-sm">{formErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Grade</label>

                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />

                {formErrors.grade && (
                  <p className="text-red-500 text-sm">{formErrors.grade}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enrollment Date
                </label>

                <input
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Class</label>

                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">No Class</option>

                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.className}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Guardian Name
                </label>

                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Guardian Phone
                </label>

                <input
                  type="text"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-5 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {submitting
                  ? "Saving..."
                  : editingStudent
                    ? "Update Student"
                    : "Create Student"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default StudentsPage;
