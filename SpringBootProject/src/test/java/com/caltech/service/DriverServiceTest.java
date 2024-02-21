package com.caltech.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.caltech.pojo.Booking;
import com.caltech.pojo.Driver;
import com.caltech.repository.BookingRepository;
import com.caltech.repository.DriverRepository;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class DriverServiceTest {

    @InjectMocks
    private DriverService driverService;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private BookingRepository bookingRepository;

    @BeforeEach
    void setUp() {
    }

    @Test
    @DisplayName("Test findByUsername with valid username")
    void testFindByUsernameWithValidUsername() {
        String username = "testDriver";
        Driver driver = new Driver();
        driver.setUsername(username);

        when(driverRepository.findByUsername(username)).thenReturn(Optional.of(driver));

        Optional<Driver> result = driverService.findByUsername(username);

        assertTrue(result.isPresent());
        assertEquals(username, result.get().getUsername());
    }

    @Test
    @DisplayName("Test findByUsername with invalid username")
    void testFindByUsernameWithInvalidUsername() {
        String username = "nonExistentDriver";

        when(driverRepository.findByUsername(username)).thenReturn(Optional.empty());

        Optional<Driver> result = driverService.findByUsername(username);

        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Test authenticateDriver with correct credentials")
    void testAuthenticateDriverWithCorrectCredentials() {
        String username = "testDriver";
        String password = "password";
        Driver driver = new Driver();
        driver.setUsername(username);
        driver.setPassword(BcryptService.hashPasssword(password));

        when(driverRepository.findByUsername(username)).thenReturn(Optional.of(driver));

        boolean result = driverService.authenticateDriver(username, password);

        assertTrue(result);
    }

    @Test
    @DisplayName("Test authenticateDriver with incorrect credentials")
    void testAuthenticateDriverWithIncorrectCredentials() {
        String username = "testDriver";
        String password = "incorrectPassword";
        Driver driver = new Driver();
        driver.setUsername(username);
        driver.setPassword(BcryptService.hashPasssword("correctPassword"));

        when(driverRepository.findByUsername(username)).thenReturn(Optional.of(driver));

        boolean result = driverService.authenticateDriver(username, password);

        assertFalse(result);
    }

    @Test
    @DisplayName("Test getAllDrivers")
    void testGetAllDrivers() {
        List<Driver> drivers = new ArrayList<>();
        drivers.add(new Driver());
        drivers.add(new Driver());

        when(driverRepository.findAll()).thenReturn(drivers);

        List<Driver> result = driverService.getAllDrivers();

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("Test getDriverById with valid ID")
    void testGetDriverByIdWithValidId() {
        UUID driverId = UUID.randomUUID();
        Driver driver = new Driver();

        when(driverRepository.findById(driverId)).thenReturn(Optional.of(driver));

        Driver result = driverService.getDriverById(driverId);

        assertNotNull(result);
    }

    @Test
    @DisplayName("Test getDriverById with invalid ID")
    void testGetDriverByIdWithInvalidId() {
        UUID driverId = UUID.randomUUID();

        when(driverRepository.findById(driverId)).thenReturn(Optional.empty());

        Driver result = driverService.getDriverById(driverId);

        assertNull(result);
    }

    @Test
    @DisplayName("Test createDriver")
    void testCreateDriver() {
        Driver driver = new Driver();
        driver.setUsername("testDriver");
        driver.setPassword("testPassword");

        when(driverRepository.save(driver)).thenReturn(driver);

        Driver result = driverService.createDriver(driver);

        assertNotNull(result);
        assertNotNull(result.getPassword()); // Password should be hashed
        verify(driverRepository).save(driver);
    }

    @Test
    @DisplayName("Test updateDriver with valid ID")
    void testUpdateDriverWithValidId() {
        UUID driverId = UUID.randomUUID();
        Driver existingDriver = new Driver();
        existingDriver.setFirstName("John");

        Driver updatedDriver = new Driver();
        updatedDriver.setFirstName("Doe");

        when(driverRepository.findById(driverId)).thenReturn(Optional.of(existingDriver));
        when(driverRepository.save(existingDriver)).thenReturn(existingDriver);

        Driver result = driverService.updateDriver(driverId, updatedDriver);

        assertNotNull(result);
        assertEquals("Doe", result.getFirstName());
        verify(driverRepository).save(existingDriver);
    }

    @Test
    @DisplayName("Test updateDriver with invalid ID")
    void testUpdateDriverWithInvalidId() {
        UUID driverId = UUID.randomUUID();
        Driver updatedDriver = new Driver();

        when(driverRepository.findById(driverId)).thenReturn(Optional.empty());

        Driver result = driverService.updateDriver(driverId, updatedDriver);

        assertNull(result);
    }

    @Test
    @DisplayName("Test deleteDriver with valid ID")
    void testDeleteDriverWithValidId() {
        UUID driverId = UUID.randomUUID();
        Driver driver = new Driver();
        driver.setBookings(new ArrayList<>());
        when(driverRepository.findById(driverId)).thenReturn(Optional.of(driver));
        driverService.deleteDriver(driverId);
        // Ensure driver's bookings have driver reference set to null and are saved
        for (Booking booking : driver.getBookings()) {
            assertNull(booking.getDriver());
            verify(bookingRepository).save(booking);
        }

        // Ensure driver is deleted
        verify(driverRepository).deleteById(driverId);
    }

    @Test
    @DisplayName("Test deleteDriver with invalid ID")
    void testDeleteDriverWithInvalidId() {
        UUID driverId = UUID.randomUUID();
        when(driverRepository.findById(driverId)).thenReturn(Optional.empty());
        driverService.deleteDriver(driverId);
        // Ensure no interactions with repositories
        verify(bookingRepository, never()).save(Mockito.any());
        verify(driverRepository, never()).deleteById(Mockito.any());
    }
}
