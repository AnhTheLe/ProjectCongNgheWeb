package com.projectcnw.salesmanagement.models.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ReturnOrderLineKey {

    @Column(name = "return_id")
    private int returnId;

    @Column(name = "variant_id")
    private int variantId;
}
