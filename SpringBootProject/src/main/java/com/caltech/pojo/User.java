package com.caltech.pojo;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.caltech.constants.CabType;
import com.caltech.constants.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_User")
@Data
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("USER")
public class User extends UserBase {
	
	@Column(name = "preferences")
	@Enumerated(EnumType.STRING) 
	@NotNull(message = "CabType must be specified")
	private CabType preferences;
	
    @Column(name = "userType")
    @Enumerated(EnumType.STRING) 
	@NotNull(message = "User type cannot be null")
	private Role role = Role.USER;
	
	@OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
	@JoinTable(name = "user_booking",
	//present class column or id
	joinColumns = {@JoinColumn(name = "userId", referencedColumnName = "id")},
	//next class column or id
	inverseJoinColumns = {@JoinColumn(name = "bookingId", referencedColumnName = "bookingId")})
	private List<Booking> bookings = new ArrayList<>();;
	
	public User(String firstName, String lastName, String mobileNumber, String email,
			@Size(min = 8, max = 16, message = "Username must be between 8 and 16 characters") String username,
			@Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters") String password,
			@NotNull(message = "CabType must be specified") CabType preferences, 
			LocalDateTime registrationDate, Role role) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.mobileNumber = mobileNumber;
		this.email = email;
		this.username = username;
		this.password = password;
		this.preferences = preferences;
		this.registrationDate = LocalDateTime.now();
		this.role = Role.USER;
	}
}
