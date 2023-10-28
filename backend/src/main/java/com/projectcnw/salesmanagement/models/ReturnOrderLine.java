package com.projectcnw.salesmanagement.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReturnOrderLine extends BaseEntity{

    @Column(name = "return_quantity")
    private int returnQuantity;

    @Column(name = "return_price")
    private int returnPrice;

    @Column(name = "original_price")
    private int originalPrice;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "return_id")
    private ReturnOrder returnOrder;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    private Variant variant;
}
