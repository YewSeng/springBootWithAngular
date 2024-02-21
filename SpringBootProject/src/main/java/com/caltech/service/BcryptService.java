package com.caltech.service;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class BcryptService {

	public static final String  SALT = BCrypt.gensalt(12);
	
	public static Boolean verifyPassword(String password, String hashPassword) {
		return BCrypt.checkpw(password, hashPassword);
	}
	
	public static String hashPasssword(String password) {
		return BCrypt.hashpw(password, SALT);
	}
}
