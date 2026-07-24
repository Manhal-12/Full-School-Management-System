import { useState, useEffect } from 'react';
import { enrollmentService, studentService, courseService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { LoadingSpinner, EmptyState } from '../components/StatusComponents';

const EnrollmentsPage = () => {

  const { isAdmin, isTeacher } = useAuth();

  const canEdit = isAdmin || isTeacher;


  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    studentId:'',
    courseId:''
  });

  const [formErrors,setFormErrors] = useState({});
  const [submitting,setSubmitting] = useState(false);


  useEffect(()=>{

    fetchEnrollments();

    studentService.getAll()
    .then(res=>setStudents(res.data))
    .catch(()=>{});


    courseService.getAll()
    .then(res=>setCourses(res.data))
    .catch(()=>{});


  },[]);



  const fetchEnrollments = async()=>{

    try{

      const res = await enrollmentService.getAll();

      setEnrollments(res.data);

    }catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  };



  const openCreateModal=()=>{

    if(!canEdit) return;

    setFormData({
      studentId:'',
      courseId:''
    });

    setFormErrors({});

    setShowModal(true);

  };



  const handleSubmit = async(e)=>{

    e.preventDefault();


    if(!canEdit) return;


    const errors={};


    if(!formData.studentId)
      errors.studentId="Select student";


    if(!formData.courseId)
      errors.courseId="Select course";


    if(Object.keys(errors).length){

      setFormErrors(errors);
      return;

    }


    setSubmitting(true);


    try{


      await enrollmentService.create(
        Number(formData.studentId),
        Number(formData.courseId)
      );


      setShowModal(false);

      fetchEnrollments();



    }catch(err){

      setFormErrors({
        api:err.response?.data?.message || "Enrollment failed"
      });

    }
    finally{

      setSubmitting(false);

    }


  };



  const handleStatusChange = async(id,status)=>{

    if(!canEdit) return;


    try{

      await enrollmentService.updateStatus(id,status);

      fetchEnrollments();


    }catch(err){

      alert("Failed updating status");

    }


  };



  const handleDelete = async(id)=>{


    if(!isAdmin){

      alert("Only admin can delete enrollments");

      return;

    }


    if(!window.confirm("Delete enrollment?"))
      return;


    try{

      await enrollmentService.delete(id);

      fetchEnrollments();


    }catch(err){

      alert("Delete failed");

    }


  };

const getStatusColor = (status) => {
  switch(status){

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

  if (loading)
  return <LoadingSpinner message="Loading enrollments..." />;


return (

<div className="min-h-screen bg-gray-50">

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">

<div>

<h1 className="text-3xl font-bold text-gray-900">
Enrollments
</h1>

<p className="text-gray-500 mt-1">
Manage student course enrollments
</p>

</div>


{canEdit && (

<button
onClick={openCreateModal}
className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold text-sm"
>

+ New Enrollment

</button>

)}

</div>



{enrollments.length === 0 ? (

<EmptyState message="No enrollments found." />

):(


<div className="bg-white rounded-2xl shadow-lg overflow-hidden">


<div className="overflow-x-auto">


<table className="w-full">


<thead>

<tr className="bg-gradient-to-r from-purple-50 to-violet-50">


<th className="px-4 py-4 text-left text-xs font-semibold">
Student
</th>


<th className="px-4 py-4 text-left text-xs font-semibold">
Course
</th>


<th className="px-4 py-4 text-left text-xs font-semibold">
Date
</th>


<th className="px-4 py-4 text-left text-xs font-semibold">
Grade
</th>


<th className="px-4 py-4 text-left text-xs font-semibold">
Status
</th>


<th className="px-4 py-4 text-right text-xs font-semibold">
Actions
</th>


</tr>

</thead>



<tbody className="divide-y">


{enrollments.map((enr)=>(


<tr key={enr.id}>


<td className="px-4 py-3 text-sm font-semibold">
{enr.studentName}
</td>


<td className="px-4 py-3 text-sm">
{enr.courseName}
</td>


<td className="px-4 py-3 text-sm">
{enr.enrollmentDate}
</td>


<td className="px-4 py-3 text-sm">
{enr.grade || "-"}
</td>



<td className="px-4 py-3">


{canEdit ? (

<select

value={enr.status}

onChange={(e)=>
handleStatusChange(
enr.id,
e.target.value
)
}

className={`px-2 py-1 rounded-full text-xs ${getStatusColor(enr.status)}`}

>


<option value="ACTIVE">
ACTIVE
</option>


<option value="COMPLETED">
COMPLETED
</option>


<option value="DROPPED">
DROPPED
</option>


</select>


):(


<span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(enr.status)}`}>

{enr.status}

</span>


)}


</td>




<td className="px-4 py-3 text-right">


{isAdmin && (

<button

onClick={()=>handleDelete(enr.id)}

className="text-red-500 hover:text-red-700 text-sm"

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

onClose={()=>setShowModal(false)}

title="New Enrollment"

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




<div>


<label className="block text-sm font-semibold mb-1">

Student *

</label>


<select

value={formData.studentId}

onChange={(e)=>

setFormData({

...formData,

studentId:e.target.value

})

}

className="w-full px-3 py-2 border rounded-lg"

>


<option value="">
Select Student
</option>



{students.map(s=>(

<option

key={s.id}

value={s.id}

>

{s.firstName} {s.lastName}

</option>


))}



</select>


</div>




<div>


<label className="block text-sm font-semibold mb-1">

Course *

</label>


<select

value={formData.courseId}

onChange={(e)=>

setFormData({

...formData,

courseId:e.target.value

})

}

className="w-full px-3 py-2 border rounded-lg"

>


<option value="">
Select Course
</option>



{courses.map(c=>(

<option

key={c.id}

value={c.id}

>

{c.courseName}

</option>


))}



</select>


</div>




<div className="flex justify-end gap-3">


<button

type="button"

onClick={()=>setShowModal(false)}

className="px-5 py-2 border rounded-lg"

>

Cancel

</button>



<button

disabled={submitting}

className="px-5 py-2 bg-purple-600 text-white rounded-lg"

>

{submitting ? "Saving..." : "Enroll"}

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