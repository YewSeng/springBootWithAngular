package com.caltech.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.caltech.pojo.Booking;
import com.caltech.pojo.User;
import com.caltech.repository.BookingRepository;
import com.caltech.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Test authenticateUser with correct credentials")
    void testAuthenticateUserWithCorrectCredentials() {
        String username = "testUser";
        String password = "password";
        User user = new User();
        user.setPassword(BcryptService.hashPasssword(password));

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        assertTrue(userService.authenticateUser(username, password));
    }

    @Test
    @DisplayName("Test authenticateUser with incorrect credentials")
    void testAuthenticateUserWithIncorrectCredentials() {
        String username = "testUser";
        String password = "password";
        User user = new User();
        user.setPassword(BcryptService.hashPasssword("wrongPassword"));

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        assertFalse(userService.authenticateUser(username, password));
    }

    @Test
    @DisplayName("Test getAllUsers")
    void testGetAllUsers() {
        List<User> userList = new ArrayList<>();
        userList.add(new User());
        userList.add(new User());

        when(userRepository.findAll()).thenReturn(userList);

        assertEquals(userList, userService.getAllUsers());
    }

    @Test
    @DisplayName("Test getUserById with valid ID")
    void testGetUserByIdWithValidId() {
        UUID userId = UUID.randomUUID();
        User user = new User();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertEquals(user, userService.getUserById(userId));
    }

    @Test
    @DisplayName("Test getUserById with invalid ID")
    void testGetUserByIdWithInvalidId() {
        UUID userId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertNull(userService.getUserById(userId));
    }

    @Test
    @DisplayName("Test createUser")
    void testCreateUser() {
        User user = new User();
        user.setUsername("testUser");
        user.setPassword("password");

        when(userRepository.save(user)).thenReturn(user);

        User createdUser = userService.createUser(user);

        assertEquals(user.getUsername(), createdUser.getUsername());
        assertNotNull(createdUser.getPassword()); // Password should be hashed
    }

    @Test
    @DisplayName("Test updateUser with valid ID")
    void testUpdateUserWithValidId() {
        UUID userId = UUID.randomUUID();
        User existingUser = new User();
        existingUser.setFirstName("John");

        User updatedUser = new User();
        updatedUser.setLastName("Doe");

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(existingUser)).thenReturn(existingUser);

        User result = userService.updateUser(userId, updatedUser);

        assertNotNull(result);
        assertEquals(updatedUser.getLastName(), result.getLastName());
        assertEquals(existingUser.getFirstName(), result.getFirstName()); // Ensure other fields are not modified
    }

    @Test
    @DisplayName("Test updateUser with invalid ID")
    void testUpdateUserWithInvalidId() {
        UUID userId = UUID.randomUUID();
        User updatedUser = new User();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertNull(userService.updateUser(userId, updatedUser));
    }

    @Test
    @DisplayName("Test deleteUser with valid ID")
    void testDeleteUserWithValidId() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setBookings(new ArrayList<>());

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        // Make the stubbing lenient
        lenient().when(bookingRepository.saveAll(user.getBookings())).thenReturn(user.getBookings());

        userService.deleteUser(userId);

        // Ensure user's bookings have user reference set to null and are saved
        for (Booking booking : user.getBookings()) {
            assertNull(booking.getUser());
            verify(bookingRepository).save(booking);
        }

        // Ensure user is deleted
        verify(userRepository).deleteById(userId);
    }

    @Test
    @DisplayName("Test deleteUser with invalid ID")
    void testDeleteUserWithInvalidId() {
        UUID userId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> userService.deleteUser(userId));
    }
}

