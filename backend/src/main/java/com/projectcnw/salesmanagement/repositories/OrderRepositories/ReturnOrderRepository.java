package com.projectcnw.salesmanagement.repositories.OrderRepositories;


import com.projectcnw.salesmanagement.dto.orderDtos.IReturnHistoryItemDto;
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
}
