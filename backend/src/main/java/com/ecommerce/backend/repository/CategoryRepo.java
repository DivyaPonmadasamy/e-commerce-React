package com.ecommerce.backend.repository;

// import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.backend.model.Category;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Integer> {
    // @Query("SELECT c FROM Category c ORDER BY c.id ASC")
    // List<Category> findAllOrderedById()
}
