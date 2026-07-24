import { useState, useEffect } from 'react';
import { courseService, teacherService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { LoadingSpinner, EmptyState } from '../components/StatusComponents';

const CoursesPage = () => {

  const { isAdmin, isTeacher } = useAuth();

  // ADMIN + TEACHER can manage
  // STUDENT only view
  const canEdit = isAdmin || isTeacher;

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    description: '',
    credits: 3,
    grade: '',
    teacherId: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    fetchCourses();

    if (canEdit) {
      teacherService
        .getAll()
        .then(res => setTeachers(res.data))
        .catch(() => {});
    }

  }, []);



  const fetchCourses = async () => {
    try {

      const res = await courseService.getAll();
      setCourses(res.data);

    } catch (error) {

      console.log("Failed loading courses");

    } finally {

      setLoading(false);

    }
  };



  const resetForm = () => {

    setFormData({
      courseCode: '',
      courseName: '',
      description: '',
      credits: 3,
      grade: '',
      teacherId: ''
    });

    setFormErrors({});
    setEditingCourse(null);

  };



  const openCreateModal = () => {

    if (!canEdit) return;

    resetForm();
    setShowModal(true);

  };



  const openEditModal = (course) => {

    if (!canEdit) return;


    setEditingCourse(course);


    setFormData({

      courseCode: course.courseCode || '',
      courseName: course.courseName || '',
      description: course.description || '',
      credits: course.credits || 3,
      grade: course.grade || '',
      teacherId: course.teacherId || ''

    });


    setFormErrors({});
    setShowModal(true);

  };



  const validate = () => {

    const errors = {};


    if (!formData.courseCode.trim())
      errors.courseCode = "Course code is required";


    if (!formData.courseName.trim())
      errors.courseName = "Course name is required";


    if (!formData.grade.trim())
      errors.grade = "Grade is required";


    return errors;

  };



  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!canEdit) return;


    const errors = validate();


    if (Object.keys(errors).length > 0){

      setFormErrors(errors);
      return;

    }



    setSubmitting(true);


    try {


      const payload = {

        ...formData,

        teacherId: formData.teacherId
          ? Number(formData.teacherId)
          : null

      };



      if(editingCourse){

        await courseService.update(
          editingCourse.id,
          payload
        );


      }else{


        await courseService.create(payload);


      }



      setShowModal(false);

      resetForm();

      fetchCourses();



    }catch(error){

      setFormErrors({

        api:
        error.response?.data?.message ||
        "Operation failed"

      });


    }finally{

      setSubmitting(false);

    }

  };



  const handleDelete = async(id)=>{


    if(!isAdmin){

      alert("Only admin can delete courses");

      return;

    }



    if(!window.confirm("Delete this course?"))
      return;



    try{

      await courseService.delete(id);

      fetchCourses();


    }catch(error){

      alert("Delete failed");

    }

  };



  const handleChange = (e)=>{


    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });


    setFormErrors({

      ...formErrors,

      [e.target.name]: ''

    });

  };



  if(loading)

    return <LoadingSpinner message="Loading courses..." />;

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Courses
            </h1>

            <p className="text-gray-500 mt-1">
              View and manage courses
            </p>

          </div>



          {canEdit && (

            <button
              onClick={openCreateModal}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg"
            >
              + Add Course
            </button>

          )}

        </div>



        {
          courses.length === 0 ? (

            <EmptyState message="No courses found." />

          ) : (

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            <div className="overflow-x-auto">


              <table className="w-full">


                <thead>

                  <tr className="bg-gradient-to-r from-orange-50 to-amber-50">


                    <th className="px-4 py-4 text-left text-xs font-semibold">
                      Code
                    </th>


                    <th className="px-4 py-4 text-left text-xs font-semibold">
                      Course Name
                    </th>


                    <th className="px-4 py-4 text-left text-xs font-semibold">
                      Grade
                    </th>


                    <th className="px-4 py-4 text-left text-xs font-semibold">
                      Credits
                    </th>


                    <th className="px-4 py-4 text-left text-xs font-semibold">
                      Teacher
                    </th>


                    {canEdit && (

                    <th className="px-4 py-4 text-right text-xs font-semibold">
                      Actions
                    </th>

                    )}

                  </tr>

                </thead>



                <tbody className="divide-y">


                {
                  courses.map(course => (

                    <tr
                      key={course.id}
                      className="hover:bg-gray-50"
                    >


                      <td className="px-4 py-3 text-sm text-orange-600 font-medium">

                        {course.courseCode}

                      </td>



                      <td className="px-4 py-3">

                        <div className="font-semibold">

                          {course.courseName}

                        </div>


                        <div className="text-xs text-gray-400">

                          {course.description}

                        </div>

                      </td>



                      <td className="px-4 py-3 text-sm">

                        {course.grade}

                      </td>



                      <td className="px-4 py-3 text-sm">

                        {course.credits}

                      </td>



                      <td className="px-4 py-3 text-sm">

                        {course.teacherName || "-"}

                      </td>



                      {canEdit && (

                      <td className="px-4 py-3 text-right">


                        <button

                          onClick={() => openEditModal(course)}

                          className="text-orange-600 mr-3 text-sm font-medium"
                        >

                          Edit

                        </button>



                        {isAdmin && (

                        <button

                          onClick={() => handleDelete(course.id)}

                          className="text-red-500 text-sm font-medium"

                        >

                          Delete

                        </button>

                        )}


                      </td>

                      )}


                    </tr>

                  ))

                }


                </tbody>


              </table>


            </div>

          </div>

          )

        }





        <Modal

          isOpen={showModal}

          onClose={()=>setShowModal(false)}

          title={
            editingCourse
            ? "Edit Course"
            : "Add New Course"
          }

        >


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >



        {formErrors.api && (

          <div className="bg-red-50 text-red-700 p-3 rounded">

            {formErrors.api}

          </div>

        )}




        <input

          name="courseCode"

          placeholder="Course Code"

          value={formData.courseCode}

          onChange={handleChange}

          className="w-full border p-3 rounded"

        />



        <input

          name="courseName"

          placeholder="Course Name"

          value={formData.courseName}

          onChange={handleChange}

          className="w-full border p-3 rounded"

        />



        <input

          name="grade"

          placeholder="Grade"

          value={formData.grade}

          onChange={handleChange}

          className="w-full border p-3 rounded"

        />



        <textarea

          name="description"

          placeholder="Description"

          value={formData.description}

          onChange={handleChange}

          className="w-full border p-3 rounded"

        />




        <input

          type="number"

          name="credits"

          value={formData.credits}

          onChange={handleChange}

          className="w-full border p-3 rounded"

        />




        <select

          name="teacherId"

          value={formData.teacherId}

          onChange={handleChange}

          className="w-full border p-3 rounded"

        >


          <option value="">
            No Teacher
          </option>


          {

          teachers.map(t=>(

            <option

              key={t.id}

              value={t.id}

            >

              {t.firstName} {t.lastName}

            </option>

          ))

          }


        </select>





        <div className="flex justify-end gap-3">


          <button

            type="button"

            onClick={()=>setShowModal(false)}

            className="px-5 py-2 border rounded"

          >

            Cancel

          </button>




          <button

            type="submit"

            disabled={submitting}

            className="px-5 py-2 bg-orange-500 text-white rounded"

          >

            {
              submitting
              ? "Saving..."
              :
              editingCourse
              ? "Update"
              :
              "Create"
            }


          </button>



        </div>



        </form>



        </Modal>




      </div>

    </div>

  );

};


export default CoursesPage;