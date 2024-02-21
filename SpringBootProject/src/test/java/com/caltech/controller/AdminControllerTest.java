package com.caltech.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.caltech.pojo.Admin;
import com.caltech.pojo.Contact;
import com.caltech.service.AdminService;
import com.caltech.service.ContactService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;
 
    @Value("${hidden.key}")
    private String hiddenKey;
    
    private MockMvc mockMvc;
    
    private ObjectMapper objectMapper;
    
    @BeforeEach
    void setUp() {
        objectMapper = configureObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(adminController)
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }

    @Test
    @DisplayName("Test get all admins")
    void testGetAllAdmins() throws Exception {
        // Arrange
        List<Admin> admins = Arrays.asList(new Admin(), new Admin());
        when(adminService.getAllAdmins()).thenReturn(admins);

        // Act
        ResultActions result = performGetRequest("/v1/admins/getAllAdmins");

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.size()").value(admins.size()));
    }

    @Test
    @DisplayName("Test get admin by ID")
    void testGetAdminById() throws Exception {
        // Arrange
        UUID adminId = UUID.randomUUID();
        Admin admin = new Admin();
        when(adminService.getAdminById(adminId)).thenReturn(admin);

        // Act
        ResultActions result = performGetRequest("/v1/admins/getAdmin/" + adminId);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.admin").exists())
              .andExpect(jsonPath("$.message").value("Successfully fetched Admin with adminId: " + adminId));
    }

    @Test
    @DisplayName("Test get admin by ID not found")
    void testGetAdminByIdNotFound() throws Exception {
        // Arrange
        UUID adminId = UUID.randomUUID();
        when(adminService.getAdminById(adminId)).thenReturn(null);

        // Act
        ResultActions result = performGetRequest("/v1/admins/getAdmin/" + adminId);

        // Assert
        result.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test register admin")
    void testRegisterAdmin() throws Exception {
        // Arrange
        Admin admin = new Admin();
        String adminKey = hiddenKey;

        when(adminService.verifyAdminKey(adminKey)).thenReturn(true);
        when(adminService.createAdmin(any(Admin.class))).thenReturn(admin);

        // Act
        ResultActions result = performPostRequest("/v1/admins/registerAdmin", admin, adminKey);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.admin").exists())
              .andExpect(jsonPath("$.message").value("Successfully created Admin with Username: " + admin.getUsername()));
    }

    @Test
    @DisplayName("Test register admin with invalid key")
    void testRegisterAdminInvalidKey() throws Exception {
        // Arrange
        Admin admin = new Admin();
        String adminKey = "invalidAdminKey";

        when(adminService.verifyAdminKey(adminKey)).thenReturn(false);

        // Act
        ResultActions result = performPostRequest("/v1/admins/registerAdmin", admin, adminKey);

        // Assert
        result.andExpect(status().isBadRequest())
              .andExpect(jsonPath("$.admin").doesNotExist())
              .andExpect(jsonPath("$.message").value("Invalid Admin Key"));
    }

    @Test
    @DisplayName("Test update admin")
    void testUpdateAdmin() throws Exception {
        // Arrange
        UUID adminId = UUID.randomUUID();
        Admin updatedAdmin = new Admin();
        Admin existingAdmin = new Admin();
        when(adminService.updateAdmin(eq(adminId), any(Admin.class))).thenReturn(updatedAdmin);

        // Act
        ResultActions result = performPutRequest("/v1/admins/update/" + adminId, updatedAdmin);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.admin").exists())
              .andExpect(jsonPath("$.message").value("Successfully updated Admin with ID: " + existingAdmin.getId()));
    }

    @Test
    @DisplayName("Test update admin not found")
    void testUpdateAdminNotFound() throws Exception {
        // Arrange
        UUID adminId = UUID.randomUUID();
        Admin updatedAdmin = new Admin();
        when(adminService.updateAdmin(eq(adminId), any(Admin.class))).thenReturn(null);

        // Act
        ResultActions result = performPutRequest("/v1/admins/update/" + adminId, updatedAdmin);

        // Assert
        result.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test delete admin")
    void testDeleteAdmin() throws Exception {
        // Arrange
        UUID adminId = UUID.randomUUID();
        Admin deletedAdmin = new Admin();

        when(adminService.getAdminById(adminId)).thenReturn(deletedAdmin);

        // Act
        ResultActions result = performDeleteRequest("/v1/admins/" + adminId);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.admin").exists())
              .andExpect(jsonPath("$.message").value("Successfully deleted Admin with Username: " + deletedAdmin.getUsername()));

        // Verify that the deleteAdmin method was called once
        verify(adminService, times(1)).deleteAdmin(adminId);
    }

    @Test
    @DisplayName("Test delete admin not found")
    void testDeleteAdminNotFound() throws Exception {
        // Arrange
        UUID adminId = UUID.randomUUID();

        when(adminService.getAdminById(adminId)).thenReturn(null);

        // Act
        ResultActions result = performDeleteRequest("/v1/admins/" + adminId);

        // Assert
        result.andExpect(status().isNotFound());
    }

    private ResultActions performGetRequest(String url) throws Exception {
        return mockMvc.perform(get(url).contentType(MediaType.APPLICATION_JSON));
    }

    private ResultActions performPostRequest(String url, Object requestBody, String adminKey) throws Exception {
        MockHttpServletRequestBuilder requestBuilder = post(url)
                .param("adminKey", adminKey)
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(requestBody));

        return mockMvc.perform(requestBuilder);
    }

    private ResultActions performPutRequest(String url, Object requestBody) throws Exception {
        MockHttpServletRequestBuilder requestBuilder = put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(requestBody));

        return mockMvc.perform(requestBuilder);
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
