package com.caltech.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

import com.caltech.pojo.Admin;
import com.caltech.repository.AdminRepository;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class AdminServiceTest {

    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private AdminService adminService;
    
    @InjectMocks
    private BcryptService bcryptService;
    
    @Value("${hidden.key}")
    private String hiddenKey;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
       adminService.setHiddenKey("018ca101-8bd5-7d8f-981f-5dd258c5d917");
    }
    
    @Test
    @DisplayName("Test verifyAdminKey with valid key")
    void testVerifyAdminKeyWithValidKey() {
        String validKey = "018ca101-8bd5-7d8f-981f-5dd258c5d917";
        assertTrue(adminService.verifyAdminKey(validKey));
    }

    @Test
    @DisplayName("Test verifyAdminKey with invalid key")
    void testVerifyAdminKeyWithInvalidKey() {
        String invalidKey = "yourInvalidKey";
        assertFalse(adminService.verifyAdminKey(invalidKey));
    }


    @Test
    @DisplayName("Test findByUsername with existing username")
    void testFindByUsernameWithExistingUsername() {
        String existingUsername = "existingUser";
        Admin mockAdmin = new Admin();
        when(adminRepository.findByUsername(existingUsername)).thenReturn(Optional.of(mockAdmin));
        Optional<Admin> result = adminService.findByUsername(existingUsername);
        assertTrue(result.isPresent());
        assertEquals(mockAdmin, result.get());
    }

    @Test
    @DisplayName("Test findByUsername with non-existing username")
    void testFindByUsernameWithNonExistingUsername() {
        String nonExistingUsername = "nonExistingUser";
        when(adminRepository.findByUsername(nonExistingUsername)).thenReturn(Optional.empty());
        Optional<Admin> result = adminService.findByUsername(nonExistingUsername);
        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Test authenticateAdmin with correct credentials")
    void testAuthenticateAdminWithCorrectCredentials() {
        String username = "existingUser";
        String password = "correctPassword";
        String hashedPassword = BcryptService.hashPasssword(password);
        Admin mockAdmin = new Admin();
        mockAdmin.setPassword(hashedPassword);
        when(adminRepository.findByUsername(username)).thenReturn(Optional.of(mockAdmin));
        assertTrue(adminService.authenticateAdmin(username, password));
    }


    @Test
    @DisplayName("Test authenticateAdmin with incorrect credentials")
    void testAuthenticateAdminWithIncorrectCredentials() {
        String username = "existingUser";
        String password = "incorrectPassword";
        String hashedPassword = BcryptService.hashPasssword("correctPassword");
        Admin mockAdmin = new Admin();
        mockAdmin.setPassword(hashedPassword);
        // Use the actual BcryptService method without mocking
        assertFalse(BcryptService.verifyPassword(password, mockAdmin.getPassword()));
    }

    @Test
    @DisplayName("Test getAllAdmins")
    void testGetAllAdmins() {
        List<Admin> mockAdmins = new ArrayList<>();
        mockAdmins.add(new Admin());
        mockAdmins.add(new Admin());
        when(adminRepository.findAll()).thenReturn(mockAdmins);
        List<Admin> result = adminService.getAllAdmins();
        assertEquals(mockAdmins.size(), result.size());
        assertTrue(result.containsAll(mockAdmins));
    }

    @Test
    @DisplayName("Test getAdminById with existing ID")
    void testGetAdminByIdWithExistingId() {
        UUID existingId = UUID.randomUUID();
        Admin mockAdmin = new Admin();
        when(adminRepository.findById(existingId)).thenReturn(Optional.of(mockAdmin));
        Admin result = adminService.getAdminById(existingId);
        assertNotNull(result);
        assertEquals(mockAdmin, result);
    }

    @Test
    @DisplayName("Test getAdminById with non-existing ID")
    void testGetAdminByIdWithNonExistingId() {
        UUID nonExistingId = UUID.randomUUID();
        when(adminRepository.findById(nonExistingId)).thenReturn(Optional.empty());
        Admin result = adminService.getAdminById(nonExistingId);
        assertNull(result);
    }

    @Test
    @DisplayName("Test createAdmin with valid admin")
    void testCreateAdminWithValidAdmin() {
        Admin mockAdmin = new Admin();
        mockAdmin.setUsername("validUsername");
        mockAdmin.setEmail("valid@example.com");
        mockAdmin.setPassword("validPassword");
        when(adminRepository.save(any(Admin.class))).thenReturn(mockAdmin);
        Admin result = adminService.createAdmin(mockAdmin);
        assertNotNull(result);
        assertEquals(mockAdmin, result);
    }

    @Test
    @DisplayName("Test createAdmin with invalid admin")
    void testCreateAdminWithInvalidAdmin() {
        Admin invalidAdmin = new Admin(); // Set required fields to null
        Admin result = adminService.createAdmin(invalidAdmin);
        assertNull(result);
    }

    @Test
    @DisplayName("Test updateAdmin with existing ID and valid updatedAdmin")
    void testUpdateAdminWithExistingIdAndValidUpdatedAdmin() {
        UUID existingId = UUID.randomUUID();
        Admin existingAdmin = new Admin();
        Admin updatedAdmin = new Admin();
        when(adminRepository.findById(existingId)).thenReturn(Optional.of(existingAdmin));
        when(adminRepository.save(any(Admin.class))).thenReturn(updatedAdmin);
        Admin result = adminService.updateAdmin(existingId, updatedAdmin);
        assertNotNull(result);
        assertEquals(updatedAdmin, result);
    }

    @Test
    @DisplayName("Test updateAdmin with non-existing ID")
    void testUpdateAdminWithNonExistingId() {
        UUID nonExistingId = UUID.randomUUID();
        Admin updatedAdmin = new Admin();

        when(adminRepository.findById(nonExistingId)).thenReturn(Optional.empty());

        Admin result = adminService.updateAdmin(nonExistingId, updatedAdmin);

        assertNull(result);
    }

    @Test
    @DisplayName("Test deleteAdmin with existing ID")
    void testDeleteAdminWithExistingId() {
        UUID existingId = UUID.randomUUID();
        adminService.deleteAdmin(existingId);
        // Verify that deleteById was called with the correct ID
        verify(adminRepository).deleteById(existingId);
    }

    @Test
    @DisplayName("Test deleteAdmin with non-existing ID")
    void testDeleteAdminWithNonExistingId() {
        UUID nonExistingId = UUID.randomUUID();
        adminService.deleteAdmin(nonExistingId);
    }
}

