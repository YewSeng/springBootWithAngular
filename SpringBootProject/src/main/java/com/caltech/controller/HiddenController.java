package com.caltech.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotBlank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.caltech.controller.response.AdminResponse;
import com.caltech.controller.response.ContactResponse;
import com.caltech.pojo.Admin;
import com.caltech.pojo.Contact;
import com.caltech.service.AdminService;
import com.caltech.service.ContactService;

@RestController
@RequestMapping("/v1/hidden")
public class HiddenController {

	@Autowired
	private AdminService adminService;
	
	@Autowired
	private ContactService contactService;
	
	@Value("${hidden.key}")
	private String hiddenKey;
	
	@GetMapping("/viewAllContacts")
	public ResponseEntity<List<ContactResponse>> getAllContacts(@RequestParam @NotBlank String adminKey) {
	    try {
	        if (contactService.verifyAdminKey(adminKey)) {
	            List<Contact> contactList = contactService.getAllEnquiries();
	            List<ContactResponse> contactResponse = contactList.stream()
	                    .map(contact -> new ContactResponse(contact, "Successfully fetched Contact with contact id " + contact.getContactId()))
	                    .collect(Collectors.toList());
	            return ResponseEntity.ok(contactResponse);
	        }
	        return ResponseEntity.badRequest().body(Collections.emptyList());
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Collections.singletonList(new ContactResponse(null, "Error while processing the request")));
	    }
	}

    @PostMapping("/registerAdmin")
    public ResponseEntity<AdminResponse> registerAdmin(@RequestBody Admin admin, @RequestParam @NotBlank String adminKey) {
        if (adminService.verifyAdminKey(adminKey)) {
            Admin createdAdmin = adminService.createAdmin(admin);
            return ResponseEntity.ok(new AdminResponse(createdAdmin, "Successfully created Admin with Username: "+admin.getUsername()));
        }
        return ResponseEntity.badRequest().body(new AdminResponse(null, "Invalid Admin Key"));
    }
    
}
