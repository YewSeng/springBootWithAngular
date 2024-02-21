package com.caltech.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;

import java.text.DecimalFormat;
import java.time.LocalDateTime;

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

import com.caltech.constants.CabType;
import com.caltech.pojo.Booking;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class FareCalculatorServiceTest {

    @InjectMocks
    private FareCalculatorService fareCalculatorService;

    @Mock
    private Booking booking;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Test for Standard cab during non-peak hours")
    void testCalculateFareForStandardCabNonPeakHours() {
        LocalDateTime bookingTime = LocalDateTime.of(2023, 1, 3, 12, 0); 

        // Mock CabType
        when(booking.getVehicleType()).thenReturn(CabType.STANDARD);
        // Mock Booking
        when(booking.getSource()).thenReturn(100001);
        when(booking.getDestination()).thenReturn(100006);
        when(booking.getBookingTime()).thenReturn(bookingTime);

        // Standard fare without surcharges
        double expectedFare = 2.5 + 0.5 * 1.0;
        assertEquals(expectedFare, fareCalculatorService.calculateFare(booking));
    }
    
    @Test
    @DisplayName("Test for Premium cab during peak hours on weekends")
    void testCalculateFareForPremiumCabPeakHours() {
        LocalDateTime bookingTime = LocalDateTime.of(2023, 1, 1, 8, 0); 

        // Mock CabType
        when(booking.getVehicleType()).thenReturn(CabType.PREMIUM);

        // Mock Booking
        when(booking.getSource()).thenReturn(100001);
        when(booking.getDestination()).thenReturn(100006);
        when(booking.getBookingTime()).thenReturn(bookingTime);

        // Premium fare with peak hour surcharge
        double expectedFare = 3.0 * 1.5 * 1.2 + 0.5 * 1.0;
        DecimalFormat df = new DecimalFormat("0.00");
        expectedFare = Double.valueOf(df.format(expectedFare));
        assertEquals(expectedFare, fareCalculatorService.calculateFare(booking));
    }

    @Test
    @DisplayName("Test for Limousine cab during the weekend late hours")
    void testCalculateFareForLimousineCabWeekend() {
        LocalDateTime bookingTime = LocalDateTime.of(2023, 1, 7, 23, 0); 

        // Mock CabType
        when(booking.getVehicleType()).thenReturn(CabType.LIMOUSINE);

        // Mock Booking
        when(booking.getSource()).thenReturn(100001);
        when(booking.getDestination()).thenReturn(100006);
        when(booking.getBookingTime()).thenReturn(bookingTime);

        // Limousine fare with weekend surcharge
        double expectedFare = 4.0 * 1.5 + 0.5 * 1.0 * 1.2;
        assertEquals(expectedFare, fareCalculatorService.calculateFare(booking));
    }
    
    @Test
    @DisplayName("Test for Special cab during the weekend late hours")
    void testCalculateFareForSpecialCabWeekend() {
        LocalDateTime bookingTime = LocalDateTime.of(2023, 1, 7, 23, 0); 

        // Mock CabType
        when(booking.getVehicleType()).thenReturn(CabType.SPECIAL);

        // Mock Booking
        when(booking.getSource()).thenReturn(100001);
        when(booking.getDestination()).thenReturn(100006);
        when(booking.getBookingTime()).thenReturn(bookingTime);

        // Special fare with weekend surcharge
        double expectedFare = 3.5 * 1.5 + 0.5 * 1.0 * 1.2;
        assertEquals(expectedFare, fareCalculatorService.calculateFare(booking));
    }

}
