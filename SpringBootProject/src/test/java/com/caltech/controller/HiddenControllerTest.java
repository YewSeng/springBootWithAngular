package com.caltech.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.anyString;
import java.util.Arrays;
import java.util.List;

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
public class HiddenControllerTest {

    @Mock
    private AdminService adminService;
    
    @Mock
    private ContactService contactService;

    @InjectMocks
    private HiddenController hiddenController;

    @Value("${hidden.key}")
    private String hiddenKey;

    private MockMvc mockMvc;
    
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = configureObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(hiddenController)
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }
    
    @Test
    @DisplayName("Test get all contacts - Success")
    void testGetAllContactsSuccess() throws Exception {
        // Arrange
        List<Contact> contacts = Arrays.asList(new Contact(), new Contact());
        when(contactService.verifyAdminKey(anyString())).thenReturn(true);
        when(contactService.getAllEnquiries()).thenReturn(contacts);

        // Act
        ResultActions result = performGetRequest("/v1/hidden/viewAllContacts?adminKey=testAdminKey");

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.size()").value(contacts.size()))
              .andExpect(jsonPath("$[0].message").value("Successfully fetched Contact with contact id " + contacts.get(0).getContactId()));
    }

    @Test
    @DisplayName("Test register admin with valid key")
    void testRegisterAdmin() throws Exception {
        // Arrange
        Admin inputAdmin = new Admin();
        inputAdmin.setUsername("testUser");
        String adminKey = hiddenKey;

        when(adminService.verifyAdminKey(adminKey)).thenReturn(true);
        when(adminService.createAdmin(any(Admin.class))).thenReturn(inputAdmin);

        mockMvc = MockMvcBuilders.standaloneSetup(hiddenController).build();

        // Act
        ResultActions result = performPostRequest("/v1/hidden/registerAdmin", inputAdmin, adminKey);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.admin.username").value("testUser"))
              .andExpect(jsonPath("$.message").value("Successfully created Admin with Username: testUser"));
    }

    @Test
    @DisplayName("Test register admin with invalid key")
    void testRegisterAdminInvalidKey() throws Exception {
        // Arrange
        Admin inputAdmin = new Admin();
        String adminKey = "invalidAdminKey";

        when(adminService.verifyAdminKey(adminKey)).thenReturn(false);

        mockMvc = MockMvcBuilders.standaloneSetup(hiddenController).build();

        // Act
        ResultActions result = performPostRequest("/v1/hidden/registerAdmin", inputAdmin, adminKey);

        // Assert
        result.andExpect(status().isBadRequest())
              .andExpect(jsonPath("$.admin").doesNotExist())
              .andExpect(jsonPath("$.message").value("Invalid Admin Key"));
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
