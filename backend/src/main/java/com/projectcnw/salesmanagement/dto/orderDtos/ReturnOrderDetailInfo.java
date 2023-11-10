package com.projectcnw.salesmanagement.dto.orderDtos;

import com.projectcnw.salesmanagement.models.enums.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class ReturnOrderDetailInfo {

    private String customerName;

    private Integer customerId;

    private Integer baseOrderId;

    private Timestamp createdAt;

    private Integer swapOrderId;

    private Integer swapAmount;

    private String staffName;

    private String returnReason;

    private PaymentStatus paymentStatus;
}
