package com.caltech.controller.response;

import com.caltech.pojo.Booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {
	private Booking booking;
	private String message;
}
