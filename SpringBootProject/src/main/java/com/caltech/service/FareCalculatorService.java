package com.caltech.service;

import java.text.DecimalFormat;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoField;

import org.springframework.stereotype.Service;

import com.caltech.constants.CabType;
import com.caltech.pojo.Booking;

@Service
public class FareCalculatorService {

    public static final double STANDARD_FARE_RATE = 2.5;
    public static final double PREMIUM_FARE_RATE = 3.0;
    public static final double LIMOUSINE_FARE_RATE = 4.0;
    public static final double SPECIAL_FARE_RATE = 3.5;

    public static final double DISTANCE_FARE_RATE = 0.5; 

    public static final double WEEKEND_SURCHARGE = 1.5; 
    public static final double PEAK_HOUR_SURCHARGE = 1.2; 
    
    public double calculateFare(Booking booking) {
        CabType cabType = booking.getVehicleType();
        double baseFare = getBaseFare(cabType);
        double distanceFare = getDistanceFare(booking.getSource(), booking.getDestination());
        double timeOfDayMultiplier = getTimeOfDayMultiplier(booking.getBookingTime());

        // Apply surcharge only if it's a weekend
        if (isWeekend(booking.getBookingTime())) {
            baseFare *= WEEKEND_SURCHARGE;
        }

        // Apply surcharge only if it's a peak hour
        if (isPeakHour(booking.getBookingTime())) {
            baseFare *= PEAK_HOUR_SURCHARGE;
        }

        // Calculate total fare
        double totalFare = baseFare + distanceFare * timeOfDayMultiplier;
        // Format the fare with 2 decimal places
        DecimalFormat df = new DecimalFormat("0.00");
        return Double.valueOf(df.format(totalFare));
    }


    private double getBaseFare(CabType cabType) {
        switch (cabType) {
            case STANDARD:
                return STANDARD_FARE_RATE;
            case PREMIUM:
                return PREMIUM_FARE_RATE;
            case LIMOUSINE:
                return LIMOUSINE_FARE_RATE;
            case SPECIAL:
                return SPECIAL_FARE_RATE;
            default:
                throw new IllegalArgumentException("Unsupported cab type: " + cabType);
        }
    }

    private double getDistanceFare(int source, int destination) {
        int distance = Math.abs(destination - source);
        // Calculate the number of 5-unit parts of the distance
        int distanceParts = (int) Math.ceil((double) distance / 5);       
        // Increase the fare for every 5 units of distance
        return distanceParts * DISTANCE_FARE_RATE;
    }

    private double getTimeOfDayMultiplier(LocalDateTime bookingTime) {
        LocalTime timeOfDay = bookingTime.toLocalTime();
        int hour = timeOfDay.get(ChronoField.HOUR_OF_DAY);

        // Example: increase fare during late hours
        if (hour >= 22 || hour < 6) {
            return 1.2;
        }

        // Default multiplier for other hours
        return 1.0;
    }

    private boolean isWeekend(LocalDateTime bookingTime) {
        DayOfWeek dayOfWeek = bookingTime.getDayOfWeek();
        return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
    }

    private boolean isPeakHour(LocalDateTime bookingTime) {
        // Example: consider peak hours from 7 AM to 10 AM and 5 PM to 8 PM
        LocalTime timeOfDay = bookingTime.toLocalTime();
        int hour = timeOfDay.get(ChronoField.HOUR_OF_DAY);
        return (hour >= 7 && hour < 10) || (hour >= 17 && hour < 20);
    }
}
