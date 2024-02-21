package com.caltech.pojo;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.caltech.constants.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "tbl_Admin")
@Data
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("ADMIN")
public class Admin extends UserBase {

    @Column(name = "userType")
    @Enumerated(EnumType.STRING) 
	@NotNull(message = "User type cannot be null")
	private Role role = Role.ADMIN;
    
	public Admin(String firstName, String lastName, String mobileNumber, String email,
			@Size(min = 8, max = 16, message = "Username must be between 8 and 16 characters") String username,
			@Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters") String password,
			LocalDateTime registrationDate, Role role) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.mobileNumber = mobileNumber;
		this.email = email;
		this.username = username;
		this.password = password;
		this.registrationDate = LocalDateTime.now();
		this.role = Role.ADMIN;
	}	
}
