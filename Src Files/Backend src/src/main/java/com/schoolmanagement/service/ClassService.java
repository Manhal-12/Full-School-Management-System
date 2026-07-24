package com.schoolmanagement.service;

import com.schoolmanagement.dto.SchoolClassDTO;
import com.schoolmanagement.entity.SchoolClass;
import com.schoolmanagement.entity.Teacher;
import com.schoolmanagement.exception.ResourceNotFoundException;
import com.schoolmanagement.repository.SchoolClassRepository;
import com.schoolmanagement.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassService {

    @Autowired
    private SchoolClassRepository classRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public List<SchoolClassDTO> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SchoolClassDTO getClassById(Long id) {
        SchoolClass schoolClass = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        return convertToDTO(schoolClass);
    }

    @Transactional
    public SchoolClassDTO createClass(SchoolClassDTO dto) {
        SchoolClass schoolClass = new SchoolClass();
        convertToEntity(dto, schoolClass);
        schoolClass = classRepository.save(schoolClass);
        return convertToDTO(schoolClass);
    }

    @Transactional
    public SchoolClassDTO updateClass(Long id, SchoolClassDTO dto) {
        SchoolClass schoolClass = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        convertToEntity(dto, schoolClass);
        schoolClass = classRepository.save(schoolClass);
        return convertToDTO(schoolClass);
    }

    @Transactional
    public void deleteClass(Long id) {
        SchoolClass schoolClass = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        classRepository.delete(schoolClass);
    }

    public List<SchoolClassDTO> getClassesByGrade(String grade) {
        return classRepository.findByGrade(grade).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private SchoolClassDTO convertToDTO(SchoolClass schoolClass) {
        return SchoolClassDTO.builder()
                .id(schoolClass.getId())
                .className(schoolClass.getClassName())
                .grade(schoolClass.getGrade())
                .section(schoolClass.getSection())
                .capacity(schoolClass.getCapacity())
                .roomNumber(schoolClass.getRoomNumber())
                .teacherId(schoolClass.getTeacher() != null ? schoolClass.getTeacher().getId() : null)
                .teacherName(schoolClass.getTeacher() != null
                        ? schoolClass.getTeacher().getFirstName() + " " + schoolClass.getTeacher().getLastName()
                        : null)
                .studentCount(schoolClass.getStudents() != null ? schoolClass.getStudents().size() : 0)
                .build();
    }

    private void convertToEntity(SchoolClassDTO dto, SchoolClass schoolClass) {
        schoolClass.setClassName(dto.getClassName());
        schoolClass.setGrade(dto.getGrade());
        schoolClass.setSection(dto.getSection());
        schoolClass.setCapacity(dto.getCapacity());
        schoolClass.setRoomNumber(dto.getRoomNumber());

        if (dto.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + dto.getTeacherId()));
            schoolClass.setTeacher(teacher);
        } else {
            schoolClass.setTeacher(null);
        }
    }
}
