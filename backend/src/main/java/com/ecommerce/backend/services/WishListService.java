package com.ecommerce.backend.services;

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
    private WishListRepo wishlistRepo;

    @Autowired
    private ProductRepo prodRepo;

    @Autowired
    private UserRepo userRepo;

    public WishList addToWishlist(Integer userid, Integer productid) {
        User user = userRepo.findById(userid)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = prodRepo.findById(productid)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WishList wishlist = new WishList();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        return wishlistRepo.save(wishlist);
    }

    public List<WishList> getWishlistByUser(Integer userid) {
        return wishlistRepo.findByUserId(userid); // ✅ fixed
    }

    public void removeFromWishlist(Integer wishlistid) {
        wishlistRepo.deleteById(wishlistid);
    }

    public List<WishList> getWishListByUseridSorted(Integer userid) {
        return wishlistRepo.findByUserIdOrderByUpdatedatDesc(userid);
    }

    public WishList addOrUpdateWishlist(Integer userid, Integer productid) {
        Optional<WishList> existing = wishlistRepo.findByUserIdAndProductId(userid, productid);

        if (existing.isPresent()) {
            WishList item = existing.get();
            item.setUpdatedat(LocalDateTime.now());
            return wishlistRepo.save(item);
        } else {
            WishList newItem = new WishList();
            newItem.setUser(userRepo.findById(userid).get());
            newItem.setProduct(prodRepo.findById(productid).get());
            newItem.setUpdatedat(LocalDateTime.now());
            return wishlistRepo.save(newItem);
        }
    }

    public List<WishList> getWishlistByUseridSorted(Integer userid) {
        return wishlistRepo.findByUserIdOrderByUpdatedatDesc(userid);
    }

    public List<WishList> mergeGuestWishlist(Integer userid, List<Integer> guestProductids) {
        for (Integer prodid : guestProductids) {
            addOrUpdateWishlist(userid, prodid);
        }
        return getWishlistByUseridSorted(userid);
    }

}
