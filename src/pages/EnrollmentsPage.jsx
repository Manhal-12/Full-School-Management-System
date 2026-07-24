import { useState, useEffect } from "react";
import {
  enrollmentService,
  studentService,
  courseService,
} from "../services/dataService";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import { LoadingSpinner, EmptyState } from "../components/StatusComponents";

const EnrollmentsPage = () => {
  const { isAdmin, isTeacher, isStudent } = useAuth();

  // Permissions
  const canView = isAdmin || isTeacher || isStudent;
  const canCreate = isAdmin || isTeacher;
  const canEdit = isAdmin || isTeacher;
  const canDelete = isAdmin;

  // Main Data
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEnrollments();

    studentService
      .getAll()
      .then((res) => setStudents(res.data))
      .catch(() => {});

    courseService
      .getAll()
      .then((res) => setCourses(res.data))
      .catch(() => {});
  }, []);

  // Load Enrollments
  const fetchEnrollments = async () => {
    try {
      setLoading(true);

      const res = await enrollmentService.getAll();

      setEnrollments(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load enrollments.");
    } finally {
      setLoading(false);
    }
  };

  // Open Modal
  const openCreateModal = () => {
    if (!canCreate) return;

    setFormData({
      studentId: "",
      courseId: "",
    });

    setFormErrors({});
    setShowModal(true);
  };

  // Validation
  const validate = () => {
    const errors = {};

    if (!formData.studentId) errors.studentId = "Student is required";

    if (!formData.courseId) errors.courseId = "Course is required";

    return errors;
  };

  // Save Enrollment
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
      await enrollmentService.create(
        Number(formData.studentId),
        Number(formData.courseId),
      );

      setShowModal(false);

      setFormData({
        studentId: "",
        courseId: "",
      });

      setFormErrors({});

      await fetchEnrollments();
    } catch (err) {
      setFormErrors({
        api:
          err.response?.data?.message || "Enrollment failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Update Status
  const handleStatusChange = async (id, status) => {
    if (!canEdit) return;

    try {
      await enrollmentService.updateStatus(id, status);
      await fetchEnrollments();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // Delete Enrollment
  const handleDelete = async (id) => {
    if (!canDelete) {
      alert("Only Admin can delete enrollments.");
      return;
    }

    if (!window.confirm("Delete this enrollment?")) return;

    try {
      await enrollmentService.delete(id);
      await fetchEnrollments();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  // Status Badge Color
  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      case "DROPPED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Search + Filter
  const filteredEnrollments = enrollments.filter((enr) => {
    const matchesSearch =
      (enr.studentName || "").toLowerCase().includes(search.toLowerCase()) ||
      (enr.courseName || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "" || enr.status === statusFilter;

    const matchesCourse =
      courseFilter === "" || enr.courseName === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  if (loading) return <LoadingSpinner message="Loading enrollments..." />;

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
            <h1 className="text-3xl font-bold text-gray-900">Enrollments</h1>

            <p className="text-gray-500 mt-1">
              Manage student course enrollments
            </p>
          </div>

          {canCreate && (
            <button
              onClick={openCreateModal}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              + New Enrollment
            </button>
          )}
        </div>

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
              placeholder="Search student or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="DROPPED">DROPPED</option>
            </select>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Courses</option>

              {courses.map((course) => (
                <option key={course.id} value={course.courseName}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredEnrollments.length === 0 ? (
          <EmptyState message="No enrollments found." />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-violet-50">
                    <th className="px-4 py-4 text-left">Student</th>

                    <th className="px-4 py-4 text-left">Course</th>

                    <th className="px-4 py-4 text-left">Date</th>

                    <th className="px-4 py-4 text-left">Grade</th>

                    <th className="px-4 py-4 text-left">Status</th>

                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredEnrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold">
                        {enr.studentName}
                      </td>

                      <td className="px-4 py-3 text-sm">{enr.courseName}</td>

                      <td className="px-4 py-3 text-sm">
                        {enr.enrollmentDate}
                      </td>

                      <td className="px-4 py-3 text-sm">{enr.grade || "-"}</td>

                      <td className="px-4 py-3">
                        {canEdit ? (
                          <select
                            value={enr.status}
                            onChange={(e) =>
                              handleStatusChange(enr.id, e.target.value)
                            }
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              enr.status,
                            )}`}
                          >
                            <option value="ACTIVE">ACTIVE</option>

                            <option value="COMPLETED">COMPLETED</option>

                            <option value="DROPPED">DROPPED</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              enr.status,
                            )}`}
                          >
                            {enr.status}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(enr.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
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

        {canEdit && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="New Enrollment"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {formErrors.api && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                  {formErrors.api}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Student *
                </label>

                <select
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      studentId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Student</option>

                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>

                {formErrors.studentId && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.studentId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Course *
                </label>

                <select
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Course</option>

                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.courseName}
                    </option>
                  ))}
                </select>

                {formErrors.courseId && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.courseId}
                  </p>
                )}
              </div>

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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Enroll Student"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default EnrollmentsPage;
