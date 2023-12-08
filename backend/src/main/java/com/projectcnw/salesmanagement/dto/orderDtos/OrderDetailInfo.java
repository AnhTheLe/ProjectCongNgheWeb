package com.projectcnw.salesmanagement.dto.orderDtos;

import com.projectcnw.salesmanagement.models.enums.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class OrderDetailInfo {

    private Integer id;

    private String customerName;

    private String phone;

    private Integer customerId;

    private Timestamp createdAt;

    private String staffName;

    private PaymentStatus paymentStatus;

    private Integer amount;

    private Integer discount;

    private Integer returnOrderId;

    private Integer returnAmount;
}
