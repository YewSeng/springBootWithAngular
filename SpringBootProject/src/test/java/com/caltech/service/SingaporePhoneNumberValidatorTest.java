package com.caltech.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import javax.validation.ConstraintValidatorContext;
import javax.validation.ConstraintValidatorContext.ConstraintViolationBuilder;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class SingaporePhoneNumberValidatorTest {

    @InjectMocks
    private SingaporePhoneNumberValidator validator;

    @Mock
    private ConstraintValidatorContext context;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }



    @Test
    @DisplayName("Valid Singapore phone number")
    void testValidSingaporePhoneNumber() {
        assertTrue(validator.isValid("+6581234567", context));
        assertTrue(validator.isValid("+6598765432", context));
    }

    @Test
    @DisplayName("Invalid Singapore phone number - missing +65 prefix")
    void testInvalidPhoneNumberMissingPrefix() {
        ConstraintViolationBuilder builder = mock(ConstraintViolationBuilder.class);
        when(context.buildConstraintViolationWithTemplate(Mockito.any()))
                .thenReturn(builder);
        assertFalse(validator.isValid("81234567", context));
        assertFalse(validator.isValid("98765432", context));
    }

    @Test
    @DisplayName("Invalid Singapore phone number - invalid digit after +65 prefix")
    void testInvalidDigitAfterPrefix() {
        ConstraintViolationBuilder builder = mock(ConstraintViolationBuilder.class);
        when(context.buildConstraintViolationWithTemplate(Mockito.any()))
                .thenReturn(builder);
        assertFalse(validator.isValid("+6501234567", context));
        assertFalse(validator.isValid("+651234567", context));
        assertFalse(validator.isValid("+65987654321", context));
        assertFalse(validator.isValid("+659876543", context));
        assertFalse(validator.isValid("+65abcd1234", context));
    }

    @Test
    @DisplayName("Invalid Singapore phone number - non-numeric characters")
    void testInvalidNonNumericCharacters() {
        ConstraintViolationBuilder builder = mock(ConstraintViolationBuilder.class);
        when(context.buildConstraintViolationWithTemplate(Mockito.any()))
                .thenReturn(builder);
        assertFalse(validator.isValid("+65abcd1234", context));
        assertFalse(validator.isValid("+65!@#$%^&*(", context));
    }

    @Test
    @DisplayName("Invalid Singapore phone number - null or blank")
    void testInvalidNullOrBlank() {
        assertFalse(validator.isValid(null, context));
        assertFalse(validator.isValid("", context));
        assertFalse(validator.isValid(" ", context));
    }
}
