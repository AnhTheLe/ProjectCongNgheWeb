package com.projectcnw.salesmanagement.repositories.OrderRepositories;


import com.projectcnw.salesmanagement.dto.orderDtos.IReturnHistoryItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.IReturnOrderDetailInfo;
import com.projectcnw.salesmanagement.dto.orderDtos.IReturnOrderItemDto;
import com.projectcnw.salesmanagement.models.ReturnOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnOrderRepository extends JpaRepository<ReturnOrder, Integer> {

    @Query(value = "select r.id as returnOrderId, r.base_order as baseOrderId, r.swap_order as swapOrderId," +
            " c.name as customerName, p.amount as amount, r.created_at as createdAt, " +
            " r.return_reason as returnReason, p.payment_status as paymentStatus" +
            " from _order o, customer c, payment p, return_order r" +
            " where o.customer_id = c.id and p.order_id = r.id" +
            " and r.base_order = o.id" +
            " and p.order_type = 'RETURN'" +
            " and (convert(o.id, char) like concat('%', lower(:search), '%')" +
            " or convert(r.id, char) like concat('%', lower(:search), '%')" +
            " or lower(c.name) like concat('%', lower(:search), '%')" +
            " or lower(c.phone) like concat('%', lower(:search), '%'))" +
            " order by r.created_at desc", nativeQuery = true)
    Page<IReturnOrderItemDto> getReturnOrderList(@Param("search") String search, Pageable paging);


    @Query(value = "select * from (select r.id as returnOrderId, return_quantity as returnQuantity," +
            " return_value as returnValue, r.created_at as createdAt, sw.id as swapOrderId," +
            " sw.swap_quantity as swapQuantity, sw.swap_value as swapValue" +
            " from (select sum(return_quantity) as return_quantity, sum(return_quantity * return_price) as return_value, return_id" +
            " from return_order_line ol" +
            " group by ol.return_id) ol_sum, return_order r" +
            " left join (select o.id, sum(quantity) as swap_quantity, sum(quantity * price) as swap_value" +
            " from order_line ol, _order o " +
            " where ol.order_id = o.id" +
            " group by ol.order_id) sw" +
            " on r.swap_order = sw.id" +
            " where r.id = ol_sum.return_id" +
            " and r.base_order = :orderId) osrs", nativeQuery = true)
    List<IReturnHistoryItemDto> getReturnHistories(@Param("orderId") Integer orderId);

    @Query(value = "SELECT" +
            " c.name AS customerName," +
            " c.id AS customerId," +
            " r.base_order AS baseOrderId," +
            " r.created_at AS createdAt," +
            " r.swap_order AS swapOrderId," +
            " u.full_name AS staffName," +
            " r.return_reason AS returnReason," +
            " p.amount AS swapAmount," +
            " p1.payment_status AS paymentStatus" +
            " FROM" +
            " return_order r" +
            " INNER JOIN" +
            " user u ON r.person_in_charge = u.id" +
            " INNER JOIN" +
            " _order o ON o.id = r.base_order" +
            " INNER JOIN" +
            " customer c ON o.customer_id = c.id" +
            " INNER JOIN" +
            " payment p1 ON p1.order_id = r.id AND p1.order_type = 'RETURN'" +
            " LEFT JOIN" +
            " payment p ON r.swap_order = p.order_id AND p.order_type = 'ORDER'" +
            " WHERE" +
            " r.id = :returnId", nativeQuery = true)
    IReturnOrderDetailInfo getReturnOrderDetailInfo(@Param("returnId") Integer returnId);
}
