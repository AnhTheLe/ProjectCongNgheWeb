package com.projectcnw.salesmanagement.repositories.VendorManagerRepository;

import com.projectcnw.salesmanagement.models.ImportOrder;
import com.projectcnw.salesmanagement.models.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImportOrderRepository extends JpaRepository<ImportOrder, Integer> {
    @Query("SELECT import FROM ImportOrder import WHERE import.vendor.name = :vendorName")
    List<ImportOrder> findByVendorName(String vendorName);
    List<ImportOrder> findImportOrderByVendor(Vendor vendor);
}
