package com.caltech.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.caltech.controller.response.UserResponse;
import com.caltech.pojo.User;
import com.caltech.service.UserService;

@RestController
@RequestMapping("/v1/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponse> usersResponse = users.stream()
        		.map(user -> new UserResponse(user, "Successfully fetched User with driver Id: " + user.getId()))
	            .collect(Collectors.toList());
        return ResponseEntity.ok(usersResponse);
    }

    @GetMapping("/getUser/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID userId) {
        User user = userService.getUserById(userId);
        if (user != null) {
        	return ResponseEntity.ok(new UserResponse(user, "Successfully fetched User with driver Id: "+user.getId()));
        } else {
        	return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/registerUser")
    public ResponseEntity<UserResponse> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        if (createdUser != null) {
        	return ResponseEntity.ok(new UserResponse(createdUser, "Successfully created User with Username: "+createdUser.getUsername()));
        } else {
            return ResponseEntity.badRequest().body(new UserResponse(null, "Unable to create User Account. Invalid parameters."));
        }
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID userId, @RequestBody User updatedUser) {
        User updated = userService.updateUser(userId, updatedUser);
        if (updated != null) {
        	return ResponseEntity.ok(new UserResponse(updated, "Successfully updated User with user Id: " + updated.getId()));
        } else {
        	return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<UserResponse> deleteUser(@PathVariable UUID userId) {
    	User deletedUser = userService.getUserById(userId);
        if (deletedUser != null) {
        	userService.deleteUser(userId);
        	return ResponseEntity.ok(new UserResponse(deletedUser, "Successfully deleted User with Username: " + deletedUser.getUsername()));
        } else {
        	return ResponseEntity.notFound().build();
        }
    }
}
