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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.caltech.pojo.Driver;
import com.caltech.service.DriverService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class DriverControllerTest {

    @Mock
    private DriverService driverService;

    @InjectMocks
    private DriverController driverController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = configureObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(driverController)
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }

    @Test
    @DisplayName("Test get driver by id")
    void testGetDriverById() throws Exception {
    	// Arrange
    	UUID driverId = UUID.randomUUID(); // Generate a random UUID
    	Driver driver = new Driver();
    	driver.setId(driverId);
    	
    	// Ensure that the driverId used in the test corresponds to a valid driver
    	when(driverService.getDriverById(eq(driverId))).thenReturn(driver);

    	// Act
    	ResultActions result = performGetRequest("/v1/drivers/getDriver/" + driverId);

    	// Assert
    	result.andExpect(status().isOk())
    	      .andExpect(jsonPath("$.driver").exists())
    	      .andExpect(jsonPath("$.message").value("Successfully fetched Driver with driver Id: " + driverId));
    }


    @Test
    @DisplayName("Test get driver by id not found")
    void testGetDriverByIdNotFound() throws Exception {
        // Arrange
        UUID driverId = UUID.randomUUID();
        when(driverService.getDriverById(driverId)).thenReturn(null);

        // Act
        ResultActions result = performGetRequest("/v1/drivers/getDriver/" + driverId);

        // Assert
        result.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test get all drivers")
    void testGetAllDrivers() throws Exception {
        // Arrange
        List<Driver> allDrivers = Arrays.asList(new Driver(), new Driver());
        when(driverService.getAllDrivers()).thenReturn(allDrivers);

        // Act
        ResultActions result = performGetRequest("/v1/drivers/getAllDrivers");

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.size()").value(allDrivers.size()));
    }

    @Test
    @DisplayName("Test create driver")
    void testCreateDriver() throws Exception {
        // Arrange
        Driver driver = new Driver();
        when(driverService.createDriver(any(Driver.class))).thenReturn(driver);

        // Act
        ResultActions result = performPostRequest("/v1/drivers/registerDriver", driver);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.driver").exists())
              .andExpect(jsonPath("$.message").value("Successfully created Driver with Username: " + driver.getUsername()));
    }

    @Test
    @DisplayName("Test update driver")
    void testUpdateDriver() throws Exception {
        // Arrange
        UUID driverId = UUID.randomUUID();
        
        // Create a sample driver with the generated driverId and add it to the repository
        Driver existingDriverInRepository = new Driver();
        existingDriverInRepository.setId(driverId);
        when(driverService.updateDriver(eq(driverId), any(Driver.class))).thenReturn(existingDriverInRepository);

        // Act
        ResultActions result = performPutRequest("/v1/drivers/update/" + driverId, existingDriverInRepository);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.driver").exists())
              .andExpect(jsonPath("$.message").value("Successfully updated Driver with driver Id: " + driverId));
    }


    @Test
    @DisplayName("Test update driver not found")
    void testUpdateDriverNotFound() throws Exception {
        // Arrange
        UUID driverId = UUID.randomUUID();
        Driver updatedDriver = new Driver();
        when(driverService.updateDriver(eq(driverId), any(Driver.class))).thenReturn(null);

        // Act
        ResultActions result = performPutRequest("/v1/drivers/update/" + driverId, updatedDriver);

        // Assert
        result.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test delete driver")
    void testDeleteDriver() throws Exception {
        // Arrange
        UUID driverId = UUID.randomUUID();
        Driver deletedDriver = new Driver();
        when(driverService.getDriverById(driverId)).thenReturn(deletedDriver);

        // Act
        ResultActions result = performDeleteRequest("/v1/drivers/" + driverId);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.driver").exists())
              .andExpect(jsonPath("$.message").value("Successfully deleted Driver with Username: " + deletedDriver.getUsername()));

        verify(driverService, times(1)).deleteDriver(driverId);
    }

    @Test
    @DisplayName("Test delete driver not found")
    void testDeleteDriverNotFound() throws Exception {
        // Arrange
        UUID driverId = UUID.randomUUID();
        when(driverService.getDriverById(driverId)).thenReturn(null);

        // Act
        ResultActions result = performDeleteRequest("/v1/drivers/" + driverId);

        // Assert
        result.andExpect(status().isNotFound());
    }

    private ResultActions performGetRequest(String url) throws Exception {
        return mockMvc.perform(get(url).contentType(MediaType.APPLICATION_JSON));
    }

    private ResultActions performPostRequest(String url, Object requestBody) throws Exception {
        return mockMvc.perform(post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)));
    }

    private ResultActions performPutRequest(String url, Object requestBody) throws Exception {
        return mockMvc.perform(put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)));
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

