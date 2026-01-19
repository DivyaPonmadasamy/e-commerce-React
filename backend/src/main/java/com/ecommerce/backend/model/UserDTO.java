package com.ecommerce.backend.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDTO {
    private Integer id;
    private String email;

    public UserDTO(Integer id, String email){
        this.id = id;
        this.email = email;
    }
}
