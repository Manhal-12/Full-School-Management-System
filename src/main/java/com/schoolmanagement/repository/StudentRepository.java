package com.schoolmanagement.repository;

import com.schoolmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentId(String studentId);
    List<Student> findByGrade(String grade);
    List<Student> findBySchoolClassId(Long classId);
    long countByGender(Student.Gender gender);
}
