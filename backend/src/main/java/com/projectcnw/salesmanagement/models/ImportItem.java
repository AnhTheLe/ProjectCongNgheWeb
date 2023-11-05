package com.projectcnw.salesmanagement.models;

import com.projectcnw.salesmanagement.models.keys.ImportItemKey;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "import_item")
public class ImportItem {

    @EmbeddedId
    private ImportItemKey id;

    private int quantity;

    private int discount;

    @Column(name = "import_price")
    private int importPrice;

    @ManyToOne
    @MapsId("variantId")
    @JoinColumn(name = "variant_id")
    private Variant variant;

    @ManyToOne
    @MapsId("importOrderId")
    @JoinColumn(name = "import_id")
    private ImportOrder importOrder;
}
