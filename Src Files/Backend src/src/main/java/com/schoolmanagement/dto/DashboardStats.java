package com.schoolmanagement.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {

    private long totalStudents;
    private long totalTeachers;
    private long totalCourses;
    private long totalClasses;
    private long totalEnrollments;
    private long maleStudents;
    private long femaleStudents;
}
