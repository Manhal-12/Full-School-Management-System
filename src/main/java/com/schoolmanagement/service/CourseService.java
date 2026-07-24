package com.schoolmanagement.service;

import com.schoolmanagement.dto.CourseDTO;
import com.schoolmanagement.entity.Course;
import com.schoolmanagement.entity.Teacher;
import com.schoolmanagement.exception.ResourceNotFoundException;
import com.schoolmanagement.repository.CourseRepository;
import com.schoolmanagement.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return convertToDTO(course);
    }

    @Transactional
    public CourseDTO createCourse(CourseDTO dto) {
        Course course = new Course();
        convertToEntity(dto, course);
        course = courseRepository.save(course);
        return convertToDTO(course);
    }

    @Transactional
    public CourseDTO updateCourse(Long id, CourseDTO dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        convertToEntity(dto, course);
        course = courseRepository.save(course);
        return convertToDTO(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        courseRepository.delete(course);
    }

    public List<CourseDTO> getCoursesByGrade(String grade) {
        return courseRepository.findByGrade(grade).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CourseDTO convertToDTO(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .description(course.getDescription())
                .credits(course.getCredits())
                .grade(course.getGrade())
                .teacherId(course.getTeacher() != null ? course.getTeacher().getId() : null)
                .teacherName(course.getTeacher() != null
                        ? course.getTeacher().getFirstName() + " " + course.getTeacher().getLastName()
                        : null)
                .build();
    }

    private void convertToEntity(CourseDTO dto, Course course) {
        course.setCourseCode(dto.getCourseCode());
        course.setCourseName(dto.getCourseName());
        course.setDescription(dto.getDescription());
        course.setCredits(dto.getCredits());
        course.setGrade(dto.getGrade());

        if (dto.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + dto.getTeacherId()));
            course.setTeacher(teacher);
        } else {
            course.setTeacher(null);
        }
    }
}
