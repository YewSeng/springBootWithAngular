package com.caltech.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class BcryptServiceTest {

    @InjectMocks
    private BcryptService bcryptService;
    
	@BeforeEach
	void setUp() throws Exception {
	}

	   @Test
	    @DisplayName("Test verifyPassword method")
	    void testVerifyPassword() {
	        // Mock input values
	        String password = "password";
	        String hashPassword = BCrypt.hashpw(password, BcryptService.SALT);
	        // Call the actual verifyPassword method
	        Boolean result = BcryptService.verifyPassword(password, hashPassword);
	        // Assert the result
	        assertTrue(result);
	    }

	    @Test
	    @DisplayName("Test hashPassword method")
	    void testHashPassword() {
	        // Mock input values
	        String password = "password";
	        // Call the actual hashPassword method
	        String result = BcryptService.hashPasssword(password);
	        // Assert the result
	        assertTrue(result.startsWith("$2a$12$"));
	    }
}
