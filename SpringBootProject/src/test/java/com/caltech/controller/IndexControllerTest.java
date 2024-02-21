package com.caltech.controller;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.caltech.pojo.Contact;
import com.caltech.pojo.Driver;
import com.caltech.pojo.User;
import com.caltech.service.AdminService;
import com.caltech.service.ContactService;
import com.caltech.service.DriverService;
import com.caltech.service.UserService;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class IndexControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private DriverService driverService;

    @Mock
    private AdminService adminService;
    
    @Mock
    private ContactService contactService;

    @InjectMocks
    private IndexController indexController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(indexController).build();
    }
    
    @Test
    @DisplayName("Test Create Enquiry - Success")
    void testCreateEnquirySuccess() throws Exception {
        // Arrange
        Contact contact = new Contact("John Doe", "john.doe@example.com", "How can I help?");
        Contact createdContact = new Contact();
        createdContact.setEmail(contact.getEmail());

        when(contactService.createEnquiry(any(Contact.class))).thenReturn(createdContact);

        // Act
        ResultActions result = performCreateEnquiryRequest(contact);

        // Assert
        result.andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value(Matchers.equalToIgnoringCase("Successfully submitted enquiry with point of contact as: " + createdContact.getEmail())))
        .andExpect(jsonPath("$.contact.email").value(createdContact.getEmail()));
    }



    @Test
    @DisplayName("Test Login User - Success")
    void testLoginUserSuccess() throws Exception {
        // Arrange
        String username = "user123";
        String password = "password123";
        String userType = "user";
        User authenticatedUser = new User();
        authenticatedUser.setUsername(username);

        when(userService.authenticateUser(username, password)).thenReturn(true);
        when(userService.findByUsername(username)).thenReturn(java.util.Optional.of(authenticatedUser));

        // Act
        ResultActions result = performLoginRequest(username, password, userType);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.message").value("Authentication successful"));
    }

    @Test
    @DisplayName("Test Login User - Failure")
    void testLoginUserFailure() throws Exception {
        // Arrange
        String username = "user123";
        String password = "wrongPassword";
        String userType = "user";

        when(userService.authenticateUser(username, password)).thenReturn(false);

        // Act
        ResultActions result = performLoginRequest(username, password, userType);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.message").value("Authentication failed"));
    }

    @Test
    @DisplayName("Test Login Driver - Success")
    void testLoginDriverSuccess() throws Exception {
        // Arrange
        String username = "driver123";
        String password = "password123";
        String userType = "driver";
        Driver authenticatedDriver = new Driver();
        authenticatedDriver.setUsername(username);

        when(driverService.authenticateDriver(username, password)).thenReturn(true);
        when(driverService.findByUsername(username)).thenReturn(java.util.Optional.of(authenticatedDriver));

        // Act
        ResultActions result = performLoginRequest(username, password, userType);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.message").value("Authentication successful"));
    }

    @Test
    @DisplayName("Test Login Driver - Failure")
    void testLoginDriverFailure() throws Exception {
        // Arrange
        String username = "driver123";
        String password = "wrongPassword";
        String userType = "driver";

        when(driverService.authenticateDriver(username, password)).thenReturn(false);

        // Act
        ResultActions result = performLoginRequest(username, password, userType);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.message").value("Authentication failed"));
    }

    @Test
    @DisplayName("Test Login Admin - Success")
    void testLoginAdminSuccess() throws Exception {
        // Arrange
        String username = "admin123";
        String password = "password123";
        String userType = "admin";

        when(adminService.authenticateAdmin(username, password)).thenReturn(true);

        // Act
        ResultActions result = performLoginRequest(username, password, userType);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.message").value("Authentication successful"));
    }

    @Test
    @DisplayName("Test Login Admin - Failure")
    void testLoginAdminFailure() throws Exception {
        // Arrange
        String username = "admin123";
        String password = "wrongPassword";
        String userType = "admin";

        when(adminService.authenticateAdmin(username, password)).thenReturn(false);

        // Act
        ResultActions result = performLoginRequest(username, password, userType);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.message").value("Authentication failed"));
    }

    private ResultActions performLoginRequest(String username, String password, String userType) throws Exception {
        return mockMvc.perform(post("/v1/public/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"username\": \"" + username + "\", \"password\": \"" + password + "\", \"userType\": \"" + userType + "\" }"));
    }
    
    private ResultActions performCreateEnquiryRequest(Contact contact) throws Exception {
        return mockMvc.perform(post("/v1/public/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"name\": \"" + contact.getName() + "\", \"email\": \"" + contact.getEmail() + "\", \"enquiries\": \"" + contact.getEnquiries() + "\" }"));
    }
}
