package com.schoolmanagement.controller;

import com.schoolmanagement.dto.SchoolClassDTO;
import com.schoolmanagement.service.ClassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    @GetMapping
    public ResponseEntity<List<SchoolClassDTO>> getAllClasses() {
        return ResponseEntity.ok(classService.getAllClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolClassDTO> getClassById(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getClassById(id));
    }

    @PostMapping
    public ResponseEntity<SchoolClassDTO> createClass(@Valid @RequestBody SchoolClassDTO classDTO) {
        return new ResponseEntity<>(classService.createClass(classDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolClassDTO> updateClass(@PathVariable Long id,
                                                       @Valid @RequestBody SchoolClassDTO classDTO) {
        return ResponseEntity.ok(classService.updateClass(id, classDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/grade/{grade}")
    public ResponseEntity<List<SchoolClassDTO>> getClassesByGrade(@PathVariable String grade) {
        return ResponseEntity.ok(classService.getClassesByGrade(grade));
    }
}
