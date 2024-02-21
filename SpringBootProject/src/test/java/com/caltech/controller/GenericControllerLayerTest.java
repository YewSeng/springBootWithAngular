package com.caltech.controller;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;



@Suite
@SelectClasses({AdminControllerTest.class, BookingControllerTest.class, 
	HiddenControllerTest.class, DriverControllerTest.class, 
	IndexControllerTest.class, UserControllerTest.class})
class GenericControllerLayerTest {

}
