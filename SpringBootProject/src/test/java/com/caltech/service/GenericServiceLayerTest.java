package com.caltech.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import javax.validation.ConstraintValidatorContext;
import javax.validation.ConstraintValidatorContext.ConstraintViolationBuilder;

import org.junit.jupiter.api.BeforeEach;
import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

@Suite
@SelectClasses({AdminServiceTest.class, BcryptServiceTest.class, 
	BookingServiceTest.class, DriverServiceTest.class, 
	FareCalculatorServiceTest.class, SingaporePhoneNumberValidatorTest.class,
	UserServiceTest.class, ContactServiceTest.class})
class GenericServiceLayerTest {

}
