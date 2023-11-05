package com.projectcnw.salesmanagement.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class WarehouseBalance extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "person_in_charge")
    private UserEntity userEntity;

    @OneToMany(mappedBy = "warehouseBalance")
    private List<BalanceVariant> balanceVariantList;
    @Column(name = "is_deleted", columnDefinition = "boolean default false")
    private boolean isDeleted;
    private String note;
}
