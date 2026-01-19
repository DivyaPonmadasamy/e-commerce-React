package com.ecommerce.backend.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductDTO {
    private String name;
    private String url;
    private Float mrp;
    private Integer discount;
    private Float quantity;
    private String unit;
    private Integer orderedquantity;
    private Integer category;
    private String description;
    private Integer stock;
    private Boolean isavailable;
}
