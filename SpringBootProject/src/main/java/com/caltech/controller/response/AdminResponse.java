package com.caltech.controller.response;

import com.caltech.pojo.Admin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminResponse {
    private Admin admin;
    private String message;
}
