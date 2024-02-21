package com.caltech.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.caltech.pojo.Booking;
import com.caltech.pojo.Driver;
import com.caltech.pojo.User;
import com.caltech.repository.BookingRepository;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class BookingServiceTest {

    @InjectMocks
    private BookingService bookingService;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private FareCalculatorService fareCalculatorService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Test getBookingById with valid booking ID")
    void testGetBookingByIdWithValidId() {
        UUID bookingId = UUID.randomUUID();
        Booking expectedBooking = new Booking();
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(expectedBooking));

        Booking result = bookingService.getBookingById(bookingId);

        assertEquals(expectedBooking, result);
    }

    @Test
    @DisplayName("Test getBookingById with invalid booking ID")
    void testGetBookingByIdWithInvalidId() {
        UUID bookingId = UUID.randomUUID();
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.empty());

        Booking result = bookingService.getBookingById(bookingId);

        assertNull(result);
    }

    // Similar tests for getBookingsByUserId, getBookingsByDriverId, getAllBookings can be written

    @Test
    @DisplayName("Test createBooking")
    void testCreateBooking() {
        Booking booking = new Booking();
        when(fareCalculatorService.calculateFare(booking)).thenReturn(10.0);
        when(bookingRepository.save(booking)).thenReturn(booking);

        Booking result = bookingService.createBooking(booking);

        assertEquals(10.0, result.getTravelFare());
        verify(bookingRepository, times(1)).save(booking);
    }

    @Test
    @DisplayName("Test updateBooking with valid booking ID")
    void testUpdateBookingWithValidId() {
        UUID bookingId = UUID.randomUUID();
        Booking existingBooking = new Booking();
        existingBooking.setTravelFare(20.0);
        Booking updatedBooking = new Booking();
        updatedBooking.setSource(123456);
        updatedBooking.setDestination(123999);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.save(existingBooking)).thenReturn(existingBooking);

        Booking result = bookingService.updateBooking(bookingId, updatedBooking);

        assertEquals(123456, result.getSource());
        assertEquals(123999, result.getDestination());
        assertEquals(23.0, result.getTravelFare()); 
        verify(bookingRepository, times(1)).save(existingBooking);
    }

    @Test
    @DisplayName("Test updateBooking with invalid booking ID")
    void testUpdateBookingWithInvalidId() {
        UUID bookingId = UUID.randomUUID();
        Booking updatedBooking = new Booking();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.empty());

        Booking result = bookingService.updateBooking(bookingId, updatedBooking);

        assertNull(result);
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Test deleteBooking with valid booking ID")
    void testDeleteBookingWithValidId() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = new Booking();
        booking.setUser(new User());
        booking.setDriver(new Driver());

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(booking)).thenReturn(booking);

        bookingService.deleteBooking(bookingId);

        assertNull(booking.getUser());
        assertNull(booking.getDriver());
        verify(bookingRepository, times(1)).save(booking);
        verify(bookingRepository, times(1)).delete(booking);
    }

    @Test
    @DisplayName("Test deleteBooking with invalid booking ID")
    void testDeleteBookingWithInvalidId() {
        UUID bookingId = UUID.randomUUID();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.empty());

        bookingService.deleteBooking(bookingId);

        // No interactions with bookingRepository.save or bookingRepository.delete
        verify(bookingRepository, never()).save(any());
        verify(bookingRepository, never()).delete(any());
    }
}

