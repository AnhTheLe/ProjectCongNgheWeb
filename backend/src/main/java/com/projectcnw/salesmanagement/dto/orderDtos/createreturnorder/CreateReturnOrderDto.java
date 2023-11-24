package com.projectcnw.salesmanagement.dto.orderDtos.createreturnorder;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateReturnOrderDto {

    @Valid
    @NotEmpty
    List<ReturnVariant> returnVariantList;

    @Valid
    List<SwapVariant> swapVariantList;
}

