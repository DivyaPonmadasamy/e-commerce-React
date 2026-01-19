package com.ecommerce.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
    
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WishListResponse {
    private Integer id;
    private String name;
    private String url;
    private Float mrp;
    private Integer discount;
    private Integer productid;
}
