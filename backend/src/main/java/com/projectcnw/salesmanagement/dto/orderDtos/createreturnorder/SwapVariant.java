package com.projectcnw.salesmanagement.dto.orderDtos.createreturnorder;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SwapVariant {

    @Positive
    @NotNull
    private int variantId;

    @Positive
    @NotNull
    private int swapQuantity;

    @PositiveOrZero
    @NotNull
    private int swapPrice;

    @PositiveOrZero
    @NotNull
    private int discount;
}
