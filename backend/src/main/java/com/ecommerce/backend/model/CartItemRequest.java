package com.ecommerce.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
// DTO for CartItemController addOrUpdateFromMain()
public class CartItemRequest {
    private Integer userid;
    private Integer productid;
    private Integer quantity;
}