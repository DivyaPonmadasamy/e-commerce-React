package com.ecommerce.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.backend.model.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {
    List<Product> findByCategory(Integer category);

    // List<Product> findByMrpBetween(Float min, Float max);

    // List<Product> findByMrpGreaterThan(Float min);

    List<Product> findByDiscountBetween(Integer min, Integer max);

    List<Product> findByDiscountGreaterThan(Integer min);

}
