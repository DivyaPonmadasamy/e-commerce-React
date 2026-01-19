package com.ecommerce.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.ProductRepo;

@Service
public class ProductService {
    @Autowired
    private ProductRepo prodRepo;

    public List<Product> getAllProducts() {
        return prodRepo.findAll();
    }

    public List<Product> getProductsByCategory(Integer categoryid) {
        return prodRepo.findByCategory(categoryid);
    }

    // public List<Product> getProductsByPriceRange(Float min, Float max) {
    // if (max == null || max == Float.MAX_VALUE) {
    // return prodRepo.findByMrpGreaterThan(min);
    // }
    // return prodRepo.findByMrpBetween(min, max);
    // }

    public List<Product> getProductsByDiscountedPriceRange(Float min, Float max) {
        List<Product> allProducts = prodRepo.findAll();

        return allProducts.stream()
                .filter(p -> {
                    float discountedPrice = (float) Math.ceil(p.getMrp() * (1 - p.getDiscount() / 100f));
                    if (max == null)
                        return discountedPrice >= min;
                    return discountedPrice >= min && discountedPrice <= max;
                })
                .collect(Collectors.toList());
    }

    public List<Product> getProductsByDiscountRange(Integer min, Integer max) {
        if (max == null) {
            return prodRepo.findByDiscountGreaterThan(min);
        }
        return prodRepo.findByDiscountBetween(min, max);
    }

    @SuppressWarnings("null") // to prevent null pointer access on minPrice and minDiscount - quick fix
                              // suggestion
    public List<Product> getFilteredProducts(Integer category, Float minPrice, Float maxPrice,
            Integer minDiscount, Integer maxDiscount) {
        List<Product> allProducts = prodRepo.findAll();

        return allProducts.stream()
                .filter(p -> {
                    // discounted price
                    float discountedPrice = (float) Math.ceil(p.getMrp() * (1 - p.getDiscount() / 100f));

                    boolean categoryMatch = (category == null || p.getCategory().equals(category));
                    // boolean priceMatch = (maxPrice == null
                    // ? discountedPrice >= minPrice
                    // : discountedPrice >= minPrice && discountedPrice <= maxPrice);
                    boolean priceMatch = (minPrice == null && maxPrice == null)
                            ? true
                            : (maxPrice == null
                                    ? discountedPrice >= minPrice
                                    : discountedPrice >= minPrice && discountedPrice <= maxPrice);
                    // boolean discountMatch = (minDiscount == null || maxDiscount == null
                    // ? true
                    // : p.getDiscount() >= minDiscount && p.getDiscount() <= maxDiscount);
                    boolean discountMatch = (minDiscount == null && maxDiscount == null)
                            ? true
                            : (maxDiscount == null
                                    ? p.getDiscount() >= minDiscount
                                    : p.getDiscount() >= minDiscount && p.getDiscount() <= maxDiscount);

                    return categoryMatch && priceMatch && discountMatch;
                })
                .collect(Collectors.toList());
    }
}
