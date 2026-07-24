package com.schoolmanagement.config;

import com.schoolmanagement.security.JwtAuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthTokenFilter jwtAuthTokenFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                                // Public endpoints
                                .requestMatchers("/api/auth/login").permitAll()

                                // Dashboard - All authenticated users
                                .requestMatchers(HttpMethod.GET, "/api/dashboard/**").hasAnyRole("ADMIN", "TEACHER", "STUDENT")

                                // Students - Admin & Teacher can manage, Student can view
                                .requestMatchers(HttpMethod.GET, "/api/students/**").hasAnyRole("ADMIN", "TEACHER", "STUDENT")
                                .requestMatchers(HttpMethod.POST, "/api/students/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(HttpMethod.PUT, "/api/students/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(HttpMethod.DELETE, "/api/students/**").hasRole("ADMIN")

                                // Teachers - Admin can manage, others can view
                                .requestMatchers(HttpMethod.GET, "/api/teachers/**").hasAnyRole("ADMIN", "TEACHER", "STUDENT")
                                .requestMatchers(HttpMethod.POST, "/api/teachers/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/teachers/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/teachers/**").hasRole("ADMIN")

                                // Courses - Admin & Teacher can manage, Student can view
                                .requestMatchers(HttpMethod.GET, "/api/courses/**").hasAnyRole("ADMIN", "TEACHER", "STUDENT")
                                .requestMatchers(HttpMethod.POST, "/api/courses/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasRole("ADMIN")

                                // Classes - Admin & Teacher can manage, Student can view
                                .requestMatchers(HttpMethod.GET, "/api/classes/**").hasAnyRole("ADMIN", "TEACHER", "STUDENT")
                                .requestMatchers(HttpMethod.POST, "/api/classes/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(HttpMethod.PUT, "/api/classes/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(HttpMethod.DELETE, "/api/classes/**").hasRole("ADMIN")

                                // Enrollments - Admin & Teacher can manage, Student can view own
                                .requestMatchers(HttpMethod.GET, "/api/enrollments/**").hasAnyRole("ADMIN", "TEACHER" , "STUDENT" )
                                .requestMatchers(HttpMethod.POST, "/api/enrollments/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(HttpMethod.PUT, "/api/enrollments/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(HttpMethod.DELETE, "/api/enrollments/**").hasRole("ADMIN")

                                // User Management - Admin only

                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
//                .requestMatchers(HttpMethod.POST, "/api/auth/register").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/auth/users/**").hasRole("ADMIN")

                                // All other requests need authentication
                                .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}