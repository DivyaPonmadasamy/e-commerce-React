package com.ecommerce.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.model.WishList;
import com.ecommerce.backend.model.WishListResponse;
import com.ecommerce.backend.services.WishListService;

@RestController
@RequestMapping("/wishlist")
public class WishListController {
    @Autowired
    private WishListService wishService;

    // @PostMapping("add/{userid}/{productid}")
    // public ResponseEntity<WishList> addToWishlist(@PathVariable Integer userid,
    // @PathVariable Integer productid) {
    // return ResponseEntity.status(200).body(wishService.addToWishlist(userid,
    // productid));
    // }

    @PostMapping("/add")
    public ResponseEntity<WishList> addToWishlist(@RequestBody Map<String, Integer> payload) {
        Integer userid = payload.get("userid");
        Integer productid = payload.get("productid");

        return ResponseEntity.status(200).body(wishService.addToWishlist(userid, productid));
    }

    @GetMapping("/get/{userid}")
    public ResponseEntity<List<WishListResponse>> getWishlist(@PathVariable Integer userid) {
        List<WishList> items = wishService.getWishListByUseridSorted(userid);
        List<WishListResponse> response = items.stream().map(item -> new WishListResponse(
                item.getId(),
                item.getProduct().getName(),
                item.getProduct().getUrl(),
                item.getProduct().getMrp(),
                item.getProduct().getDiscount(),
                item.getProduct().getId())).collect(Collectors.toList());
        return ResponseEntity.status(200).body(response);
    }

    @DeleteMapping("/remove/{wishlistid}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Integer wishlistid) {
        wishService.removeFromWishlist(wishlistid);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/merge/{userid}")
    public ResponseEntity<List<WishListResponse>> mergeWishlist(
            @PathVariable Integer userid,
            @RequestBody List<Integer> guestProductids) {

        List<WishList> items = wishService.mergeGuestWishlist(userid, guestProductids);

        List<WishListResponse> response = items.stream()
                .map(item -> new WishListResponse(
                        item.getId(),
                        item.getProduct().getName(),
                        item.getProduct().getUrl(),
                        item.getProduct().getMrp(),
                        item.getProduct().getDiscount(),
                        item.getProduct().getId()))
                .collect(Collectors.toList());

        return ResponseEntity.status(200).body(response);
    }

}
