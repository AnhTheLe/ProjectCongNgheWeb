package com.projectcnw.salesmanagement.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class BalanceVariant extends BaseEntity {

    private int realQuantity;

    private int savedQuantity;

    private String note;

    @ManyToOne
    @JoinColumn(name = "balance_id")
    private WarehouseBalance warehouseBalance;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    private Variant variant;
}
