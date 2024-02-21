package com.caltech.controller.response;

import com.caltech.pojo.Driver;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverResponse {
	private Driver driver;
    private String message;
}
