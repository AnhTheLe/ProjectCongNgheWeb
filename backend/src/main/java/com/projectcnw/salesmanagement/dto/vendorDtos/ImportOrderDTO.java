package com.projectcnw.salesmanagement.dto.vendorDtos;

import com.projectcnw.salesmanagement.dto.BaseDto;
import com.projectcnw.salesmanagement.dto.productDtos.VariantDto;
import com.projectcnw.salesmanagement.models.UserEntity;
import com.projectcnw.salesmanagement.models.enums.ShipmentStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ImportOrderDTO extends BaseDto {


    @NotNull(message = "Vendor cannot be null")
    private VendorDTO vendor;
    @NotEmpty(message = "Variant list cannot be empty")
    private List<VariantDto> variantDTOList;
    private String staffName;
    private ShipmentStatus shipmentStatus;
    private PaymentDTO paymentDTO;
}
