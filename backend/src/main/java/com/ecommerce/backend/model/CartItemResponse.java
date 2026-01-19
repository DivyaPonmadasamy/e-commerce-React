package com.ecommerce.backend.model;

import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Integer id;
    private Integer quantity;
    private String unit;
    private String name;
    private String url;
    private Float mrp;
    private Integer discount;
    private Integer productid;
}