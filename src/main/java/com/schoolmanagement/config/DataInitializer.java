//package com.schoolmanagement.config;
//
//import com.schoolmanagement.entity.*;
//import com.schoolmanagement.repository.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDate;
//
//@Component
//public class DataInitializer implements CommandLineRunner {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private StudentRepository studentRepository;
//
//    @Autowired
//    private TeacherRepository teacherRepository;
//
//    @Autowired
//    private CourseRepository courseRepository;
//
//    @Autowired
//    private SchoolClassRepository classRepository;
//
//    @Autowired
//    private EnrollmentRepository enrollmentRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) {
//        if (userRepository.count() == 0) {
//            // Admin user
//            User admin = User.builder()
//                    .username("admin")
//                    .email("admin@school.edu")
//                    .password(passwordEncoder.encode("admin123"))
//                    .fullName("System Administrator")
//                    .role(User.Role.ROLE_ADMIN)
//                    .build();
//            userRepository.save(admin);
//
//            // Teacher user
//            User teacherUser = User.builder()
//                    .username("farhan.alin")
//                    .email("farhan.alin@school.edu")
//                    .password(passwordEncoder.encode("password123"))
//                    .fullName("Farhan Osman Alin")
//                    .role(User.Role.ROLE_TEACHER)
//                    .build();
//            userRepository.save(teacherUser);
//
//            // Student user
//            User studentUser = User.builder()
//                    .username("aisha.musse")
//                    .email("aisha.musse@school.edu")
//                    .password(passwordEncoder.encode("password123"))
//                    .fullName("Aisha Musse Mohamud")
//                    .role(User.Role.ROLE_STUDENT)
//                    .build();
//            userRepository.save(studentUser);
//        }
//
//        if (teacherRepository.count() == 0) {
//            Teacher t1 = Teacher.builder()
//                    .teacherId("TCH001").firstName("Farhan").lastName("Osman Alin")
//                    .email("farhan.alin@school.edu").phone("+252-61-2345678")
//                    .specialization("Mathematics").hireDate(LocalDate.of(2020, 9, 1))
//                    .gender(Teacher.Gender.MALE).address("Hodan District, Mogadishu").build();
//
//            Teacher t2 = Teacher.builder()
//                    .teacherId("TCH002").firstName("Yusro").lastName("Mohamed Ahmed")
//                    .email("yusro.ahmed@school.edu").phone("+252-61-3456789")
//                    .specialization("English").hireDate(LocalDate.of(2021, 1, 15))
//                    .gender(Teacher.Gender.FEMALE).address("Warta Nabada, Mogadishu").build();
//
//            Teacher t3 = Teacher.builder()
//                    .teacherId("TCH003").firstName("Abdirahman").lastName("Muse Ibrahim")
//                    .email("abdirahman.ibrahim@school.edu").phone("+252-61-4567890")
//                    .specialization("Science").hireDate(LocalDate.of(2019, 8, 20))
//                    .gender(Teacher.Gender.MALE).address("Yaqshid, Mogadishu").build();
//
//            Teacher t4 = Teacher.builder()
//                    .teacherId("TCH004").firstName("Farah").lastName("Mohamed")
//                    .email("farah.mohamed@school.edu").phone("+252-61-5678901")
//                    .specialization("Computer Science").hireDate(LocalDate.of(2022, 3, 1))
//                    .gender(Teacher.Gender.MALE).address("Karan, Mogadishu").build();
//
//            teacherRepository.save(t1);
//            teacherRepository.save(t2);
//            teacherRepository.save(t3);
//            teacherRepository.save(t4);
//        }
//
//        if (courseRepository.count() == 0) {
//            Teacher t1 = teacherRepository.findByTeacherId("TCH001").orElse(null);
//            Teacher t2 = teacherRepository.findByTeacherId("TCH002").orElse(null);
//            Teacher t3 = teacherRepository.findByTeacherId("TCH003").orElse(null);
//            Teacher t4 = teacherRepository.findByTeacherId("TCH004").orElse(null);
//
//            courseRepository.save(Course.builder().courseCode("MATH101").courseName("Algebra I").description("Introduction to algebraic concepts").credits(3).grade("9").teacher(t1).build());
//            courseRepository.save(Course.builder().courseCode("ENG101").courseName("English Literature").description("Study of classic and modern literature").credits(3).grade("9").teacher(t2).build());
//            courseRepository.save(Course.builder().courseCode("SCI101").courseName("Biology").description("Introduction to life sciences").credits(4).grade("10").teacher(t3).build());
//            courseRepository.save(Course.builder().courseCode("CS101").courseName("Introduction to Programming").description("Learn programming fundamentals").credits(3).grade("11").teacher(t4).build());
//            courseRepository.save(Course.builder().courseCode("MATH201").courseName("Geometry").description("Advanced geometry concepts").credits(3).grade("10").teacher(t1).build());
//            courseRepository.save(Course.builder().courseCode("ENG201").courseName("Creative Writing").description("Develop creative writing skills").credits(2).grade("10").teacher(t2).build());
//        }
//
//        if (classRepository.count() == 0) {
//            Teacher t1 = teacherRepository.findByTeacherId("TCH001").orElse(null);
//            Teacher t2 = teacherRepository.findByTeacherId("TCH002").orElse(null);
//
//            classRepository.save(SchoolClass.builder().className("Grade 9-A").grade("9").section("A").capacity(35).roomNumber("R101").teacher(t1).build());
//            classRepository.save(SchoolClass.builder().className("Grade 9-B").grade("9").section("B").capacity(35).roomNumber("R102").teacher(t2).build());
//            classRepository.save(SchoolClass.builder().className("Grade 10-A").grade("10").section("A").capacity(30).roomNumber("R201").teacher(t1).build());
//        }
//
//        if (studentRepository.count() == 0) {
//            SchoolClass cl1 = classRepository.findAll().get(0);
//            SchoolClass cl2 = classRepository.findAll().get(1);
//            SchoolClass cl3 = classRepository.findAll().get(2);
//
//            studentRepository.save(Student.builder().studentId("STU001").firstName("Aisha").lastName("Musse Mohamud").email("aisha.musse@school.edu").phone("+252-61-1111111").dateOfBirth(LocalDate.of(2009, 5, 12)).address("Hodan, Mogadishu").gender(Student.Gender.FEMALE).grade("9").enrollmentDate(LocalDate.of(2025, 9, 1)).guardianName("Ahmed Mohamud").guardianPhone("+252-61-2222222").schoolClass(cl1).build());
//
//            studentRepository.save(Student.builder().studentId("STU002").firstName("Mohamed").lastName("Abdullahi").email("mohamed.abdullahi@school.edu").phone("+252-61-3333333").dateOfBirth(LocalDate.of(2009, 8, 23)).address("Karan, Mogadishu").gender(Student.Gender.MALE).grade("9").enrollmentDate(LocalDate.of(2025, 9, 1)).guardianName("Abdullahi Yusuf").guardianPhone("+252-61-4444444").schoolClass(cl2).build());
//
//            studentRepository.save(Student.builder().studentId("STU003").firstName("Nasra").lastName("Ibrahim").email("nasra.ibrahim@school.edu").phone("+252-61-5555555").dateOfBirth(LocalDate.of(2008, 3, 15)).address("Waberi, Mogadishu").gender(Student.Gender.FEMALE).grade("10").enrollmentDate(LocalDate.of(2024, 9, 1)).guardianName("Ibrahim Hassan").guardianPhone("+252-61-6666666").schoolClass(cl3).build());
//
//            studentRepository.save(Student.builder().studentId("STU004").firstName("Omar").lastName("Dahir").email("omar.dahir@school.edu").phone("+252-61-7777777").dateOfBirth(LocalDate.of(2009, 11, 30)).address("Daynile, Mogadishu").gender(Student.Gender.MALE).grade("9").enrollmentDate(LocalDate.of(2025, 9, 1)).guardianName("Dahir Ahmed").guardianPhone("+252-61-8888888").schoolClass(cl1).build());
//
//            studentRepository.save(Student.builder().studentId("STU005").firstName("Khadija").lastName("Ali").email("khadija.ali@school.edu").phone("+252-61-9999999").dateOfBirth(LocalDate.of(2008, 7, 4)).address("Shangani, Mogadishu").gender(Student.Gender.FEMALE).grade("10").enrollmentDate(LocalDate.of(2024, 9, 1)).guardianName("Ali Nor").guardianPhone("+252-61-0000000").schoolClass(cl3).build());
//
//            studentRepository.save(Student.builder().studentId("STU006").firstName("Abdi").lastName("Rashid").email("abdi.rashid@school.edu").phone("+252-61-1234567").dateOfBirth(LocalDate.of(2009, 1, 18)).address("Bondhere, Mogadishu").gender(Student.Gender.MALE).grade("9").enrollmentDate(LocalDate.of(2025, 9, 1)).guardianName("Rashid Muse").guardianPhone("+252-61-7654321").schoolClass(cl2).build());
//        }
//
//        if (enrollmentRepository.count() == 0) {
//            Student s1 = studentRepository.findByStudentId("STU001").orElse(null);
//            Student s2 = studentRepository.findByStudentId("STU002").orElse(null);
//            Student s3 = studentRepository.findByStudentId("STU003").orElse(null);
//            Course c1 = courseRepository.findByCourseCode("MATH101").orElse(null);
//            Course c2 = courseRepository.findByCourseCode("ENG101").orElse(null);
//            Course c3 = courseRepository.findByCourseCode("SCI101").orElse(null);
//            Course c4 = courseRepository.findByCourseCode("MATH201").orElse(null);
//
//            if (s1 != null && c1 != null)
//                enrollmentRepository.save(Enrollment.builder().student(s1).course(c1).enrollmentDate(LocalDate.now()).status(Enrollment.Status.ACTIVE).build());
//            if (s1 != null && c2 != null)
//                enrollmentRepository.save(Enrollment.builder().student(s1).course(c2).enrollmentDate(LocalDate.now()).status(Enrollment.Status.ACTIVE).build());
//            if (s2 != null && c1 != null)
//                enrollmentRepository.save(Enrollment.builder().student(s2).course(c1).enrollmentDate(LocalDate.now()).status(Enrollment.Status.ACTIVE).build());
//            if (s2 != null && c2 != null)
//                enrollmentRepository.save(Enrollment.builder().student(s2).course(c2).enrollmentDate(LocalDate.now()).status(Enrollment.Status.ACTIVE).build());
//            if (s3 != null && c3 != null)
//                enrollmentRepository.save(Enrollment.builder().student(s3).course(c3).enrollmentDate(LocalDate.now()).status(Enrollment.Status.ACTIVE).build());
//            if (s3 != null && c4 != null)
//                enrollmentRepository.save(Enrollment.builder().student(s3).course(c4).enrollmentDate(LocalDate.now()).status(Enrollment.Status.ACTIVE).build());
//        }
//    }
//}
