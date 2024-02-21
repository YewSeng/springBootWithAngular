package com.caltech.pojo;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import com.caltech.constants.Role;
import com.caltech.service.SingaporePhoneNumber;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@MappedSuperclass
@Data
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
public abstract class UserBase {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-char")
    @Column(name = "id", nullable = false)
    protected UUID id;

    @Column(name = "firstName", length = 50, nullable = false)
	protected String firstName;

    @Column(name = "lastName", length = 50, nullable = false)
    protected String lastName;

    @Column(name = "mobileNumber", length = 11, nullable = false)
    @SingaporePhoneNumber(message = "Invalid Singapore mobile number")
    protected String mobileNumber;

    @Column(name = "email", length = 50, unique = true, nullable = false)
    protected String email;

    @Column(name = "username", length = 20, unique = true, nullable = false)
    @Size(min = 8, max = 16, message = "Username must be between 8 and 16 characters")
    protected String username;

    @Column(name = "password", length = 255, nullable = false)
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
    protected String password;

    @Column(name = "registrationDate")
    protected LocalDateTime registrationDate = LocalDateTime.now();
    
    @Column(name = "userType")
    @Enumerated(EnumType.STRING) 
	@NotNull(message = "User type cannot be null")
    protected Role role;

}
