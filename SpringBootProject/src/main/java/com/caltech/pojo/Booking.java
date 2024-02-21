package com.caltech.pojo;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import com.caltech.constants.CabType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_Booking")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {
	
	@Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-char")
	@Column(name = "bookingId", nullable = false)
	private UUID bookingId;
	
	@Column(name = "currentLocation", length = 6, nullable = false)
	@Digits(integer = 6, fraction = 0, message = "Postal Code must be a 6-digit number")
	private int source;
	
	@Column(name = "targetLocation", length = 6, nullable = false)
	@Digits(integer = 6, fraction = 0, message = "Postal Code must be a 6-digit number")
	private int destination;
	
	@Enumerated(EnumType.STRING) 
	@NotNull(message = "CabType must be specified")
	private CabType vehicleType;
	
	@Column(name = "fees", length = 6, nullable = false)
	private double travelFare;
	
    @Column(name = "bookingTime", nullable = false)
    private LocalDateTime bookingTime;
    
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "userId")
	private User user;
	
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "driverId")
	private Driver driver;

	public Booking(@Digits(integer = 6, fraction = 0, message = "Postal Code must be a 6-digit number") int source,
			@Digits(integer = 6, fraction = 0, message = "Postal Code must be a 6-digit number") int destination,
			@NotNull(message = "CabType must be specified") CabType vehicleType, double travelFare,
			LocalDateTime bookingTime, User user, Driver driver) {
		super();
		this.source = source;
		this.destination = destination;
		this.vehicleType = vehicleType;
		this.travelFare = travelFare;
		this.bookingTime = bookingTime;
		this.user = user;
		this.driver = driver;
	}	
}
