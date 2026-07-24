import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { classService, teacherService } from "../services/dataService";
import Modal from "../components/Modal";
import { LoadingSpinner, EmptyState } from "../components/StatusComponents";

const ClassesPage = () => {
  const { isAdmin, isTeacher, isStudent } = useAuth();

  // Permissions
  const canView = isAdmin || isTeacher || isStudent;
  const canCreate = isAdmin || isTeacher;
  const canEdit = isAdmin || isTeacher;
  const canDelete = isAdmin;

  // Main Data
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    className: "",
    grade: "",
    section: "",
    capacity: 35,
    roomNumber: "",
    teacherId: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();

    teacherService
      .getAll()
      .then((res) => setTeachers(res.data))
      .catch(() => {});
  }, []);

  // Load Classes
  const fetchClasses = async () => {
    try {
      setLoading(true);

      const res = await classService.getAll();

      setClasses(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load classes.");
    } finally {
      setLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      className: "",
      grade: "",
      section: "",
      capacity: 35,
      roomNumber: "",
      teacherId: "",
    });

    setEditingClass(null);
    setFormErrors({});
  };

  // Open Create Modal
  const openCreateModal = () => {
    if (!canCreate) return;

    resetForm();
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (cls) => {
    if (!canEdit) return;

    setEditingClass(cls);

    setFormData({
      className: cls.className || "",
      grade: cls.grade || "",
      section: cls.section || "",
      capacity: cls.capacity || 35,
      roomNumber: cls.roomNumber || "",
      teacherId: cls.teacherId || "",
    });

    setFormErrors({});
    setShowModal(true);
  };

  // Validation
  const validate = () => {
    const errors = {};

    if (!formData.className.trim()) errors.className = "Class name is required";

    if (!formData.grade.trim()) errors.grade = "Grade is required";

    return errors;
  };
  // Save Class
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canEdit) return;

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        teacherId: formData.teacherId ? Number(formData.teacherId) : null,
      };

      if (editingClass) {
        await classService.update(editingClass.id, payload);
      } else {
        await classService.create(payload);
      }

      setShowModal(false);
      resetForm();
      await fetchClasses();
    } catch (error) {
      setFormErrors({
        api:
          error.response?.data?.message ||
          "Operation failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Class
  const handleDelete = async (id) => {
    if (!canDelete) {
      alert("Only Admin can delete classes.");
      return;
    }

    if (!window.confirm("Delete this class?")) return;

    try {
      await classService.delete(id);
      await fetchClasses();
    } catch (error) {
      alert("Failed to delete class.");
    }
  };

  // Search & Filter
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.className.toLowerCase().includes(search.toLowerCase()) ||
      cls.grade.toLowerCase().includes(search.toLowerCase()) ||
      (cls.roomNumber || "").toLowerCase().includes(search.toLowerCase());

    const matchesGrade = gradeFilter === "" || cls.grade === gradeFilter;

    const matchesTeacher =
      teacherFilter === "" || (cls.teacherName || "") === teacherFilter;

    return matchesSearch && matchesGrade && matchesTeacher;
  });

  // Handle Input Change
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

  if (loading) return <LoadingSpinner message="Loading classes..." />;

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classes</h1>

            <p className="text-gray-500 mt-1">Manage school classes</p>
          </div>

          {canCreate && (
            <button
              onClick={openCreateModal}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
            >
              + Add Class
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            <input
              type="text"
              placeholder="Filter Grade"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Teachers</option>

              {teachers.map((teacher) => (
                <option
                  key={teacher.id}
                  value={`${teacher.firstName} ${teacher.lastName}`}
                >
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards */}

        {filteredClasses.length === 0 ? (
          <EmptyState message="No classes found." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {cls.grade}
                  </div>

                  {canEdit && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(cls)}
                        className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                      >
                        Edit
                      </button>

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(cls.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {cls.className}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <b>Section:</b> {cls.section || "-"}
                  </p>

                  <p>
                    <b>Capacity:</b> {cls.capacity}
                  </p>

                  <p>
                    <b>Room:</b> {cls.roomNumber || "-"}
                  </p>

                  <p>
                    <b>Teacher:</b> {cls.teacherName || "Not Assigned"}
                  </p>

                  <p>
                    <b>Students:</b> {cls.studentCount || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingClass ? "Edit Class" : "Add New Class"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.api && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {formErrors.api}
              </div>
            )}

            <div>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="Class Name"
                className="w-full px-3 py-2 border rounded-lg"
              />
              {formErrors.className && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.className}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="Grade"
                className="w-full px-3 py-2 border rounded-lg"
              />
              {formErrors.grade && (
                <p className="text-red-500 text-xs mt-1">{formErrors.grade}</p>
              )}
            </div>

            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="Section"
              className="w-full px-3 py-2 border rounded-lg"
            />

            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              className="w-full px-3 py-2 border rounded-lg"
            />

            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="Room Number"
              className="w-full px-3 py-2 border rounded-lg"
            />

            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Teacher</option>

              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : editingClass
                    ? "Update Class"
                    : "Create Class"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ClassesPage;
