package com.schoolmanagement.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolClassDTO {

    private Long id;

    @NotBlank(message = "Class name is required")
    @Size(min = 2, max = 30, message = "Class name must be between 2 and 30 characters")
    private String className;

    @NotBlank(message = "Grade is required")
    @Size(min = 1, max = 20, message = "Grade must be between 1 and 20 characters")
    private String grade;

    @Size(max = 10, message = "Section must not exceed 10 characters")
    private String section;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 100, message = "Capacity must be at most 100")
    private Integer capacity;

    @Size(max = 20, message = "Room number must not exceed 20 characters")
    private String roomNumber;

    private Long teacherId;
    private String teacherName;
    private Integer studentCount;
}
