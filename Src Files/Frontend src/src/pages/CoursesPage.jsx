import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { courseService, teacherService } from "../services/dataService";
import Modal from "../components/Modal";
import { LoadingSpinner, EmptyState } from "../components/StatusComponents";

const CoursesPage = () => {
  const { isAdmin, isTeacher, isStudent } = useAuth();

  // Permissions
  const canView = isAdmin || isTeacher || isStudent;
  const canCreate = isAdmin || isTeacher;
  const canEdit = isAdmin || isTeacher;
  const canDelete = isAdmin;

  // Data
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filters
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    description: "",
    credits: 3,
    grade: "",
    teacherId: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load Data
  useEffect(() => {
    fetchCourses();

    teacherService
      .getAll()
      .then((res) => setTeachers(res.data))
      .catch(() => {});
  }, []);

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await courseService.getAll();

      setCourses(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      courseCode: "",
      courseName: "",
      description: "",
      credits: 3,
      grade: "",
      teacherId: "",
    });

    setEditingCourse(null);
    setFormErrors({});
  };
  // Open Create Modal
  const openCreateModal = () => {
    if (!canCreate) return;

    resetForm();
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (course) => {
    if (!canEdit) return;

    setEditingCourse(course);

    setFormData({
      courseCode: course.courseCode || "",
      courseName: course.courseName || "",
      description: course.description || "",
      credits: course.credits || 3,
      grade: course.grade || "",
      teacherId: course.teacherId || "",
    });

    setFormErrors({});
    setShowModal(true);
  };

  // Validation
  const validate = () => {
    const errors = {};

    if (!formData.courseCode.trim())
      errors.courseCode = "Course Code is required";

    if (!formData.courseName.trim())
      errors.courseName = "Course Name is required";

    if (!formData.grade.trim()) errors.grade = "Grade is required";

    if (!formData.teacherId) errors.teacherId = "Teacher is required";

    return errors;
  };

  // Save Course
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
        teacherId: Number(formData.teacherId),
        credits: Number(formData.credits),
      };

      if (editingCourse) {
        await courseService.update(editingCourse.id, payload);
      } else {
        await courseService.create(payload);
      }

      setShowModal(false);
      resetForm();
      await fetchCourses();
    } catch (err) {
      setFormErrors({
        api:
          err.response?.data?.message || "Operation failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Course
  const handleDelete = async (id) => {
    if (!canDelete) {
      alert("Only Admin can delete courses.");
      return;
    }

    if (!window.confirm("Delete this course?")) return;

    try {
      await courseService.delete(id);
      await fetchCourses();
    } catch (err) {
      alert("Failed to delete course.");
    }
  };

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

  // Search + Filter
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
      course.courseName?.toLowerCase().includes(search.toLowerCase());

    const matchesGrade = gradeFilter === "" || course.grade === gradeFilter;

    const matchesTeacher =
      teacherFilter === "" || String(course.teacherId) === teacherFilter;

    return matchesSearch && matchesGrade && matchesTeacher;
  });

  // Loading
  if (loading) return <LoadingSpinner message="Loading courses..." />;

  // Permission
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
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>

            <p className="text-gray-500 mt-1">Manage course records</p>
          </div>

          {canCreate && (
            <button
              onClick={openCreateModal}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
            >
              + Add Course
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
              placeholder="Search Course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Grades</option>
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
            </select>

            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Teachers</option>

              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <EmptyState message="No courses found." />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <th className="px-4 py-4 text-left">Code</th>
                    <th className="px-4 py-4 text-left">Course</th>
                    <th className="px-4 py-4 text-left">Grade</th>
                    <th className="px-4 py-4 text-left">Credits</th>
                    <th className="px-4 py-4 text-left">Teacher</th>

                    {canEdit && (
                      <th className="px-4 py-4 text-right">Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold text-orange-600">
                        {course.courseCode}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold">{course.courseName}</div>

                        <div className="text-xs text-gray-400">
                          {course.description || "-"}
                        </div>
                      </td>

                      <td className="px-4 py-3">{course.grade}</td>

                      <td className="px-4 py-3">{course.credits}</td>

                      <td className="px-4 py-3">{course.teacherName || "-"}</td>

                      {canEdit && (
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => openEditModal(course)}
                            className="text-orange-600 hover:text-orange-800 mr-3 font-medium"
                          >
                            Edit
                          </button>

                          {canDelete && (
                            <button
                              onClick={() => handleDelete(course.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingCourse ? "Edit Course" : "Add New Course"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.api && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {formErrors.api}
              </div>
            )}

            {/* Course Code */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Course Code *
              </label>

              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />

              {formErrors.courseCode && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.courseCode}
                </p>
              )}
            </div>

            {/* Course Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Course Name *
              </label>

              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />

              {formErrors.courseName && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.courseName}
                </p>
              )}
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Grade *
              </label>

              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />

              {formErrors.grade && (
                <p className="text-red-500 text-xs mt-1">{formErrors.grade}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Description
              </label>

              <textarea
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Credits */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Credits
              </label>

              <input
                type="number"
                min="1"
                max="12"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Teacher */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Teacher *
              </label>

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

              {formErrors.teacherId && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.teacherId}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : editingCourse
                    ? "Update Course"
                    : "Create Course"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default CoursesPage;
