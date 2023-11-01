package com.projectcnw.salesmanagement.models.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class BalanceVariantKey implements Serializable {

    @Column(name = "warehouse_balance_id")
    private int balanceId;

    @Column(name = "variant_id")
    private int variantId;
}
