package com.ecommerce.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.backend.model.CartItem;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUserId(Integer userid);

    List<CartItem> findByUserIdOrderByCreatedatDesc(Integer userid);

    // Optional<CartItem> findByUserIdAndVegetablesId(Integer userid, Integer vegetableid);
    Optional<CartItem> findByUserIdAndProductId(Integer userid, Integer productid);

    List<CartItem> findByUserIdOrderByUpdatedatDesc(Integer userid);

    int countByUserId(Integer userId);
}
