package com.projectcnw.salesmanagement.repositories.CustomerRepositories;

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


//    @Query(value = "SELECT o.customer_id, SUM(p.amount), COUNT(DISTINCT o.id) " +
//            "FROM _order o LEFT JOIN payment p ON o.id = p.order_id " +
//            "WHERE p.order_type = 'ORDER' " +
//            "GROUP BY o.customer_id " +
//            "ORDER BY o.customer_id DESC " +
//            "LIMIT :size OFFSET :offset", nativeQuery = true)
//    List<Object[]> findAllCustomerBySpending(@Param("size") int size, @Param("offset") int offset);

    @Query(value = "SELECT c.id, " +
            "(SELECT SUM(p.amount) FROM payment p WHERE p.order_id IN (SELECT o.id FROM _order o WHERE o.customer_id = c.id)) AS total_amount, " +
            "(SELECT COUNT(DISTINCT o.id) FROM _order o WHERE o.customer_id = c.id) AS order_count " +
            "FROM customer c " +
            "ORDER BY c.id DESC " +
            "LIMIT :size OFFSET :offset", nativeQuery = true)
    List<Object[]> findAllCustomerBySpending(@Param("size") int size, @Param("offset") int offset);

    Customer findByPhone(String phone);

    @Query("SELECT c FROM Customer c WHERE c.name LIKE %:searchTerm% OR c.phone LIKE %:searchTerm%")
    List<Customer> searchCustomersByNameOrPhone1(@Param("searchTerm") String searchTerm);


    @Query(value = "SELECT o.customer_id, SUM(p.amount), COUNT(DISTINCT o.id) " +
            "FROM customer c LEFT JOIN _order o ON c.id = o.customer_id " +
            "LEFT JOIN payment p ON o.id = p.order_id " +
            "WHERE p.order_type = 'ORDER' AND c.name LIKE %:searchTerm% OR c.phone LIKE %:searchTerm% " +
            "GROUP BY o.customer_id "
            ,nativeQuery = true)
    List<Object[]> searchCustomersByNameOrPhone(@Param("searchTerm") String searchTerm);


    @Query(value = "SELECT COUNT(*) FROM customer", nativeQuery = true)
    long count();


}
