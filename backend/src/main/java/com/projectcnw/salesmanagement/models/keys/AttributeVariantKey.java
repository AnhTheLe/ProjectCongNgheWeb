package com.projectcnw.salesmanagement.models.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class AttributeVariantKey implements Serializable {
    @Column(name = "attribute_id")
    private int attributeId;

    @Column(name = "variant_id")
    private int variantId;
}
