package com.projectcnw.salesmanagement.dto.orderDtos;


import com.projectcnw.salesmanagement.models.Customer;
import com.projectcnw.salesmanagement.models.ReturnOrder;
import com.projectcnw.salesmanagement.models.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {
    private Integer orderId;
    private Customer customer;
    private UserEntity userEntity;
    private int discount;
    private List<OrderLineDTO> orderLines;
    private ReturnOrder returnOrder;
}
