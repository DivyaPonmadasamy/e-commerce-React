package com.ecommerce.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.repository.CategoryRepo;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepo catRepo;

    // public List<Category> getAllCategories() {
    //     return catRepo.findAll();
    // }

    public List<Category> getAllCategories() {
            // return catRepo.findAll();
        return catRepo.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }
}
