package com.projectcnw.salesmanagement.dto.customer;

import com.projectcnw.salesmanagement.models.Customer;

import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter

public class CustomerSpendingDTO {
    @NotNull
    private Customer customer;
    @NotNull
    private BigDecimal totalAmount;
    @NotNull
    private BigDecimal orderCount;

    public CustomerSpendingDTO(Customer customer, BigDecimal totalAmount, BigDecimal orderCount) {
        this.customer = customer;
        this.totalAmount = totalAmount;
        this.orderCount = orderCount;
    }

}
