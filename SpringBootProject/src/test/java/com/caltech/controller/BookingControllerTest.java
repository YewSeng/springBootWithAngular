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
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.caltech.pojo.Booking;
import com.caltech.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @InjectMocks
    private BookingController bookingController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = configureObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(bookingController)
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }

    @Test
    @DisplayName("Test get booking by id")
    void testGetBookingById() throws Exception {
        // Arrange
        UUID bookingId = UUID.randomUUID();
        Booking booking = new Booking();
        when(bookingService.getBookingById(bookingId)).thenReturn(booking);

        // Act
        ResultActions result = performGetRequest("/v1/bookings/" + bookingId);

        // Assert
        result.andExpect(status().isOk())
        .andExpect(jsonPath("$.booking").exists());

        if (booking != null) {
            result.andExpect(jsonPath("$.message").value("Successfully fetched Booking with booking Id: " + booking.getBookingId()));
        } else {
            result.andExpect(jsonPath("$.message").value("Unable to Fetch Booking with booking Id: " + bookingId));
        }
    }

    @Test
    @DisplayName("Test get booking by id not found")
    void testGetBookingByIdNotFound() throws Exception {
        // Arrange
        UUID bookingId = UUID.randomUUID();
        when(bookingService.getBookingById(bookingId)).thenReturn(null);

        // Act
        ResultActions result = performGetRequest("/v1/bookings/" + bookingId);

        // Assert
        result.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test get bookings by user id")
    void testGetBookingsByUserId() throws Exception {
        // Arrange
        UUID userId = UUID.randomUUID();
        List<Booking> userBookings = Arrays.asList(new Booking(), new Booking());
        when(bookingService.getBookingsByUserId(userId)).thenReturn(userBookings);

        // Act
        ResultActions result = performGetRequest("/v1/bookings/user/" + userId);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.size()").value(userBookings.size()));
    }

    @Test
    @DisplayName("Test get bookings by driver id")
    void testGetBookingsByDriverId() throws Exception {
        // Arrange
        UUID driverId = UUID.randomUUID();
        List<Booking> driverBookings = Arrays.asList(new Booking(), new Booking());
        when(bookingService.getBookingsByDriverId(driverId)).thenReturn(driverBookings);

        // Act
        ResultActions result = performGetRequest("/v1/bookings/driver/" + driverId);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.size()").value(driverBookings.size()));
    }

    @Test
    @DisplayName("Test get all bookings")
    void testGetAllBookings() throws Exception {
        // Arrange
        List<Booking> allBookings = Arrays.asList(new Booking(), new Booking());
        when(bookingService.getAllBookings()).thenReturn(allBookings);

        // Act
        ResultActions result = performGetRequest("/v1/bookings/adminBookings");

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.size()").value(allBookings.size()));
    }

    @Test
    @DisplayName("Test create booking")
    void testCreateBooking() throws Exception {
        // Arrange
        Booking booking = new Booking();
        when(bookingService.createBooking(any(Booking.class))).thenReturn(booking);

        // Act
        ResultActions result = performPostRequest("/v1/bookings/registerBooking", booking);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.booking").exists())
              .andExpect(jsonPath("$.message").value("Successfully created Booking with booking id: " + booking.getBookingId()));
    }

    @Test
    @DisplayName("Test update booking")
    void testUpdateBooking() throws Exception {
        // Arrange
        UUID bookingId = UUID.randomUUID();
        Booking updatedBooking = new Booking();
        when(bookingService.updateBooking(eq(bookingId), any(Booking.class))).thenReturn(updatedBooking);

        // Act
        ResultActions result = performPutRequest("/v1/bookings/update/" + bookingId, updatedBooking);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.booking").exists())
              .andExpect(jsonPath("$.message").value("Booking is updated with an additional surcharge of $3"));
    }

    @Test
    @DisplayName("Test update booking not found")
    void testUpdateBookingNotFound() throws Exception {
        // Arrange
        UUID bookingId = UUID.randomUUID();
        Booking updatedBooking = new Booking();
        when(bookingService.updateBooking(eq(bookingId), any(Booking.class))).thenReturn(null);

        // Act
        ResultActions result = performPutRequest("/v1/bookings/update/" + bookingId, updatedBooking);

        // Assert
        result.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test delete booking")
    void testDeleteBooking() throws Exception {
        // Arrange
        UUID bookingId = UUID.randomUUID();
        Booking deletedBooking = new Booking();
        when(bookingService.getBookingById(bookingId)).thenReturn(deletedBooking);

        // Act
        ResultActions result = performDeleteRequest("/v1/bookings/" + bookingId);

        // Assert
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.booking").exists())
              .andExpect(jsonPath("$.message").value("Successfully deleted Booking with Booking Id: " + deletedBooking.getBookingId()));

        // Verify that the deleteBooking method was called once
        verify(bookingService, times(1)).deleteBooking(bookingId);
    }

    @Test
    @DisplayName("Test delete booking not found")
    void testDeleteBookingNotFound() throws Exception {
        // Arrange
        UUID bookingId = UUID.randomUUID();
        when(bookingService.getBookingById(bookingId)).thenReturn(null);

        // Act
        ResultActions result = performDeleteRequest("/v1/bookings/" + bookingId);

        // Assert
        result.andExpect(status().isNotFound());
    }

    private ResultActions performGetRequest(String url) throws Exception {
        return mockMvc.perform(get(url).contentType(MediaType.APPLICATION_JSON));
    }

    private ResultActions performPostRequest(String url, Object requestBody) throws Exception {
        MockHttpServletRequestBuilder requestBuilder = post(url)
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
