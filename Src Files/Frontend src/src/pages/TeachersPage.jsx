import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { teacherService } from '../services/dataService';
import Modal from '../components/Modal';
import { LoadingSpinner, EmptyState } from '../components/StatusComponents';


const TeachersPage = () => {

  // Role control
  const { isAdmin, isTeacher } = useAuth();

  // Admin + Teacher can add/edit
  const canEdit = isAdmin || isTeacher;


  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [formData, setFormData] = useState({
    teacherId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    hireDate: '',
    gender: 'MALE',
    address: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);



  useEffect(() => {
    fetchTeachers();
  }, []);



  const fetchTeachers = async () => {
    try {

      const res = await teacherService.getAll();
      setTeachers(res.data);

    } catch (err) {

      setError('Failed to load teachers');

    } finally {

      setLoading(false);

    }
  };



  const resetForm = () => {

    setFormData({
      teacherId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialization: '',
      hireDate: '',
      gender: 'MALE',
      address: ''
    });

    setFormErrors({});
    setEditingTeacher(null);

  };



  const openCreateModal = () => {

    if (!canEdit) return;

    resetForm();
    setShowModal(true);

  };



  const openEditModal = (teacher) => {

    if (!canEdit) return;


    setEditingTeacher(teacher);


    setFormData({

      teacherId: teacher.teacherId || '',
      firstName: teacher.firstName || '',
      lastName: teacher.lastName || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      specialization: teacher.specialization || '',
      hireDate: teacher.hireDate || '',
      gender: teacher.gender || 'MALE',
      address: teacher.address || ''

    });


    setFormErrors({});
    setShowModal(true);

  };



  const validate = () => {

    const errors = {};


    if (!formData.teacherId.trim())
      errors.teacherId = "Teacher ID is required";


    if (!formData.firstName.trim())
      errors.firstName = "First name is required";


    if (!formData.lastName.trim())
      errors.lastName = "Last name is required";


    if (!formData.specialization.trim())
      errors.specialization = "Specialization is required";


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


      if (editingTeacher) {

        await teacherService.update(
          editingTeacher.id,
          formData
        );


      } else {


        await teacherService.create(
          formData
        );


      }



      setShowModal(false);

      resetForm();

      fetchTeachers();



    } catch(err) {


      setFormErrors({

        api:
        err.response?.data?.message ||
        "Operation failed"

      });


    } finally {


      setSubmitting(false);


    }

  };



  const handleDelete = async (id) => {


    if (!isAdmin) {

      alert("Only admin can delete teachers");
      return;

    }


    if (!window.confirm("Delete this teacher?"))
      return;



    try {

      await teacherService.delete(id);

      fetchTeachers();


    } catch(err) {

      alert("Failed to delete teacher");

    }


  };



  const handleChange = (e) => {


    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });



    setFormErrors({

      ...formErrors,

      [e.target.name]: ''

    });


  };



  if (loading)
    return <LoadingSpinner message="Loading teachers..." />;
return (
  <div className="min-h-screen bg-gray-50">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Teachers
          </h1>

          <p className="text-gray-500 mt-1">
            Manage faculty records
          </p>
        </div>


        {/* Add only ADMIN + TEACHER */}
        {canEdit && (

          <button
            onClick={openCreateModal}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg"
          >
            + Add Teacher
          </button>

        )}

      </div>



      {error && (

        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>

      )}




      {teachers.length === 0 ? (

        <EmptyState message="No teachers found." />

      ) : (


        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">


          <div className="overflow-x-auto">


            <table className="w-full">


              <thead>

                <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">


                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Teacher ID
                  </th>


                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Name
                  </th>


                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Gender
                  </th>


                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Specialization
                  </th>


                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Hire Date
                  </th>


                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Phone
                  </th>


                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>


                </tr>


              </thead>




              <tbody className="divide-y divide-gray-100">


              {teachers.map((teacher)=>(


                <tr 
                  key={teacher.id}
                  className="hover:bg-gray-50"
                >


                  <td className="px-4 py-3.5 text-sm font-medium text-emerald-600">
                    {teacher.teacherId}
                  </td>



                  <td className="px-4 py-3.5">

                    <div className="text-sm font-semibold text-gray-900">

                      {teacher.firstName} {teacher.lastName}

                    </div>


                    <div className="text-xs text-gray-400">

                      {teacher.email}

                    </div>


                  </td>



                  <td className="px-4 py-3.5">

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      teacher.gender === "MALE"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-pink-100 text-pink-700"
                    }`}>

                      {teacher.gender}

                    </span>


                  </td>



                  <td className="px-4 py-3.5 text-sm text-gray-700">

                    {teacher.specialization}

                  </td>



                  <td className="px-4 py-3.5 text-sm text-gray-700">

                    {teacher.hireDate}

                  </td>



                  <td className="px-4 py-3.5 text-sm text-gray-700">

                    {teacher.phone || "-"}

                  </td>



                  <td className="px-4 py-3.5 text-right">



                    {/* Edit ADMIN + TEACHER only */}
                    {canEdit && (

                      <button
                        onClick={() => openEditModal(teacher)}
                        className="text-emerald-600 hover:text-emerald-800 font-medium text-sm mr-3"
                      >

                        Edit

                      </button>

                    )}





                    {/* Delete ADMIN only */}
                    {isAdmin && (

                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm"
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


    </div>
  </div>
);

};

export default TeachersPage;