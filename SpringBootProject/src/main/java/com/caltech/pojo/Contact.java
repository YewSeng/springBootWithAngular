package com.caltech.pojo;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import com.caltech.constants.CabType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_Contact")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contact {

	@Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-char")
	@Column(name = "bookingId", nullable = false)
	private UUID contactId;
	
    @Column(name = "name", length = 50, nullable = false)
	private String name;
    
    @Column(name = "email", length = 50, unique = true, nullable = false)
    private String email;
    
    @Column(name = "enquiries", length = 50, unique = true, nullable = false)
    private String enquiries;

   
	public Contact(String name, String email, String enquiries) {
		super();
		this.name = name;
		this.email = email;
		this.enquiries = enquiries;
	}
}
