package com.schoolmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // Class Name
    // =========================
    @NotBlank(message = "Class name is required")
    @Size(min = 2, max = 30, message = "Class name must be between 2 and 30 characters")
    @Pattern(
            regexp = "^[A-Za-z0-9\\- ]+$",
            message = "Class name can contain only letters, numbers, spaces and hyphens"
    )
    @Column(nullable = false, unique = true, length = 30)
    private String className;

    // =========================
    // Grade
    // =========================
    @NotBlank(message = "Grade is required")
    @Size(min = 1, max = 20, message = "Grade must not exceed 20 characters")
    @Pattern(
            regexp = "^[A-Za-z0-9 ]+$",
            message = "Invalid grade format"
    )
    @Column(nullable = false, length = 20)
    private String grade;

    // =========================
    // Section
    // =========================
    @Size(max = 10, message = "Section must not exceed 10 characters")
    @Pattern(
            regexp = "^[A-Za-z0-9]*$",
            message = "Section can contain only letters and numbers"
    )
    @Column(length = 10)
    private String section;

    // =========================
    // Capacity
    // =========================
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 100, message = "Capacity cannot exceed 100")
    @Column(nullable = false)
    private Integer capacity;

    // =========================
    // Room Number
    // =========================
    @Size(max = 20, message = "Room number must not exceed 20 characters")
    @Pattern(
            regexp = "^[A-Za-z0-9\\-]*$",
            message = "Invalid room number"
    )
    @Column(length = 20)
    private String roomNumber;

    // =========================
    // Teacher
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    // =========================
    // Students
    // =========================
    @OneToMany(
            mappedBy = "schoolClass",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Student> students = new ArrayList<>();
}