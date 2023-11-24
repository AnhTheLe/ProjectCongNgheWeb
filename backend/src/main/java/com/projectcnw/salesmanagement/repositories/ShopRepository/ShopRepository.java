


package com.projectcnw.salesmanagement.repositories.ShopRepository;

import com.projectcnw.salesmanagement.models.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, Integer> {
    Shop findById(int id);
}
