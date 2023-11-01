package com.projectcnw.salesmanagement.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Variant extends BaseEntity {

    private String name;

    @Column(columnDefinition = "integer default 0")
    private int quantity;

    @Column(name = "import_price", columnDefinition = "integer default 0")
    private int importPrice;

    @Column(name = "retail_price", columnDefinition = "integer default 0")
    private int retailPrice;

    @Column(name = "wholesale_price", columnDefinition = "integer default 0")
    private int wholeSalePrice;

    private String image;

    @Column(unique = true)
    private String sku;

    private String barcode;

    private String value1;

    private String value2;

    private String value3;

    @ManyToOne
    @JoinColumn(name = "base_id")
    @JsonIgnore
    private BaseProduct baseProduct;

    @Column(name = "is_deleted", columnDefinition = "boolean default false")
    private boolean isDeleted;
}
