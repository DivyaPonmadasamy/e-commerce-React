package com.ecommerce.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.services.CategoryService;

@RestController
public class CategoryController {
    @Autowired
    private CategoryService catService;

    // fetch all categories
    @GetMapping("/getallcategories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.status(200).body(catService.getAllCategories());
    }
}
