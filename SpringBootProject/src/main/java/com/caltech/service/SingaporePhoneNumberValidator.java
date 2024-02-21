package com.caltech.service;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class SingaporePhoneNumberValidator implements ConstraintValidator<SingaporePhoneNumber, String> {

    @Override
    public void initialize(SingaporePhoneNumber constraintAnnotation) {
    }

    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext context) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            return false;
        }

        // Check if the phone number starts with +65
        if (phoneNumber.startsWith("+65")) {
            // Remove the +65 prefix
            String numberWithoutPrefix = phoneNumber.substring(3);

            // Check if the remaining part is a valid 8-digit number starting with 8 or 9
            if (numberWithoutPrefix.matches("[89]\\d{7}")) {
                return true;
            } else {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Invalid Singapore mobile number format. Must be an 8-digit number starting with 8 or 9.")
                        .addConstraintViolation();
                return false;
            }
        } else {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Invalid Singapore mobile number format. Must start with +65.")
                    .addConstraintViolation();
            return false;
        }
    }
}
