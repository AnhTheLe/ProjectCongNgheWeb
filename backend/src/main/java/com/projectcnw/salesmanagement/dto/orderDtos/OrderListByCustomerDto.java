package com.projectcnw.salesmanagement.dto.orderDtos;

import com.projectcnw.salesmanagement.models.Payment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class OrderListByCustomerDto {
    private Integer orderId;
    private String staffFullName;
    private int discount;
    private List<OrderLineDTO> orderLines;
    private Payment payment;
}
