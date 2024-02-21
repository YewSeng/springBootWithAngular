package com.caltech.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.caltech.pojo.Contact;
import com.caltech.repository.AdminRepository;
import com.caltech.repository.ContactRepository;

import lombok.Data;

@Data
@Service
public class ContactService {

	@Autowired
	private ContactRepository contactRepository;
	
	@Value("${hidden.key}")
	private String hiddenKey;
	
	public boolean verifyAdminKey(String key) {
		return key != null && key.trim().equals(hiddenKey.trim());
	}
	
	public Contact createEnquiry(Contact contact) {
		return contactRepository.save(contact);
	}
	
	public List<Contact> getAllEnquiries() {
		return contactRepository.findAll();
	}
}
