import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { teacherService } from "../services/dataService";
import Modal from "../components/Modal";
import {
  LoadingSpinner,
  EmptyState,
} from "../components/StatusComponents";

const TeachersPage = () => {
  const { isAdmin, isTeacher, isStudent } = useAuth();

  // Permissions
  const canView = isAdmin || isTeacher || isStudent;
  const canCreate = isAdmin;
  const canEdit = isAdmin;
  const canDelete = isAdmin;

  // Main Data
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    teacherId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    hireDate: "",
    gender: "MALE",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const res = await teacherService.getAll();

      setTeachers(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      teacherId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      hireDate: "",
      gender: "MALE",
      address: "",
    });

    setFormErrors({});
    setEditingTeacher(null);
  };

  // Open Create Modal
const openCreateModal = () => {
  if (!canCreate) return;

  resetForm();
  setShowModal(true);
};

// Open Edit Modal
const openEditModal = (teacher) => {
  if (!canEdit) return;

  setEditingTeacher(teacher);

  setFormData({
    teacherId: teacher.teacherId || "",
    firstName: teacher.firstName || "",
    lastName: teacher.lastName || "",
    email: teacher.email || "",
    phone: teacher.phone || "",
    specialization: teacher.specialization || "",
    hireDate: teacher.hireDate || "",
    gender: teacher.gender || "MALE",
    address: teacher.address || "",
  });

  setFormErrors({});
  setShowModal(true);
};

// Validation
const validate = () => {
  const errors = {};

  if (!formData.teacherId.trim())
    errors.teacherId = "Teacher ID is required";

  if (!formData.firstName.trim())
    errors.firstName = "First Name is required";

  if (!formData.lastName.trim())
    errors.lastName = "Last Name is required";

  if (!formData.specialization.trim())
    errors.specialization = "Specialization is required";

  return errors;
};

// Save Teacher
const handleSubmit = async (e) => {
  e.preventDefault();

  const errors = validate();

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setSubmitting(true);

  try {
    if (editingTeacher) {
      await teacherService.update(editingTeacher.id, formData);
    } else {
      await teacherService.create(formData);
    }

    setShowModal(false);
    resetForm();
    await fetchTeachers();
  } catch (err) {
    setFormErrors({
      api:
        err.response?.data?.message ||
        "Operation failed. Please try again.",
    });
  } finally {
    setSubmitting(false);
  }
};

// Delete Teacher
const handleDelete = async (id) => {
  if (!canDelete) {
    alert("Only Admin can delete teachers.");
    return;
  }

  if (!window.confirm("Delete this teacher?")) return;

  try {
    await teacherService.delete(id);
    await fetchTeachers();
  } catch (err) {
    alert("Failed to delete teacher.");
  }
};

// Search + Filter
const filteredTeachers = teachers.filter((teacher) => {
  const fullName =
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase();

  const matchesSearch =
    teacher.teacherId.toLowerCase().includes(search.toLowerCase()) ||
    fullName.includes(search.toLowerCase()) ||
    (teacher.email || "")
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesGender =
    genderFilter === "" ||
    teacher.gender === genderFilter;

  return matchesSearch && matchesGender;
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

if (loading)
  return <LoadingSpinner message="Loading teachers..." />;

if (!canView) {
  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-3xl font-bold text-red-600">
        Access Denied
      </h2>
    </div>
  );
}
return (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Teachers
          </h1>

          <p className="text-gray-500 mt-1">
            Manage faculty records
          </p>
        </div>

        {canCreate && (
          <button
            onClick={openCreateModal}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
          >
            + Add Teacher
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Search by Teacher ID, Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

        </div>
      </div>

      {filteredTeachers.length === 0 ? (
        <EmptyState message="No teachers found." />
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
                  <th className="px-4 py-4 text-left">Teacher ID</th>
                  <th className="px-4 py-4 text-left">Name</th>
                  <th className="px-4 py-4 text-left">Gender</th>
                  <th className="px-4 py-4 text-left">Specialization</th>
                  <th className="px-4 py-4 text-left">Hire Date</th>
                  <th className="px-4 py-4 text-left">Phone</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
              {filteredTeachers.map((teacher) => (
  <tr
    key={teacher.id}
    className="hover:bg-gray-50 transition-colors"
  >
    <td className="px-4 py-3.5 text-sm font-medium text-emerald-600">
      {teacher.teacherId}
    </td>

    <td className="px-4 py-3.5">
      <div className="text-sm font-semibold text-gray-900">
        {teacher.firstName} {teacher.lastName}
      </div>

      <div className="text-xs text-gray-400">
        {teacher.email || "-"}
      </div>
    </td>

    <td className="px-4 py-3.5">
      <span
        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
          teacher.gender === "MALE"
            ? "bg-blue-100 text-blue-700"
            : "bg-pink-100 text-pink-700"
        }`}
      >
        {teacher.gender}
      </span>
    </td>

    <td className="px-4 py-3.5 text-sm text-gray-700">
      {teacher.specialization}
    </td>

    <td className="px-4 py-3.5 text-sm text-gray-700">
      {teacher.hireDate || "-"}
    </td>

    <td className="px-4 py-3.5 text-sm text-gray-700">
      {teacher.phone || "-"}
    </td>

    <td className="px-4 py-3.5 text-right">
      {canEdit && (
        <button
          onClick={() => openEditModal(teacher)}
          className="text-emerald-600 hover:text-emerald-800 font-medium text-sm mr-3"
        >
          Edit
        </button>
      )}

      {canDelete && (
        <button
          onClick={() => handleDelete(teacher.id)}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
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
  onClose={() => setShowModal(false)}
  title={editingTeacher ? "Edit Teacher" : "Add New Teacher"}
>
  <form onSubmit={handleSubmit} className="space-y-4">

    {formErrors.api && (
      <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
        {formErrors.api}
      </div>
    )}

    <div className="grid grid-cols-2 gap-4">

      <div>
        <label className="block text-sm font-semibold mb-1">
          Teacher ID *
        </label>

        <input
          type="text"
          name="teacherId"
          value={formData.teacherId}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border"
        />

        {formErrors.teacherId && (
          <p className="text-red-500 text-xs mt-1">
            {formErrors.teacherId}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Gender
        </label>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </div>

    </div>

    <div className="grid grid-cols-2 gap-4">

      <div>
        <label className="block text-sm font-semibold mb-1">
          First Name *
        </label>

        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border"
        />

        {formErrors.firstName && (
          <p className="text-red-500 text-xs mt-1">
            {formErrors.firstName}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Last Name *
        </label>

        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border"
        />

        {formErrors.lastName && (
          <p className="text-red-500 text-xs mt-1">
            {formErrors.lastName}
          </p>
        )}
      </div>

    </div>

    <div className="grid grid-cols-2 gap-4">

      <div>
        <label className="block text-sm font-semibold mb-1">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Phone
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border"
        />
      </div>

    </div>

    <div className="grid grid-cols-2 gap-4">

      <div>
        <label className="block text-sm font-semibold mb-1">
          Specialization *
        </label>

        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border"
        />

        {formErrors.specialization && (
          <p className="text-red-500 text-xs mt-1">
            {formErrors.specialization}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Hire Date
        </label>

        <input
          type="date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border"
        />
      </div>

    </div>

    <div>
      <label className="block text-sm font-semibold mb-1">
        Address
      </label>

      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="w-full px-3 py-2 rounded-lg border"
      />
    </div>

    <div className="flex justify-end gap-3 pt-4">

      <button
        type="button"
        onClick={() => setShowModal(false)}
        className="px-5 py-2 rounded-xl border"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={submitting}
        className="px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {submitting
          ? "Saving..."
          : editingTeacher
          ? "Update Teacher"
          : "Create Teacher"}
      </button>

    </div>

  </form>
</Modal>

    </div>
  </div>
);

};

export default TeachersPage;