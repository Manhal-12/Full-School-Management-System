package com.schoolmanagement.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDTO {

    private Long id;

    @NotBlank(message = "Student ID is required")
    @Size(min = 2, max = 20, message = "Student ID must be between 2 and 20 characters")
    private String studentId;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @Size(max = 200, message = "Address must not exceed 200 characters")
    private String address;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Grade is required")
    @Size(min = 1, max = 20, message = "Grade must be between 1 and 20 characters")
    private String grade;

    @NotNull(message = "Enrollment date is required")
    private LocalDate enrollmentDate;

    @Size(max = 100, message = "Guardian name must not exceed 100 characters")
    private String guardianName;

    @Size(max = 20, message = "Guardian phone must not exceed 20 characters")
    private String guardianPhone;

    private Long classId;
    private String className;
}
