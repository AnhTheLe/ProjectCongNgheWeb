package com.projectcnw.salesmanagement.models.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class OrderLineKey implements Serializable {

    @Column(name = "order_id")
    private int orderId;

    @Column(name = "variant_id")
    private int variantId;
}
