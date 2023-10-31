package com.projectcnw.salesmanagement.repositories.OrderRepositories;

import com.projectcnw.salesmanagement.dto.orderDtos.IOrderListItemDto;
import com.projectcnw.salesmanagement.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

}