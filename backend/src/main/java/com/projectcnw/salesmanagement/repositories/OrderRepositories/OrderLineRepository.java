package com.projectcnw.salesmanagement.repositories.OrderRepositories;

import com.projectcnw.salesmanagement.models.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderLineRepository extends JpaRepository<OrderLine, Integer> {

    List<OrderLine> findAllByOrderId(@Param("orderId") Integer orderId);
}
