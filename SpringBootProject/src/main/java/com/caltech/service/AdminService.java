package com.caltech.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.caltech.pojo.Admin;
import com.caltech.repository.AdminRepository;

import lombok.Data;

@Data
@Service
public class AdminService {

	@Autowired
	private AdminRepository adminRepository;
	
	@Value("${hidden.key}")
	private String hiddenKey;
	
	public boolean verifyAdminKey(String key) {
		return key != null && key.trim().equals(hiddenKey.trim());
	}
	
    public Optional<Admin> findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public boolean authenticateAdmin(String username, String password) {
        boolean correctPassword = false;
        
        Optional<Admin> adminOptional = findByUsername(username);
        
        if (adminOptional.isPresent()) {
            Admin admin = adminOptional.get();
            String hashPasswordFromDb = admin.getPassword();
            correctPassword = BcryptService.verifyPassword(password, hashPasswordFromDb);
        }
        
        return correctPassword;
    }
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
    
    public Admin getAdminById(UUID adminId) {
        Optional<Admin> optionalAdmin = adminRepository.findById(adminId);
        return optionalAdmin.orElse(null);
    }
    
    public Admin createAdmin(Admin admin) {
    	if (admin.getUsername() != null && admin.getEmail() != null ) {
        	admin.setPassword(BcryptService.hashPasssword(admin.getPassword()));
            return adminRepository.save(admin);
    	}
    	return null;
    }
    
    public Admin updateAdmin(UUID adminId, Admin updatedAdmin) {
        Optional<Admin> optionalAdmin = adminRepository.findById(adminId);
        if (optionalAdmin.isPresent()) {
            Admin existingAdmin = optionalAdmin.get();
            // Update fields based on your requirements
            existingAdmin.setFirstName(updatedAdmin.getFirstName());
            existingAdmin.setLastName(updatedAdmin.getLastName());
            // Update other fields as needed
            return adminRepository.save(existingAdmin);
        }
        return null;
    }
    
    public void deleteAdmin(UUID adminId) {
        adminRepository.deleteById(adminId);
    }
}
