package com.caltech.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.caltech.controller.response.BookingResponse;
import com.caltech.pojo.Booking;
import com.caltech.service.BookingService;

@RestController
@RequestMapping("/v1/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable UUID bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);
        if (booking != null) {
            BookingResponse bookingResponse = new BookingResponse(booking, "Successfully fetched Booking with booking Id: " + booking.getBookingId());
            return ResponseEntity.ok(bookingResponse);
        } else {
            return ResponseEntity.badRequest().body(new BookingResponse(null, "Unable to Fetch Booking with booking Id: "+bookingId));
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserId(@PathVariable UUID userId) {
        List<Booking> userBookings = bookingService.getBookingsByUserId(userId);
        List<BookingResponse> userBookingsResponses = userBookings.stream()
	            .map(booking -> new BookingResponse(booking, "Successfully fetched Booking with booking Id: " + booking.getBookingId()))
	            .collect(Collectors.toList());
        return ResponseEntity.ok(userBookingsResponses);
    }
    
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByDriverId(@PathVariable UUID driverId) {
        List<Booking> driverBookings = bookingService.getBookingsByDriverId(driverId);
        List<BookingResponse> driverBookingsResponses = driverBookings.stream()
	            .map(booking -> new BookingResponse(booking, "Successfully fetched Booking with booking Id: " + booking.getBookingId()))
	            .collect(Collectors.toList());
        return ResponseEntity.ok(driverBookingsResponses);
    }
    
    @GetMapping("/adminBookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<Booking> allBookings = bookingService.getAllBookings();
        List<BookingResponse> allBookingsResponses = allBookings.stream()
        		.map(booking -> new BookingResponse(booking, "Successfully fetched Booking with booking Id: " + booking.getBookingId()))
 	           	.collect(Collectors.toList());	
        return ResponseEntity.ok(allBookingsResponses);
    }
    
    @PostMapping("/registerBooking")
    public ResponseEntity<BookingResponse> createBooking(@RequestBody Booking booking) {
        Booking createdBooking = bookingService.createBooking(booking);
        return ResponseEntity.ok(new BookingResponse(createdBooking, "Successfully created Booking with booking id: " +booking.getBookingId()));
    }

    @PutMapping("/update/{bookingId}")
    public ResponseEntity<BookingResponse> updateBooking(
            @PathVariable UUID bookingId, @RequestBody Booking updatedBooking) {
        Booking updated = bookingService.updateBooking(bookingId, updatedBooking);
        if (updated != null) {
        	return ResponseEntity.ok(new BookingResponse(updated, "Booking is updated with an additional surcharge of $3"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> deleteBooking(@PathVariable UUID bookingId) {
    	Booking booking = bookingService.getBookingById(bookingId);
    	if (booking != null) {
    		bookingService.deleteBooking(bookingId);
    		return ResponseEntity.ok(new BookingResponse(booking, "Successfully deleted Booking with Booking Id: " + booking.getBookingId()));         
    	} else {
            return ResponseEntity.notFound().build();
        }
    }
}
