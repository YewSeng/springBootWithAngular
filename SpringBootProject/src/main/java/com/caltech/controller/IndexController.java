package com.caltech.controller;


import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.caltech.controller.response.ContactResponse;
import com.caltech.controller.response.DriverResponse;
import com.caltech.controller.response.UserResponse;
import com.caltech.pojo.AuthResponse;
import com.caltech.pojo.Contact;
import com.caltech.pojo.Driver;
import com.caltech.pojo.User;
import com.caltech.service.AdminService;
import com.caltech.service.ContactService;
import com.caltech.service.DriverService;
import com.caltech.service.UserService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@RestController
@RequestMapping("/v1/public")
@CrossOrigin("*")
public class IndexController {

    @Autowired
    private UserService userService;

    @Autowired
    private DriverService driverService;

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private ContactService contactService;

    @PostMapping("/contact")
    public ResponseEntity<ContactResponse> createEnquiry(@RequestBody Contact contact) {
    	Contact createdContact = contactService.createEnquiry(contact);
    	return ResponseEntity.ok(new ContactResponse(createdContact, "successfully submitted enquiry with point of contact as: " + createdContact.getEmail()));
    }
    
    @PostMapping("/registerUser")
    public ResponseEntity<UserResponse> registerUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(new UserResponse(createdUser, "successfully registered user with username: "+createdUser.getUsername()));
    }

    @PostMapping("/registerDriver")
    public ResponseEntity<DriverResponse> registerDriver(@RequestBody Driver driver) {
        Driver createdDriver = driverService.createDriver(driver);
        return ResponseEntity.ok(new DriverResponse(createdDriver, "successfully registered driver with username: "+createdDriver.getUsername()));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponse> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        String userType = loginRequest.getUserType().toLowerCase();
        boolean authenticationResult = false;

        switch (userType) {
            case "user":
                authenticationResult = userService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
                if (authenticationResult) {
                    session.setAttribute("authenticatedUser", userService.findByUsername(loginRequest.getUsername()).orElse(null));
                }
                break;
            case "driver":
                authenticationResult = driverService.authenticateDriver(loginRequest.getUsername(), loginRequest.getPassword());
                if (authenticationResult) {
                    session.setAttribute("authenticatedDriver", driverService.findByUsername(loginRequest.getUsername()).orElse(null));
                }
                break;
            case "admin":
                authenticationResult = adminService.authenticateAdmin(loginRequest.getUsername(), loginRequest.getPassword());
                if (authenticationResult) {
                    session.setAttribute("authenticatedAdmin", adminService.findByUsername(loginRequest.getUsername()).orElse(null));
                }
                break;
            default:
                return ResponseEntity.badRequest().build();
        }

        if (authenticationResult) {
            // You may return a token or any other relevant information upon successful login
            return ResponseEntity.ok(new AuthLoginResponse("Authentication successful"));
        } else {
            return ResponseEntity.ok(new AuthLoginResponse("Authentication failed"));
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    private static class LoginRequest {
        private String username;
        private String password;
        private String userType;

    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    private static class AuthLoginResponse extends AuthResponse {
        private String message;
    }
    
}