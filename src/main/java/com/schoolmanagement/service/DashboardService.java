package com.schoolmanagement.service;

import com.schoolmanagement.dto.DashboardStats;
import com.schoolmanagement.entity.Student;
import com.schoolmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SchoolClassRepository classRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public DashboardStats getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalCourses = courseRepository.count();
        long totalClasses = classRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        long maleStudents = studentRepository.countByGender(Student.Gender.MALE);
        long femaleStudents = studentRepository.countByGender(Student.Gender.FEMALE);

        return DashboardStats.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalCourses(totalCourses)
                .totalClasses(totalClasses)
                .totalEnrollments(totalEnrollments)
                .maleStudents(maleStudents)
                .femaleStudents(femaleStudents)
                .build();
    }
}
