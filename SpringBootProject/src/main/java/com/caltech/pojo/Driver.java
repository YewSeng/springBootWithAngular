package com.caltech.pojo;

import java.time.LocalDateTime;
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
@Table(name = "tbl_Driver")
@Data
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("DRIVER")
public class Driver extends UserBase {

	@Enumerated(EnumType.STRING) 
	@NotNull(message = "CabType must be specified")
	private CabType vehicleType;
	
	@Column(name = "carBrand", length = 20, nullable = false)
	private String carBrand;
	
	@Column(name = "carColor", length = 20, nullable = false)
	private String carColor;
	
    @Column(name = "userType")
    @Enumerated(EnumType.STRING) 
	@NotNull(message = "User type cannot be null")
	private Role role = Role.DRIVER;
	
	@OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
	@JoinTable(name = "driver_booking",
	//present class column or id
	joinColumns = {@JoinColumn(name = "driverId", referencedColumnName = "id")},
	//next class column or id
	inverseJoinColumns = {@JoinColumn(name = "bookingId", referencedColumnName = "bookingId")})
	private List<Booking> bookings;
	
	public Driver(String firstName, String lastName, String mobileNumber, String email,
			@Size(min = 8, max = 16, message = "Username must be between 8 and 16 characters") String username,
			@Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters") String password,
			@NotNull(message = "CabType must be specified") CabType vehicleType, 
			String carBrand, String carColor, LocalDateTime registrationDate, Role role) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.mobileNumber = mobileNumber;
		this.email = email;
		this.username = username;
		this.password = password;
		this.vehicleType = vehicleType;
		this.carBrand = carBrand;
		this.carColor = carColor;
		this.registrationDate = LocalDateTime.now();
		this.role = Role.DRIVER;
	}
}
