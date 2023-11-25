package com.projectcnw.salesmanagement.dto.orderDtos;

import com.projectcnw.salesmanagement.models.Variant;


import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter

public class TopOrder {
    private Variant variant;
    private BigDecimal value;

    public TopOrder(Variant variant, BigDecimal value) {
        this.variant = variant;
        this.value = value;
    }
}
