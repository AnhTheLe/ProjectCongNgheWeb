package com.projectcnw.salesmanagement.repositories.VendorManagerRepository;

import com.projectcnw.salesmanagement.models.ImportItem;
import com.projectcnw.salesmanagement.models.keys.ImportItemKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImportItemRepository extends JpaRepository<ImportItem, ImportItemKey> {
    List<ImportItem> findById_ImportOrderId(int importOrderId);
}
