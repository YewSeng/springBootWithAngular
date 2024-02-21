package com.caltech.service;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Documented
@Constraint(validatedBy = SingaporePhoneNumberValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface SingaporePhoneNumber {
    String message() default "Invalid Singapore phone number";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
