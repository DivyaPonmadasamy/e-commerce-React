package com.ecommerce.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.model.CartItemRequest;
import com.ecommerce.backend.model.CartItemResponse;
import com.ecommerce.backend.services.CartItemService;

@RestController
public class CartItemController {
    @Autowired
    private CartItemService cartItemsService;

    // @GetMapping("/cart/{userid}")
    // public ResponseEntity<List<CartItem>> getCartItemByUserid(@PathVariable
    // Integer userid) {
    // return
    // ResponseEntity.status(200).body(cartItemsService.getCartItemByUserid(userid));
    // }

    @GetMapping("/cart/{userid}")
    public ResponseEntity<List<CartItemResponse>> getCartItemByUseridSorted(@PathVariable Integer userid) {
        List<CartItem> items = cartItemsService.getCartItemByUseridSorted(userid);
        List<CartItemResponse> response = items.stream().map(item -> new CartItemResponse(
                item.getId(),
                item.getQuantity(),
                item.getProduct().getUnit(),
                item.getProduct().getName(),
                item.getProduct().getUrl(),
                item.getProduct().getMrp(),
                item.getProduct().getDiscount(),
                item.getProduct().getId())).collect(Collectors.toList());
        // return
        // ResponseEntity.status(200).body(cartItemsService.getCartItemByUseridSorted(userid));
        return ResponseEntity.status(200).body(response);
    }

    // @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/cart")
    public ResponseEntity<CartItemResponse> addOrUpdateFromMainPage(@RequestBody CartItemRequest req) {
        CartItem item = cartItemsService.addOrUpdateFromMainPage(
                req.getUserId(),
                req.getProductId(),
                req.getQuantity());

        CartItemResponse response = new CartItemResponse(
                item.getId(),
                item.getQuantity(),
                item.getProduct().getUnit(),
                item.getProduct().getName(),
                item.getProduct().getUrl(),
                item.getProduct().getMrp(),
                item.getProduct().getDiscount(),
                item.getProduct().getId());

        return ResponseEntity.status(200).body(response);
    }

    @PutMapping("/cart/inc/{id}")
    public ResponseEntity<CartItemResponse> increment(@PathVariable Integer id) {
        CartItem item = cartItemsService.incrementQuantity(id);
        CartItemResponse response = new CartItemResponse(
                item.getId(),
                item.getQuantity(),
                item.getProduct().getUnit(),
                item.getProduct().getName(),
                item.getProduct().getUrl(),
                item.getProduct().getMrp(),
                item.getProduct().getDiscount(),
                item.getProduct().getId());

        return ResponseEntity.status(200).body(response);
    }

    @PutMapping("/cart/dec/{id}")
    public ResponseEntity<CartItem> decrement(@PathVariable Integer id) {
        return ResponseEntity.status(200).body(cartItemsService.decrementQuantity(id));
    }

    @DeleteMapping("/cart/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        cartItemsService.deleteCartItem(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cart/count/{userId}")
    public ResponseEntity<Integer> getCartCount(@PathVariable Integer userId) {
        int count = cartItemsService.getCartCount(userId);
        return ResponseEntity.status(200).body(count);
    }

    @PutMapping("/cart/addmore/{id}")
    public ResponseEntity<CartItem> addMoreQuantity(@PathVariable Integer id,
            @RequestBody Map<String, Integer> payload) {

        int quantityToAdd = payload.get("quantity");
        CartItem updatedItem = cartItemsService.addMoreQuantity(id, quantityToAdd);
        return ResponseEntity.status(200).body(updatedItem);
    }

    @PostMapping("/cart/merge/{userid}")
    public ResponseEntity<List<CartItemResponse>> mergeCart(
            @PathVariable Integer userid,
            @RequestBody List<CartItemRequest> guestItems) {

        for (CartItemRequest guestItem : guestItems) {
            cartItemsService.addOrUpdateFromMainPage(
                    userid,
                    guestItem.getProductId(),
                    guestItem.getQuantity());
        }

        List<CartItem> items = cartItemsService.getCartItemByUseridSorted(userid);

        List<CartItemResponse> response = items.stream()
                .map(item -> new CartItemResponse(
                        item.getId(),
                        item.getQuantity(),
                        item.getProduct().getUnit(),
                        item.getProduct().getName(),
                        item.getProduct().getUrl(),
                        item.getProduct().getMrp(),
                        item.getProduct().getDiscount(),
                        item.getProduct().getId()))
                .collect(Collectors.toList());

        return ResponseEntity.status(200).body(response);
    }
}
