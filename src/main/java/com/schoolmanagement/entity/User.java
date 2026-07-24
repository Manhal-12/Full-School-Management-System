package com.schoolmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= USERNAME =================

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    @Pattern(
            regexp = "^[a-zA-Z0-9._]+$",
            message = "Username can contain only letters, numbers, dot and underscore"
    )
    @Column(nullable = false, unique = true, length = 30)
    private String username;

    // ================= EMAIL =================

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // ================= PASSWORD =================

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100,
            message = "Password must be between 8 and 100 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).*$",
            message = "Password must contain uppercase, lowercase, number and special character"
    )
    @Column(nullable = false)
    private String password;

    // ================= FULL NAME =================

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 50,
            message = "Full name must be between 3 and 50 characters")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Full name can contain only letters and spaces"
    )
    @Column(nullable = false, length = 50)
    private String fullName;

    // ================= ROLE =================

    @NotNull(message = "Role is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    // ================= PHONE =================

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{8,15}$",
            message = "Phone number must contain only digits and be 8 to 15 digits"
    )
    @Column(length = 20)
    private String phone;

    // ================= ADDRESS =================

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 200,
            message = "Address must be between 5 and 200 characters")
    @Column(length = 200)
    private String address;

    // ================= ROLE ENUM =================

    public enum Role {
        ROLE_ADMIN,
        ROLE_TEACHER,
        ROLE_STUDENT
    }
}