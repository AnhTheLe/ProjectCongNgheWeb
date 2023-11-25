package com.projectcnw.salesmanagement.models;

import com.projectcnw.salesmanagement.models.enums.ShipmentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "import_order")
public class ImportOrder extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @ManyToOne
    @JoinColumn(name = "person_in_charge")
    private UserEntity userEntity;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "shipment_status")
    private ShipmentStatus shipmentStatus;

    @OneToMany(mappedBy = "importOrder")
    private List<ImportItem> importItemList;
}
