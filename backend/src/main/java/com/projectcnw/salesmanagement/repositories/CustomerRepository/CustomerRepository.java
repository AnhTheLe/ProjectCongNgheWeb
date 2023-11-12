package com.projectcnw.salesmanagement.repositories.CustomerRepository;


import com.projectcnw.salesmanagement.models.Customer;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    //Lấy ra danh sách tất cả khách hàng
    @Query(value = "SELECT *\n" +
            "FROM customer c ORDER BY c.id DESC LIMIT :size OFFSET :offset"
            , nativeQuery = true)
    List<Customer> findAllCustomer(@Param("size") int size, @Param("offset") int offset);



    @Query(value = "SELECT COUNT(*) FROM customer", nativeQuery = true)
    long count();


}
