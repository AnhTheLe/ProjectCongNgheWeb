package com.projectcnw.salesmanagement.repositories.VendorManagerRepository;

import com.projectcnw.salesmanagement.models.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Integer> {
    Vendor findByName(String name);

    Vendor findVendorByAddress(String address);
    Vendor findVendorByPhone(String phone);
    Vendor findVendorByEmail(String email);
}
