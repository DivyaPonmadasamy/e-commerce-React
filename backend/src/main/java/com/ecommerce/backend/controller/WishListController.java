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
import com.ecommerce.backend.service.WishListService;

@RestController
@RequestMapping("/wishlist")
public class WishListController {
    @Autowired
    private WishListService wishService;

    @PostMapping("/add")
    public ResponseEntity<WishList> addToWishList(@RequestBody Map<String, Integer> payload) {
        Integer userid = payload.get("userid");
        Integer productid = payload.get("productid");

        return ResponseEntity.status(200).body(wishService.addToWishList(userid, productid));
    }

    @GetMapping("/get/{userid}")
    public ResponseEntity<List<WishListResponse>> getWishList(@PathVariable Integer userid) {
        List<WishList> items = wishService.getWishListByUseridSorted(userid);
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

    @DeleteMapping("/remove/{wishlistid}")
    public ResponseEntity<Void> removeFromWishList(@PathVariable Integer wishlistid) {
        wishService.removeFromWishList(wishlistid);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/merge/{userid}")
    public ResponseEntity<List<WishListResponse>> mergeWishList(
            @PathVariable Integer userid,
            @RequestBody List<Integer> guestProductids) {

        List<WishList> items = wishService.mergeGuestWishList(userid, guestProductids);
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
