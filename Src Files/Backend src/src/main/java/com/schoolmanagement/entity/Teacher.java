package com.schoolmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= Teacher ID =================

    @NotBlank(message = "Teacher ID is required")
    @Size(min = 3, max = 20,
            message = "Teacher ID must be between 3 and 20 characters")
    @Pattern(
            regexp = "^[A-Za-z0-9_-]+$",
            message = "Teacher ID can contain only letters, numbers, hyphen and underscore"
    )
    @Column(nullable = false, unique = true, length = 20)
    private String teacherId;

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

    // ================= Specialization =================

    @NotBlank(message = "Specialization is required")
    @Size(min = 2, max = 100,
            message = "Specialization must be between 2 and 100 characters")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Specialization can contain only letters"
    )
    @Column(nullable = false, length = 100)
    private String specialization;

    // ================= Hire Date =================

    @NotNull(message = "Hire date is required")
    @PastOrPresent(message = "Hire date cannot be in the future")
    @Column(nullable = false)
    private LocalDate hireDate;

    // ================= Gender =================

    @NotNull(message = "Gender is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    // ================= Address =================

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 200,
            message = "Address must be between 5 and 200 characters")
    @Column(nullable = false, length = 200)
    private String address;

    public enum Gender {
        MALE,
        FEMALE
    }
}