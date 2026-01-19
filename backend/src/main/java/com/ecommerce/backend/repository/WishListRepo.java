package com.ecommerce.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.backend.model.WishList;

@Repository
public interface WishListRepo extends JpaRepository<WishList, Integer> {
    List<WishList> findByUserId(Integer userid);

    List<WishList> findByUserIdOrderByUpdatedatDesc(Integer userid);

    Optional<WishList> findByUserIdAndProductId(Integer userid, Integer productid);

}
