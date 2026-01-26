package com.ecommerce.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.model.WishList;
import com.ecommerce.backend.repository.ProductRepo;
import com.ecommerce.backend.repository.UserRepo;
import com.ecommerce.backend.repository.WishListRepo;

@Service
public class WishListService {
    @Autowired
    private WishListRepo wishListRepo;

    @Autowired
    private ProductRepo prodRepo;

    @Autowired
    private UserRepo userRepo;

    public WishList addToWishList(Integer userid, Integer productid) {
        User user = userRepo.findById(userid)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = prodRepo.findById(productid)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WishList wishList = new WishList();
        wishList.setUser(user);
        wishList.setProduct(product);
        return wishListRepo.save(wishList);
    }

    public List<WishList> getWishListByUser(Integer userid) {
        return wishListRepo.findByUserId(userid); 
    }

    public void removeFromWishList(Integer wishlistid) {
        wishListRepo.deleteById(wishlistid);
    }

    public List<WishList> getWishListByUseridSorted(Integer userid) {
        return wishListRepo.findByUserIdOrderByUpdatedatDesc(userid);
    }

    public WishList addOrUpdateWishList(Integer userid, Integer productid) {
        Optional<WishList> existing = wishListRepo.findByUserIdAndProductId(userid, productid);

        if (existing.isPresent()) {
            WishList item = existing.get();
            item.setUpdatedat(LocalDateTime.now());
            return wishListRepo.save(item);
        } else {
            WishList newItem = new WishList();
            newItem.setUser(userRepo.findById(userid).get());
            newItem.setProduct(prodRepo.findById(productid).get());
            newItem.setUpdatedat(LocalDateTime.now());
            return wishListRepo.save(newItem);
        }
    }

    public List<WishList> mergeGuestWishList(Integer userid, List<Integer> guestProductids) {
        for (Integer productid : guestProductids) {
            addOrUpdateWishList(userid, productid);
        }
        return getWishListByUseridSorted(userid);
    }
}
