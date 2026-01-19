package com.ecommerce.backend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.repository.CartItemRepo;
import com.ecommerce.backend.repository.ProductRepo;
import com.ecommerce.backend.repository.UserRepo;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CartItemService {
    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProductRepo prodRepo;

    public List<CartItem> getCartItemByUserid(Integer userid) {
        return cartItemRepo.findByUserId(userid);
    }

    public List<CartItem> getCartItemByUseridSorted(Integer userid) {
        return cartItemRepo.findByUserIdOrderByUpdatedatDesc(userid);
    }

    public CartItem addOrUpdateFromMainPage(Integer userid, Integer prodid, Integer quantity) {
        Optional<CartItem> existing = cartItemRepo.findByUserIdAndProductId(userid, prodid);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setUpdatedat(LocalDateTime.now());
            return cartItemRepo.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(userRepo.findById(userid).get());
            newItem.setProduct(prodRepo.findById(prodid).get());
            newItem.setQuantity(quantity);
            return cartItemRepo.save(newItem);
        }
    }

    public CartItem incrementQuantity(Integer cartItemId) {
        CartItem item = cartItemRepo.findById(cartItemId).orElseThrow();
        item.setQuantity(item.getQuantity() + 1);
        return cartItemRepo.save(item);
    }

    public CartItem decrementQuantity(Integer cartItemId) {
        CartItem item = cartItemRepo.findById(cartItemId).orElseThrow();
        int newQty = Math.max(0, item.getQuantity() - 1);
        item.setQuantity(newQty);
        return cartItemRepo.save(item);
    }

    public void deleteCartItem(Integer cartItemId) {
        cartItemRepo.deleteById(cartItemId);
    }

    public int getCartCount(Integer userId) {
        return cartItemRepo.countByUserId(userId);
    }

    public CartItem addMoreQuantity(int cartItemId, int quantityToAdd) {
        CartItem cartItem = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found with ID: " + cartItemId));
        cartItem.setQuantity(cartItem.getQuantity() + quantityToAdd);
        return cartItemRepo.save(cartItem);
    }

    public List<CartItem> mergeGuestItems(Integer userid, List<CartItem> guestItems) {
        for (CartItem guestItem : guestItems) {
            addOrUpdateFromMainPage(userid, guestItem.getProduct().getId(), guestItem.getQuantity());
        }
        return getCartItemByUseridSorted(userid);
    }
}
