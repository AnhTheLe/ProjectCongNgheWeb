package com.projectcnw.salesmanagement.models;

import jakarta.persistence.Entity;
import lombok.Getter;

@Entity
@Getter
public class Shop extends BaseEntity {
    private String avatar;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String district;
    private String wards;
    private double vat;
    private String business;
}
