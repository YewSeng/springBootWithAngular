package com.caltech.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.caltech.pojo.Booking;
import com.caltech.repository.BookingRepository;

@Service
public class BookingService {

	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private FareCalculatorService fairCalculatorService;
	
    public Booking getBookingById(UUID bookingId) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        return optionalBooking.orElse(null);
    }
    
    public List<Booking> getBookingsByUserId(UUID userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    public List<Booking> getBookingsByDriverId(UUID driverId) {
        return bookingRepository.findByDriverId(driverId);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Booking createBooking(Booking booking) {
    	booking.setTravelFare(fairCalculatorService.calculateFare(booking));
        return bookingRepository.save(booking);
    }
    
    public Booking updateBooking(UUID bookingId, Booking updatedBooking) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            Booking existingBooking = optionalBooking.get();
            // Update fields based on your requirements
            existingBooking.setSource(updatedBooking.getSource());
            existingBooking.setDestination(updatedBooking.getDestination());
            existingBooking.setBookingTime(updatedBooking.getBookingTime());
            // per update will result in an additional $3 surcharge
            existingBooking.setTravelFare(existingBooking.getTravelFare() + 3.00);
            return bookingRepository.save(existingBooking);
        }
        return null;
    }
    
    public void deleteBooking(UUID bookingId) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);

        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();

            // Disassociate from User
            if (booking.getUser() != null) {
                List<Booking> userBookings = booking.getUser().getBookings();
                if (userBookings != null) {
                    userBookings.remove(booking);
                }
                booking.setUser(null);
            }

            // Disassociate from Driver
            if (booking.getDriver() != null) {
                List<Booking> driverBookings = booking.getDriver().getBookings();
                if (driverBookings != null) {
                    driverBookings.remove(booking);
                }
                booking.setDriver(null);
            }

            // Save the modified entities
            bookingRepository.save(booking);

            // Delete the Booking
            bookingRepository.delete(booking);
        }
	}
}
