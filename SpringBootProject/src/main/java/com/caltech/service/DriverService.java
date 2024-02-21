package com.caltech.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caltech.pojo.Booking;
import com.caltech.pojo.Driver;
import com.caltech.repository.BookingRepository;
import com.caltech.repository.DriverRepository;

@Service
public class DriverService {
	
	@Autowired
	private DriverRepository driverRepository;
	
	@Autowired
	private BookingRepository bookingRepository;
	
    public Optional<Driver> findByUsername(String username) {
        return driverRepository.findByUsername(username);
    }

    public boolean authenticateDriver(String username, String password) {
        boolean correctPassword = false;
        
        Optional<Driver> driverOptional = findByUsername(username);
        
        if (driverOptional.isPresent()) {
            Driver driver = driverOptional.get();
            String hashPasswordFromDb = driver.getPassword();
            correctPassword = BcryptService.verifyPassword(password, hashPasswordFromDb);
        }
        
        return correctPassword;
    }
    
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }
    
    public Driver getDriverById(UUID driverId) {
        Optional<Driver> optionalDriver = driverRepository.findById(driverId);
        return optionalDriver.orElse(null);
    }
    
    public Driver createDriver(Driver driver) {
    	driver.setPassword(BcryptService.hashPasssword(driver.getPassword()));
        return driverRepository.save(driver);
    }
    
    public Driver updateDriver(UUID driverId, Driver updatedDriver) {
        Optional<Driver> optionalDriver = driverRepository.findById(driverId);
        if (optionalDriver.isPresent()) {
            Driver existingDriver = optionalDriver.get();
            // Update fields based on your requirements
            existingDriver.setFirstName(updatedDriver.getFirstName());
            existingDriver.setLastName(updatedDriver.getLastName());
            existingDriver.setVehicleType(updatedDriver.getVehicleType());
            existingDriver.setCarBrand(updatedDriver.getCarBrand());
            existingDriver.setCarColor(updatedDriver.getCarColor());
            existingDriver.setPassword(BcryptService.hashPasssword(updatedDriver.getPassword()));
            // Update other fields as needed
            return driverRepository.save(existingDriver);
        }
        return null;
    }
    
    public void deleteDriver(UUID driverId) {
        Optional<Driver> optionalDriver = driverRepository.findById(driverId);
        if (optionalDriver.isPresent()) {
            Driver driver = optionalDriver.get();         
            // Set user reference to null in bookings
            List<Booking> bookings = driver.getBookings();
            if (bookings != null) {
                for (Booking booking : bookings) {
                    booking.setDriver(null);
                    bookingRepository.save(booking);
                }
            }
            
            // Delete the driver
            driverRepository.deleteById(driverId);
        }
    }
    
}
