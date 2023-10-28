package com.projectcnw.salesmanagement.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Feedback extends BaseEntity {

    private int evaluate;

    private String content;

    @ManyToOne
    @JoinColumn(name = "person_in_charge")
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
