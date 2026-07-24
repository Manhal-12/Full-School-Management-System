package com.schoolmanagement.repository;

import com.schoolmanagement.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
    List<Course> findByGrade(String grade);
    List<Course> findByTeacherId(Long teacherId);
}
