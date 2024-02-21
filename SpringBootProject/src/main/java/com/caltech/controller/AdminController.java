package com.caltech.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.caltech.controller.response.AdminResponse;
import com.caltech.pojo.Admin;
import com.caltech.service.AdminService;

@RestController
@RequestMapping("/v1/admins")
@CrossOrigin("*")
public class AdminController {

	@Autowired
	private AdminService adminService;
	
	@Value("${hidden.key}")
	private String hiddenKey;
	
	@GetMapping("/getAllAdmins")
	public ResponseEntity<List<AdminResponse>> getAllAdmins() {
	    List<Admin> admins = adminService.getAllAdmins();
	    List<AdminResponse> adminResponses = admins.stream()
	            .map(admin -> new AdminResponse(admin, "Successfully fetched Admin with admin Id: " + admin.getId()))
	            .collect(Collectors.toList());

	    return ResponseEntity.ok(adminResponses);
	}

	
	@GetMapping("/getAdmin/{adminId}")
    public ResponseEntity<AdminResponse> getAdminById(@PathVariable UUID adminId) {
        Admin admin = adminService.getAdminById(adminId);
        if (admin != null) {
            return ResponseEntity.ok(new AdminResponse(admin, "Successfully fetched Admin with adminId: "+ adminId));
        } else {
        	return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/registerAdmin")
    public ResponseEntity<AdminResponse> registerAdmin(@RequestBody Admin admin, @RequestParam String adminKey) {
        if (adminService.verifyAdminKey(adminKey)) {
            Admin createdAdmin = adminService.createAdmin(admin);
            return ResponseEntity.ok(new AdminResponse(createdAdmin, "Successfully created Admin with Username: "+admin.getUsername()));
        }
        return ResponseEntity.badRequest().body(new AdminResponse(null, "Invalid Admin Key"));
    }

    @PutMapping("/update/{adminId}")
    public ResponseEntity<AdminResponse> updateAdmin(@PathVariable UUID adminId, @RequestBody Admin updatedAdmin) {
        Admin admin = adminService.updateAdmin(adminId, updatedAdmin);
        if (admin != null) {
            return ResponseEntity.ok(new AdminResponse(admin, "Successfully updated Admin with ID: " + admin.getId()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{adminId}")
    public ResponseEntity<AdminResponse> deleteAdmin(@PathVariable UUID adminId) {
        Admin deletedAdmin = adminService.getAdminById(adminId);
        if (deletedAdmin != null) {
        	adminService.deleteAdmin(adminId);
            return ResponseEntity.ok(new AdminResponse(deletedAdmin, "Successfully deleted Admin with Username: " + deletedAdmin.getUsername()));
        } else {
        	return ResponseEntity.notFound().build();
        }
    }

}
