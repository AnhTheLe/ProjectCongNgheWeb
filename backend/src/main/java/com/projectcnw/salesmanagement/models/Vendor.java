package com.projectcnw.salesmanagement.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
@Table(name = "vendor")
public class Vendor extends BaseEntity {

    @Column(name = "name")
    private String name;

    @Column(name ="address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "fax")
    private String fax;

    @Column(name ="tax")
    private String tax;

    @Column(name = "website")
    private String website;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "vendor")
    private List<ImportOrder> importOrderList = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;
}
