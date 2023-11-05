package com.projectcnw.salesmanagement.dto.orderDtos.createOrder;

import com.projectcnw.salesmanagement.models.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateOrderDto {

    @Positive
    private Integer customerId;

    @NotNull
    private PaymentMethod paymentMethod;

    @NotEmpty
    @Valid
    List<OrderVariant> orderVariantList;

    @NotNull
    private Integer discount;
}
