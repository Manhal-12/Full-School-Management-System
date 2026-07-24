import { useState, useEffect } from 'react';
import { classService, teacherService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { LoadingSpinner, EmptyState } from '../components/StatusComponents';


const ClassesPage = () => {


  const { isAdmin, isTeacher } = useAuth();


  // Admin + Teacher manage
  // Student view only
  const canEdit = isAdmin || isTeacher;



  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingClass, setEditingClass] = useState(null);


  const [formData, setFormData] = useState({

    className:'',
    grade:'',
    section:'',
    capacity:35,
    roomNumber:'',
    teacherId:''

  });



  const [formErrors,setFormErrors] = useState({});
  const [submitting,setSubmitting] = useState(false);



  useEffect(()=>{

    fetchClasses();


    if(canEdit){

      teacherService
      .getAll()
      .then(res=>setTeachers(res.data))
      .catch(()=>{});

    }


  },[]);




  const fetchClasses = async()=>{

    try{

      const res = await classService.getAll();

      setClasses(res.data);


    }catch(error){

      console.log("Failed loading classes");

    }
    finally{

      setLoading(false);

    }

  };





  const resetForm = ()=>{


    setFormData({

      className:'',
      grade:'',
      section:'',
      capacity:35,
      roomNumber:'',
      teacherId:''

    });


    setFormErrors({});

    setEditingClass(null);

  };





  const openCreateModal = ()=>{


    if(!canEdit) return;


    resetForm();

    setShowModal(true);


  };






  const openEditModal = (cls)=>{


    if(!canEdit) return;


    setEditingClass(cls);


    setFormData({

      className: cls.className || '',
      grade: cls.grade || '',
      section: cls.section || '',
      capacity: cls.capacity || 35,
      roomNumber: cls.roomNumber || '',
      teacherId: cls.teacherId || ''

    });



    setFormErrors({});

    setShowModal(true);


  };





  const validate = ()=>{


    const errors={};


    if(!formData.className.trim())

      errors.className="Class name is required";



    if(!formData.grade.trim())

      errors.grade="Grade is required";



    return errors;


  };





  const handleSubmit = async(e)=>{


    e.preventDefault();



    if(!canEdit) return;



    const errors = validate();



    if(Object.keys(errors).length){

      setFormErrors(errors);

      return;

    }



    setSubmitting(true);



    try{


      const payload={

        ...formData,

        teacherId: formData.teacherId
        ? Number(formData.teacherId)
        : null

      };



      if(editingClass){


        await classService.update(
          editingClass.id,
          payload
        );


      }else{


        await classService.create(payload);


      }



      setShowModal(false);

      resetForm();

      fetchClasses();



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

      alert("Only admin can delete classes");

      return;

    }



    if(!window.confirm("Delete this class?"))

      return;



    try{


      await classService.delete(id);

      fetchClasses();


    }catch(error){

      alert("Delete failed");

    }


  };





  const handleChange=(e)=>{


    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });



    setFormErrors({

      ...formErrors,

      [e.target.name]:''

    });


  };





  if(loading)

    return <LoadingSpinner message="Loading classes..." />;
  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">


          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Classes
            </h1>

            <p className="text-gray-500 mt-1">
              View and manage class sections
            </p>

          </div>



          {canEdit && (

            <button
              onClick={openCreateModal}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg"
            >

              + Add Class

            </button>

          )}


        </div>





        {
          classes.length === 0 ? (

            <EmptyState message="No classes found." />

          ) : (



          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">


          {
            classes.map((cls)=>(


              <div
                key={cls.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >



                <div className="flex justify-between mb-4">


                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">

                    {cls.grade}

                  </div>





                  {canEdit && (

                  <div className="flex gap-3">


                    <button

                      onClick={()=>openEditModal(cls)}

                      className="text-pink-600 hover:text-pink-800"

                    >

                      Edit

                    </button>





                    {isAdmin && (

                    <button

                      onClick={()=>handleDelete(cls.id)}

                      className="text-red-500 hover:text-red-700"

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

                    <b>Capacity:</b> {cls.capacity} students

                  </p>


                  <p>

                    <b>Room:</b> {cls.roomNumber || "N/A"}

                  </p>



                  <p>

                    <b>Teacher:</b> {cls.teacherName || "Not assigned"}

                  </p>



                  <p>

                    <b>Students:</b> {cls.studentCount || 0}

                  </p>



                </div>



              </div>


            ))

          }


          </div>



          )

        }







        <Modal

          isOpen={showModal}

          onClose={()=>setShowModal(false)}

          title={
            editingClass
            ? "Edit Class"
            : "Add New Class"
          }

        >



        <form

          onSubmit={handleSubmit}

          className="space-y-4"

        >




        {
          formErrors.api && (

          <div className="bg-red-50 text-red-700 p-3 rounded">

            {formErrors.api}

          </div>

          )
        }





        <input

          name="className"

          value={formData.className}

          onChange={handleChange}

          placeholder="Class Name"

          className="w-full border p-3 rounded"

        />





        <input

          name="grade"

          value={formData.grade}

          onChange={handleChange}

          placeholder="Grade"

          className="w-full border p-3 rounded"

        />





        <input

          name="section"

          value={formData.section}

          onChange={handleChange}

          placeholder="Section"

          className="w-full border p-3 rounded"

        />





        <input

          type="number"

          name="capacity"

          value={formData.capacity}

          onChange={handleChange}

          className="w-full border p-3 rounded"

        />





        <input

          name="roomNumber"

          value={formData.roomNumber}

          onChange={handleChange}

          placeholder="Room Number"

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

            className="px-5 py-2 bg-pink-500 text-white rounded"

          >


            {
              submitting
              ?
              "Saving..."
              :
              editingClass
              ?
              "Update"
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


export default ClassesPage;