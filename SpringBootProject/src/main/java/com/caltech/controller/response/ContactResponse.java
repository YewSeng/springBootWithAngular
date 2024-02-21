package com.caltech.controller.response;

import com.caltech.pojo.Booking;
import com.caltech.pojo.Contact;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactResponse {
	private Contact contact;
	private String message;
}
