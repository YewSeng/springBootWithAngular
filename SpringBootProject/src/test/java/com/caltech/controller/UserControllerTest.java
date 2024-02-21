package com.caltech.controller;

import com.caltech.pojo.User;
import com.caltech.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

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
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;
    
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = configureObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(userController)
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }

    @Test
    @DisplayName("Test Get All Users")
    void testGetAllUsers() throws Exception {
        // Arrange
        List<User> users = Arrays.asList(new User(), new User());
        when(userService.getAllUsers()).thenReturn(users);

        // Act
        ResultActions result = performGetRequest("/v1/users/getAllUsers");

        // Assert
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(users.size()));
    }

    @Test
    @DisplayName("Test Get User By Id - Success")
    void testGetUserByIdSuccess() throws Exception {
        // Arrange
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        
        when(userService.getUserById(userId)).thenReturn(user);

        // Act
        ResultActions result = performGetRequest("/v1/users/getUser/" + userId);

        // Assert
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.message").value("Successfully fetched User with driver Id: " + userId.toString()));
    }


    @Test
    @DisplayName("Test Get User By Id - Not Found")
    void testGetUserByIdNotFound() throws Exception {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(userService.getUserById(userId)).thenReturn(null);

        // Act
        ResultActions result = performGetRequest("/v1/users/getUser/" + userId);

        // Assert
        result.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test Create User - Success")
    void testCreateUserSuccess() throws Exception {
        // Arrange
        User user = new User();
        when(userService.createUser(any(User.class))).thenReturn(user);

        // Act
        ResultActions result = performPostRequest("/v1/users/registerUser", user);

        // Assert
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.message").value("Successfully created User with Username: " + user.getUsername()));
    }

    @Test
    @DisplayName("Test Create User - Failure")
    void testCreateUserFailure() throws Exception {
        // Arrange
        User user = new User();
        when(userService.createUser(any(User.class))).thenReturn(null);

        // Act
        ResultActions result = performPostRequest("/v1/users/registerUser", user);

        // Assert
        result.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test Update User - Success")
    void testUpdateUserSuccess() throws Exception {
        // Arrange
        UUID userId = UUID.randomUUID();
        User updatedUser = new User();
        updatedUser.setId(userId); // Set the user ID explicitly

        when(userService.updateUser(eq(userId), any(User.class))).thenReturn(updatedUser);

        // Act
        ResultActions result = performPutRequest("/v1/users/update/" + userId, updatedUser);

        // Assert
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.message").value("Successfully updated User with user Id: " + userId));
    }


    @Test
    @DisplayName("Test Update User - Not Found")
    void testUpdateUserNotFound() throws Exception {
        // Arrange
        UUID userId = UUID.randomUUID();
        User updatedUser = new User();

        when(userService.updateUser(eq(userId), any(User.class))).thenReturn(null);

        // Act
        ResultActions result = performPutRequest("/v1/users/update/" + userId, updatedUser);

        // Assert
        result.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test Delete User - Success")
    void testDeleteUserSuccess() throws Exception {
        // Arrange
        UUID userId = UUID.randomUUID();
        User deletedUser = new User();

        when(userService.getUserById(userId)).thenReturn(deletedUser);

        // Act
        ResultActions result = performDeleteRequest("/v1/users/" + userId);

        // Assert
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.message").value("Successfully deleted User with Username: " + deletedUser.getUsername()));

        verify(userService, times(1)).deleteUser(userId);
    }

    @Test
    @DisplayName("Test Delete User - Not Found")
    void testDeleteUserNotFound() throws Exception {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(userService.getUserById(userId)).thenReturn(null);

        // Act
        ResultActions result = performDeleteRequest("/v1/users/" + userId);

        // Assert
        result.andExpect(status().isNotFound());
    }

    private ResultActions performGetRequest(String url) throws Exception {
        return mockMvc.perform(get(url).contentType(MediaType.APPLICATION_JSON));
    }

    private ResultActions performPostRequest(String url, Object requestBody) throws Exception {
        return mockMvc.perform(post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(requestBody)));
    }

    private ResultActions performPutRequest(String url, Object requestBody) throws Exception {
        return mockMvc.perform(put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(requestBody)));
    }

    private ResultActions performDeleteRequest(String url) throws Exception {
        return mockMvc.perform(delete(url).contentType(MediaType.APPLICATION_JSON));
    }

    // Utility method to convert an object to JSON string
    private String asJsonString(final Object obj) {
        try {
            return configureObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    private ObjectMapper configureObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }
}
