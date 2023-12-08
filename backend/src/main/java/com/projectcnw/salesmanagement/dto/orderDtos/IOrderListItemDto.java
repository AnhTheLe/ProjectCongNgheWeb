package com.projectcnw.salesmanagement.dto.orderDtos;

import com.projectcnw.salesmanagement.models.enums.PaymentStatus;

import java.sql.Timestamp;

public interface IOrderListItemDto {

    int getOrderId();

    Timestamp getCreatedAt();

    String getCustomerName();

    String getPhone();

    PaymentStatus getPaymentStatus();

    int getAmount();
}
