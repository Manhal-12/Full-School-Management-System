package com.schoolmanagement.repository;

import com.schoolmanagement.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    List<SchoolClass> findByGrade(String grade);
    List<SchoolClass> findByTeacherId(Long teacherId);
}
