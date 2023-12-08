package com.projectcnw.salesmanagement.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderLine extends BaseEntity {

    private int quantity;

    @Column(name = "return_quantity", columnDefinition = "integer default 0")
    private int returnQuantity;

    private int price;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "variant_id")
    private Variant variant;
}

