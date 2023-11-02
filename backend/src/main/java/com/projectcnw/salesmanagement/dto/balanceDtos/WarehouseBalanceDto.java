package com.projectcnw.salesmanagement.dto.balanceDtos;

import com.projectcnw.salesmanagement.dto.BaseDto;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;


import java.util.List;
@Getter
@Setter
public class WarehouseBalanceDto extends BaseDto {
    private String personInCharge;
    @NotEmpty(message = "Danh sách sản phẩm không được trống")
    private List<BalanceVariantDto> balanceVariantList;
    private String note;
}
