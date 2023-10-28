package com.projectcnw.salesmanagement.models;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;

@Entity
@Getter
public class CustomerGroup extends BaseEntity {

    @Column(unique = true)
    private String name;

    private double discount;

    @OneToMany(mappedBy = "group")
    private List<Customer> customerList;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;
}
