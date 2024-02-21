package com.caltech.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.caltech.controller.response.DriverResponse;
import com.caltech.pojo.Driver;
import com.caltech.service.DriverService;

@RestController
@RequestMapping("/v1/drivers")
@CrossOrigin("*")
public class DriverController {

	@Autowired
	private DriverService driverService;
	
    @GetMapping("/getAllDrivers")
    public ResponseEntity<List<DriverResponse>> getAllDrivers() {
        List<Driver> drivers = driverService.getAllDrivers();
        List<DriverResponse> driversResponses = drivers.stream()
	            .map(driver -> new DriverResponse(driver, "Successfully fetched Driver with driver Id: " + driver.getId()))
	            .collect(Collectors.toList());
        return ResponseEntity.ok(driversResponses);
    }
    
    @GetMapping("/getDriver/{driverId}")
    public ResponseEntity<DriverResponse> getDriverById(@PathVariable UUID driverId) {
        Driver driver = driverService.getDriverById(driverId);
        if (driver != null) {
        	return ResponseEntity.ok(new DriverResponse(driver, "Successfully fetched Driver with driver Id: "+driver.getId()));
        } else {
        	return ResponseEntity.notFound().build();
        }    
    }
    
    @PostMapping("/registerDriver")
    public ResponseEntity<DriverResponse> createDriver(@RequestBody Driver driver) {
        Driver createdDriver = driverService.createDriver(driver);
        if (createdDriver != null) {
        	return ResponseEntity.ok(new DriverResponse(createdDriver, "Successfully created Driver with Username: "+createdDriver.getUsername()));
        } else {
            return ResponseEntity.badRequest().body(new DriverResponse(null, "Unable to create Driver Account. Invalid parameters."));
        }
    }
    
    @PutMapping("/update/{driverId}")
    public ResponseEntity<DriverResponse> updateDriver(
            @PathVariable UUID driverId, @RequestBody Driver updatedDriver) {
        Driver updated = driverService.updateDriver(driverId, updatedDriver);
        if (updated != null) {
        	return ResponseEntity.ok(new DriverResponse(updated, "Successfully updated Driver with driver Id: " + updated.getId()));
        } else {
        	return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{driverId}")
    public ResponseEntity<DriverResponse> deleteDriver(@PathVariable UUID driverId) {
        Driver deletedDriver = driverService.getDriverById(driverId);
        if (deletedDriver != null) {
        	driverService.deleteDriver(driverId);
        	return ResponseEntity.ok(new DriverResponse(deletedDriver, "Successfully deleted Driver with Username: " + deletedDriver.getUsername()));
        } else {
        	return ResponseEntity.notFound().build();
        }
    }
}
