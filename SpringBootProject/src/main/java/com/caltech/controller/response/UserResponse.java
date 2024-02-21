package com.caltech.controller.response;

import com.caltech.pojo.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
	private User user;
    private String message;
}
