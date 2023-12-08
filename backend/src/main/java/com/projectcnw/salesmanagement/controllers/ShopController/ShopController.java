
package com.projectcnw.salesmanagement.controllers.ShopController;

import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.models.Shop;
import com.projectcnw.salesmanagement.services.ShopService.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/shop")
@RequiredArgsConstructor
public class ShopController {
    private final ShopService shopService;

    @GetMapping("")
    public ResponseEntity<ResponseObject> getInfoShop(@AuthenticationPrincipal UserDetails userDetails){
        Shop shop = shopService.getInfoShop(userDetails);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("success")
                .data(shop)
                .build());
    }

    @PostMapping("")
    public ResponseEntity<ResponseObject> updateShopInfo(@RequestBody Shop shop, @AuthenticationPrincipal UserDetails userDetails){
        Shop shopUpdated = shopService.updateShop(shop);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("success")
                .data(shopUpdated)
                .build());
    }
}
