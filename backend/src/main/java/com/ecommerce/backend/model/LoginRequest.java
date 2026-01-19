package com.ecommerce.backend.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
//DTO for login validation request
public class LoginRequest {
    private String email;
    private String password;
}
