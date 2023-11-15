package com.projectcnw.salesmanagement.dto.payment;

import com.projectcnw.salesmanagement.models.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class MakePaymentDto {

    @NotNull
    private PaymentMethod paymentMethod;

    @NotNull
    private Timestamp createdAt;

    private Integer returnOrderId;

    private Integer swapOrderId;
}
