package com.schoolmanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "enrollments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= Student =================

    @NotNull(message = "Student is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private Student student;

    // ================= Course =================

    @NotNull(message = "Course is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore
    private Course course;

    // ================= Enrollment Date =================

    @NotNull(message = "Enrollment date is required")
    @PastOrPresent(message = "Enrollment date cannot be in the future")
    @Column(nullable = false)
    private LocalDate enrollmentDate;

    // ================= Grade =================

    @Pattern(
            regexp = "^(A\\+|A|A-|B\\+|B|B-|C\\+|C|C-|D\\+|D|D-|F)?$",
            message = "Invalid grade"
    )
    @Column(length = 5)
    private String grade;

    // ================= Status =================

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private Status status;

    public enum Status {
        ACTIVE,
        COMPLETED,
        DROPPED
    }
}