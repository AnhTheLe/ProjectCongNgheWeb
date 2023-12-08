package com.projectcnw.salesmanagement.repositories.OrderRepositories;

import com.projectcnw.salesmanagement.dto.orderDtos.IOrderDetailInfo;
import com.projectcnw.salesmanagement.dto.orderDtos.IOrderListItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.OrderStatistical;
import com.projectcnw.salesmanagement.models.Order;
import com.projectcnw.salesmanagement.models.OrderLine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query(value = "select o.id as orderId, o.created_at as createdAt, c.name as customerName, c.phone as phone," +
            " p.payment_status as paymentStatus, p.amount as amount" +
            " from _order o, customer c, payment p" +
            " where o.customer_id = c.id and p.order_id = o.id" +
            " and p.order_type = 'ORDER'" +
            " and (convert(o.id, char) like concat('%', lower(:search), '%')" +
            " or lower(c.name) like concat('%', lower(:search), '%')" +
            " or lower(c.phone) like concat('%', lower(:search), '%'))" +
            " order by o.created_at desc", nativeQuery = true)
    Page<IOrderListItemDto> getOrderList(@Param("search") String search, Pageable paging);

    @Query(value = "SELECT" +
            " o.id AS id," +
            " o.discount AS discount," +
            " c.name AS customerName," +
            " c.phone AS phone," +
            " c.id AS customerId," +
            " o.created_at AS createdAt," +
            " u.full_name AS staffName," +
            " p.payment_status AS paymentStatus," +
            " p.amount AS amount," +
            " r.id AS returnOrderId," +
            " r.amount AS returnAmount" +
            " FROM" +
            " _order o" +
            " JOIN" +
            " customer c ON o.customer_id = c.id" +
            " JOIN" +
            " user u ON o.person_in_charge = u.id" +
            " JOIN" +
            " payment p ON p.order_id = o.id AND p.order_type = 'ORDER'\n" +
            " LEFT JOIN (" +
            " SELECT" +
            " return_order.id AS id," +
            " swap_order," +
            " payment.amount AS amount" +
            " FROM" +
            " return_order" +
            " JOIN" +
            " payment ON return_order.id = payment.order_id AND payment.order_type = 'RETURN'" +
            ") AS r ON r.swap_order = o.id" +
            " WHERE" +
            " o.id = :orderId", nativeQuery = true)
    IOrderDetailInfo getOrderDetailInfo(@Param("orderId") Integer id);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId")
    List<Order> findAllOrderByCustomer(@Param("customerId") int customerId);

    @Query("SELECT o FROM OrderLine o WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate")
    List<OrderLine> statisticalOrderByTime(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT new com.projectcnw.salesmanagement.dto.orderDtos.OrderStatistical(sum(o.quantity), count(distinct o.order.id), sum(o.price * o.quantity), :startDate) FROM OrderLine o WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate")
    OrderStatistical statisticalByTime(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

//    @Query("SELECT o FROM OrderLine o WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate GROUP BY o.variant.id ORDER BY o.price DESC LIMIT 6")
//    List<OrderLine> topProductByRevenue(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

//    @Query("SELECT o FROM OrderLine o WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate GROUP BY o.variant.id ORDER BY SUM(o.price) DESC LIMIT 6")
//    List<OrderLine> topProductByRevenue(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT o.variant.id, SUM(o.price * o.quantity) AS totalRevenue " +
            "FROM OrderLine o " +
            "WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate " +
            "GROUP BY o.variant.id " +
            "ORDER BY totalRevenue DESC")
    List<Object[]> topProductByRevenue(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT o.variant.id, SUM(o.quantity) AS totalQuantity " +
            "FROM OrderLine o " +
            "WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate " +
            "GROUP BY o.variant.id " +
            "ORDER BY totalQuantity DESC")
    List<Object[]> topProductByQuantity(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT o.variant.id, COUNT (DISTINCT o.order.id) AS totalOrder " +
            "FROM OrderLine o " +
            "WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate " +
            "GROUP BY o.variant.id " +
            "ORDER BY totalOrder DESC")
    List<Object[]> topProductByOrder(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT c.id, SUM(p.amount) AS totalRevenue " +
            "FROM Customer c LEFT JOIN Order o ON c.id = o.customer.id LEFT JOIN Payment p ON o.id = p.orderId " +
            "WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate AND p.orderType = 'ORDER' AND c.phone != '-1' " +
            "GROUP BY c.id " +
            "ORDER BY totalRevenue DESC")
    List<Object[]> topCustomerByRevenue(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

//    @Query("SELECT c.id, SUM(p.amount) AS totalRevenue " +
//            "FROM Customer c LEFT JOIN Order o ON c.id = o.customer.id LEFT JOIN Payment p ON o.id = p.orderId " +
//            "WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate AND p.orderType = 'ORDER' AND c.phone != '-1' " +
//            "GROUP BY c.id " +
//            "ORDER BY totalRevenue DESC")
//    List<Object[]> topCustomerByQuantity(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT c.id, COUNT (c.id) AS totalRevenue " +
            "FROM Customer c LEFT JOIN Order o ON c.id = o.customer.id LEFT JOIN Payment p ON o.id = p.orderId " +
            "WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate AND p.orderType = 'ORDER' AND c.phone != '-1' " +
            "GROUP BY c.id " +
            "ORDER BY totalRevenue DESC")
    List<Object[]> topCustomerByOrder(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

//    @Query("SELECT new com.sapo.salemanagement.dto.orderdtos.OrderStatistical(sum(o.quantity), count(distinct o.order.id), sum(o.price)) FROM OrderLine o WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate")
//    List<OrderStatistical> statisticalListByTime(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

}
