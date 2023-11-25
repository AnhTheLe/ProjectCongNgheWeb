package com.projectcnw.salesmanagement.services.ShopService;


import com.projectcnw.salesmanagement.models.Shop;
import com.projectcnw.salesmanagement.repositories.ShopRepository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;
    public Shop updateShop(Shop shop) {
        if (shop.getId() != null) {
            int id = shop.getId();
            Shop shop1 = shopRepository.findById(id);
            shop.setId(shop1.getId());
        }

        return shopRepository.save(shop);
    }

    public Shop getInfoShop(UserDetails userDetails) {
        //lấy ra shopId dựa vào userdetails
        return shopRepository.findById(1);
    }
}
