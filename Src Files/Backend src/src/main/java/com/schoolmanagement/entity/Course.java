package com.schoolmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= Course Code =================

    @NotBlank(message = "Course code is required")
    @Size(min = 2, max = 20,
            message = "Course code must be between 2 and 20 characters")
    @Pattern(
            regexp = "^[A-Za-z0-9-]+$",
            message = "Course code can contain only letters, numbers and hyphen"
    )
    @Column(nullable = false, unique = true, length = 20)
    private String courseCode;

    // ================= Course Name =================

    @NotBlank(message = "Course name is required")
    @Size(min = 3, max = 100,
            message = "Course name must be between 3 and 100 characters")
    @Pattern(
            regexp = "^[A-Za-z0-9 ]+$",
            message = "Course name can contain only letters, numbers and spaces"
    )
    @Column(nullable = false, length = 100)
    private String courseName;

    // ================= Description =================

    @Size(max = 500,
            message = "Description cannot exceed 500 characters")
    @Column(length = 500)
    private String description;

    // ================= Credits =================

    @NotNull(message = "Credits are required")
    @Min(value = 1, message = "Credits must be at least 1")
    @Max(value = 12, message = "Credits cannot exceed 12")
    @Column(nullable = false)
    private Integer credits;

    // ================= Grade =================

    @NotBlank(message = "Grade is required")
    @Size(min = 1, max = 20,
            message = "Grade must be between 1 and 20 characters")
    @Pattern(
            regexp = "^[A-Za-z0-9 ]+$",
            message = "Invalid grade format"
    )
    @Column(nullable = false, length = 20)
    private String grade;

    // ================= Teacher =================

    @NotNull(message = "Teacher is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    // ================= Enrollments =================

    @OneToMany(
            mappedBy = "course",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Enrollment> enrollments = new ArrayList<>();
}