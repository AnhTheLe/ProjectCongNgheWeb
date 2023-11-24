package com.projectcnw.salesmanagement.dto.orderDtos.createreturnorder;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReturnVariant {

    @Positive
    @NotNull
    private int variantId;

    @Positive
    @NotNull
    private int returnQuantity;

    @PositiveOrZero
    @NotNull
    private int returnPrice;
}
