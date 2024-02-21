package com.caltech.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caltech.pojo.Booking;
import com.caltech.pojo.User;
import com.caltech.repository.BookingRepository;
import com.caltech.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean authenticateUser(String username, String password) {
        boolean correctPassword = false;
        
        Optional<User> userOptional = findByUsername(username);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String hashPasswordFromDb = user.getPassword();
            correctPassword = BcryptService.verifyPassword(password, hashPasswordFromDb);
        }
        
        return correctPassword;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        return optionalUser.orElse(null);
    }

    public User createUser(User user) {
    	user.setPassword(BcryptService.hashPasssword(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(UUID userId, User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            // Update fields based on your requirements
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setPreferences(updatedUser.getPreferences());
            existingUser.setPassword(BcryptService.hashPasssword(updatedUser.getPassword()));
            // Update other fields as needed
            return userRepository.save(existingUser);
        }
        return null;
    }

    public void deleteUser(UUID userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            
            // Set user reference to null in bookings
            List<Booking> bookings = user.getBookings();
            if (bookings != null) {
                for (Booking booking : bookings) {
                    booking.setUser(null);
                    bookingRepository.save(booking);
                }
            }
            
            // Delete the user
            userRepository.deleteById(userId);
        }
    }
}
