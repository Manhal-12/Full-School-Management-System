package com.schoolmanagement.service;

import com.schoolmanagement.dto.TeacherDTO;
import com.schoolmanagement.entity.Teacher;
import com.schoolmanagement.exception.ResourceNotFoundException;
import com.schoolmanagement.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TeacherDTO getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        return convertToDTO(teacher);
    }

    @Transactional
    public TeacherDTO createTeacher(TeacherDTO dto) {
        Teacher teacher = new Teacher();
        convertToEntity(dto, teacher);
        teacher = teacherRepository.save(teacher);
        return convertToDTO(teacher);
    }

    @Transactional
    public TeacherDTO updateTeacher(Long id, TeacherDTO dto) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        convertToEntity(dto, teacher);
        teacher = teacherRepository.save(teacher);
        return convertToDTO(teacher);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        teacherRepository.delete(teacher);
    }

    private TeacherDTO convertToDTO(Teacher teacher) {
        return TeacherDTO.builder()
                .id(teacher.getId())
                .teacherId(teacher.getTeacherId())
                .firstName(teacher.getFirstName())
                .lastName(teacher.getLastName())
                .email(teacher.getEmail())
                .phone(teacher.getPhone())
                .specialization(teacher.getSpecialization())
                .hireDate(teacher.getHireDate())
                .gender(teacher.getGender() != null ? teacher.getGender().name() : null)
                .address(teacher.getAddress())
                .build();
    }

    private void convertToEntity(TeacherDTO dto, Teacher teacher) {
        teacher.setTeacherId(dto.getTeacherId());
        teacher.setFirstName(dto.getFirstName());
        teacher.setLastName(dto.getLastName());
        teacher.setEmail(dto.getEmail());
        teacher.setPhone(dto.getPhone());
        teacher.setSpecialization(dto.getSpecialization());
        teacher.setHireDate(dto.getHireDate());
        if (dto.getGender() != null) {
            teacher.setGender(Teacher.Gender.valueOf(dto.getGender()));
        }
        teacher.setAddress(dto.getAddress());
    }
}
