package com.ecommerce.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.services.ProductService;

@RestController
@RequestMapping("/products") // to attach a prefix to all urls
public class ProductController {
    @Autowired
    private ProductService prodService;

    // fetch all products
    @GetMapping("/getallproducts")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.status(200).body(prodService.getAllProducts());
    }

    // fetch products by category
    @GetMapping("/category/{categoryid}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Integer categoryid) {
        return ResponseEntity.status(200).body(prodService.getProductsByCategory(categoryid));
    }

    // fetch products based on price range
    @GetMapping("/price")
    public ResponseEntity<List<Product>> getProductsByDiscountedPriceRange(
            @RequestParam Float min,
            @RequestParam(required = false) Float max) {
        return ResponseEntity.status(200).body(prodService.getProductsByDiscountedPriceRange(min, max));
    }

    @GetMapping("/discount")
    public ResponseEntity<List<Product>> getProductsByDiscount(
            @RequestParam Integer min,
            @RequestParam(required = false) Integer max) {
        return ResponseEntity.status(200).body(prodService.getProductsByDiscountRange(min, max));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Product>> getFilteredProducts(
            @RequestParam(required = false) Integer category,
            @RequestParam(required = false) Float minPrice,
            @RequestParam(required = false) Float maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) Integer maxDiscount) {

        List<Product> products = prodService.getFilteredProducts(category, minPrice, maxPrice, minDiscount,
                maxDiscount);
        return ResponseEntity.status(200).body(products);
    }
}
