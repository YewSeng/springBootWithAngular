package com.caltech;

import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;
import com.caltech.controller.*;
import com.caltech.service.*;


@Suite
@SelectClasses({AdminServiceTest.class, BcryptServiceTest.class, 
	BookingServiceTest.class, DriverServiceTest.class, 
	FareCalculatorServiceTest.class, SingaporePhoneNumberValidatorTest.class,
	UserServiceTest.class, ContactServiceTest.class, AdminControllerTest.class, BookingControllerTest.class, 
	HiddenControllerTest.class, DriverControllerTest.class, 
	IndexControllerTest.class, UserControllerTest.class})
public class GenericTest {

}
