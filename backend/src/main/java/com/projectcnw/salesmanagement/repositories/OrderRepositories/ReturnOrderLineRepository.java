package com.projectcnw.salesmanagement.repositories.OrderRepositories;

import com.projectcnw.salesmanagement.models.ReturnOrderLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReturnOrderLineRepository extends JpaRepository<ReturnOrderLine, Integer> {

    List<ReturnOrderLine> findAllByReturnOrderId(Integer orderId);
}
