package com.schoolmanagement.repository;

import com.schoolmanagement.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByTeacherId(String teacherId);
    List<Teacher> findBySpecialization(String specialization);
}
