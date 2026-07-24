package com.schoolmanagement.service;

import com.schoolmanagement.dto.StudentDTO;
import com.schoolmanagement.entity.SchoolClass;
import com.schoolmanagement.entity.Student;
import com.schoolmanagement.exception.ResourceNotFoundException;
import com.schoolmanagement.repository.SchoolClassRepository;
import com.schoolmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SchoolClassRepository schoolClassRepository;

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return convertToDTO(student);
    }

    @Transactional
    public StudentDTO createStudent(StudentDTO dto) {
        Student student = new Student();
        convertToEntity(dto, student);
        student = studentRepository.save(student);
        return convertToDTO(student);
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        convertToEntity(dto, student);
        student = studentRepository.save(student);
        return convertToDTO(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    public List<StudentDTO> getStudentsByGrade(String grade) {
        return studentRepository.findByGrade(grade).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private StudentDTO convertToDTO(Student student) {
        return StudentDTO.builder()
                .id(student.getId())
                .studentId(student.getStudentId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .dateOfBirth(student.getDateOfBirth())
                .address(student.getAddress())
                .gender(student.getGender() != null ? student.getGender().name() : null)
                .grade(student.getGrade())
                .enrollmentDate(student.getEnrollmentDate())
                .guardianName(student.getGuardianName())
                .guardianPhone(student.getGuardianPhone())
                .classId(student.getSchoolClass() != null ? student.getSchoolClass().getId() : null)
                .className(student.getSchoolClass() != null ? student.getSchoolClass().getClassName() : null)
                .build();
    }

    private void convertToEntity(StudentDTO dto, Student student) {
        student.setStudentId(dto.getStudentId());
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setAddress(dto.getAddress());
        if (dto.getGender() != null) {
            student.setGender(Student.Gender.valueOf(dto.getGender()));
        }
        student.setGrade(dto.getGrade());
        student.setEnrollmentDate(dto.getEnrollmentDate());
        student.setGuardianName(dto.getGuardianName());
        student.setGuardianPhone(dto.getGuardianPhone());

        if (dto.getClassId() != null) {
            SchoolClass schoolClass = schoolClassRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + dto.getClassId()));
            student.setSchoolClass(schoolClass);
        } else {
            student.setSchoolClass(null);
        }
    }
}
