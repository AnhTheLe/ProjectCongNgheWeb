package com.projectcnw.salesmanagement.dto.orderDtos;


import com.projectcnw.salesmanagement.models.enums.PaymentStatus;

import java.sql.Timestamp;

public interface IReturnOrderDetailInfo {

    String getCustomerName();

    Integer getCustomerId();

    Integer getBaseOrderId();

    Timestamp getCreatedAt();

    Integer getSwapOrderId();

    Integer getSwapAmount();

    String getStaffName();

    String getReturnReason();

    PaymentStatus getPaymentStatus();
}
