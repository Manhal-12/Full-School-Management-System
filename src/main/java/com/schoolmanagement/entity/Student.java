package com.schoolmanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= Student ID =================

    @NotBlank(message = "Student ID is required")
    @Size(min = 3, max = 20,
            message = "Student ID must be between 3 and 20 characters")
    @Pattern(
            regexp = "^[A-Za-z0-9_-]+$",
            message = "Student ID can contain only letters, numbers, hyphen and underscore"
    )
    @Column(nullable = false, unique = true, length = 20)
    private String studentId;

    // ================= First Name =================

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50,
            message = "First name must be between 2 and 50 characters")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "First name can contain only letters"
    )
    @Column(nullable = false, length = 50)
    private String firstName;

    // ================= Last Name =================

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50,
            message = "Last name must be between 2 and 50 characters")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Last name can contain only letters"
    )
    @Column(nullable = false, length = 50)
    private String lastName;

    // ================= Email =================

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100,
            message = "Email cannot exceed 100 characters")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // ================= Phone =================

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{8,15}$",
            message = "Phone number must contain only digits and be 8 to 15 digits"
    )
    @Column(nullable = false, length = 20)
    private String phone;

    // ================= Date of Birth =================

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    // ================= Address =================

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 200,
            message = "Address must be between 5 and 200 characters")
    @Column(nullable = false, length = 200)
    private String address;

    // ================= Gender =================

    @NotNull(message = "Gender is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    // ================= Grade =================

    @NotBlank(message = "Grade is required")
    @Size(min = 1, max = 20,
            message = "Grade must be between 1 and 20 characters")
    @Column(nullable = false, length = 20)
    private String grade;

    // ================= Enrollment Date =================

    @NotNull(message = "Enrollment date is required")
    @PastOrPresent(message = "Enrollment date cannot be in the future")
    @Column(nullable = false)
    private LocalDate enrollmentDate;

    // ================= Guardian Name =================

    @NotBlank(message = "Guardian name is required")
    @Size(min = 2, max = 100,
            message = "Guardian name must be between 2 and 100 characters")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Guardian name can contain only letters"
    )
    @Column(nullable = false, length = 100)
    private String guardianName;

    // ================= Guardian Phone =================

    @NotBlank(message = "Guardian phone is required")
    @Pattern(
            regexp = "^[0-9]{8,15}$",
            message = "Guardian phone must contain only digits and be 8 to 15 digits"
    )
    @Column(nullable = false, length = 20)
    private String guardianPhone;

    // ================= School Class =================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    @JsonIgnore
    private SchoolClass schoolClass;

    public enum Gender {
        MALE,
        FEMALE
    }
}