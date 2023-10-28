package com.projectcnw.salesmanagement.models.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable

public class ImportItemKey implements Serializable {

    @Column(name = "import_id")
    private int importOrderId;

    @Column(name = "variant_id")
    private int variantId;

}
