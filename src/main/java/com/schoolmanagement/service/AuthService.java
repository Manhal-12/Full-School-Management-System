package com.schoolmanagement.service;

import com.schoolmanagement.dto.*;
import com.schoolmanagement.entity.User;
import com.schoolmanagement.exception.BadRequestException;
import com.schoolmanagement.exception.DuplicateResourceException;
import com.schoolmanagement.exception.ResourceNotFoundException;
import com.schoolmanagement.repository.UserRepository;
import com.schoolmanagement.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(loginRequest.getUsername());

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return buildAuthResponse(user, jwt);
    }

    public AuthResponse register(RegisterRequest registerRequest) {

        // Username check
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new DuplicateResourceException("Username is already taken");
        }

        // Email check
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email is already in use");
        }

        // Validate role
        User.Role role;

        try {
            role = User.Role.valueOf(registerRequest.getRole());
        } catch (Exception e) {
            throw new BadRequestException(
                    "Role must be ROLE_ADMIN, ROLE_TEACHER or ROLE_STUDENT");
        }

        /*
         * =========================================
         * FIRST USER MUST BE ADMIN
         * =========================================
         */

        if (userRepository.count() == 0) {

            if (role != User.Role.ROLE_ADMIN) {
                throw new BadRequestException(
                        "The first registered user must be ROLE_ADMIN");
            }

        } else {

            Authentication authentication =
                    SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                throw new BadRequestException(
                        "Only ADMIN can register new users");
            }

            boolean isAdmin = authentication.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(authority -> authority.equals("ROLE_ADMIN"));

            if (!isAdmin) {
                throw new BadRequestException(
                        "Only ADMIN can register new users");
            }
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .role(role)
                .phone(registerRequest.getPhone())
                .address(registerRequest.getAddress())
                .build();

        user = userRepository.save(user);

        String jwt = jwtUtils.generateJwtToken(user.getUsername());

        return buildAuthResponse(user, jwt);
    }

    // Admin-only: Get all users
    public List<UserDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Admin-only: Get user by ID
    public UserDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        return convertToDTO(user);
    }

    // Admin-only: Update user
    public AuthResponse updateUser(Long id, RegisterRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        // Username validation
        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {

            throw new DuplicateResourceException("Username is already taken");
        }

        // Email validation
        if (!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {

            throw new DuplicateResourceException("Email is already in use");
        }

        // Role validation
        User.Role role;

        try {
            role = User.Role.valueOf(request.getRole());
        } catch (Exception e) {
            throw new BadRequestException(
                    "Role must be ROLE_ADMIN, ROLE_TEACHER or ROLE_STUDENT");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(role);
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        if (request.getPassword() != null &&
                !request.getPassword().trim().isEmpty()) {

            user.setPassword(
                    passwordEncoder.encode(request.getPassword()));
        }

        user = userRepository.save(user);

        return buildAuthResponse(user, null);
    }

    // Admin-only: Delete user
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        userRepository.delete(user);
    }

    private AuthResponse buildAuthResponse(User user, String jwt) {

        return AuthResponse.builder()
                .token(jwt)
                .tokenType(jwt != null ? "Bearer" : null)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .address(user.getAddress())
                .build();
    }

    private UserDTO convertToDTO(User user) {

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .address(user.getAddress())
                .build();
    }}