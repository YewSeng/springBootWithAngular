package com.caltech.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.caltech.pojo.Contact;
import com.caltech.repository.ContactRepository;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private ContactService contactService;

    @Value("${hidden.key}")
    private String hiddenKey;

    @BeforeEach
    void setUp() {
       MockitoAnnotations.openMocks(this);
       contactService.setHiddenKey("018ca101-8bd5-7d8f-981f-5dd258c5d917");
    }
    
    @Test
    @DisplayName("Test verifyAdminKey with valid key")
    void testVerifyAdminKeyWithValidKey() {
        String validKey = "018ca101-8bd5-7d8f-981f-5dd258c5d917";
        assertTrue(contactService.verifyAdminKey(validKey));
    }

    @Test
    @DisplayName("Test verifyAdminKey with invalid key")
    void testVerifyAdminKeyWithInvalidKey() {
    	String invalidKey = "yourInvalidKey";
        assertFalse(contactService.verifyAdminKey(invalidKey));
    }

    @Test
    @DisplayName("Test createEnquiry")
    void testCreateEnquiry() {
        Contact mockContact = new Contact("John Doe", "john.doe@example.com", "How can I help?");
        when(contactRepository.save(any(Contact.class))).thenReturn(mockContact);

        Contact savedContact = contactService.createEnquiry(mockContact);

        assertNotNull(savedContact);
        assertEquals("John Doe", savedContact.getName());
        assertEquals("john.doe@example.com", savedContact.getEmail());
        assertEquals("How can I help?", savedContact.getEnquiries());
    }

    @Test
    @DisplayName("Test getAllEnquiries")
    void testGetAllEnquiries() {
        Contact contact1 = new Contact("John Doe", "john.doe@example.com", "How can I help?");
        Contact contact2 = new Contact("Jane Doe", "jane.doe@example.com", "General Inquiry");
        List<Contact> mockContacts = Arrays.asList(contact1, contact2);

        when(contactRepository.findAll()).thenReturn(mockContacts);

        List<Contact> allEnquiries = contactService.getAllEnquiries();

        assertNotNull(allEnquiries);
        assertEquals(2, allEnquiries.size());
        assertEquals("John Doe", allEnquiries.get(0).getName());
        assertEquals("Jane Doe", allEnquiries.get(1).getName());
    }

}
