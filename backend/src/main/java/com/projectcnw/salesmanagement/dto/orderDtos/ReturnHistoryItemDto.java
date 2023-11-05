package com.projectcnw.salesmanagement.dto.orderDtos;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class ReturnHistoryItemDto {

    private Integer returnOrderId;

    private Timestamp createdAt;

    private Integer returnQuantity;

    private Integer returnValue;

    private Integer swapOrderId;

    private Integer swapQuantity;

    private Integer swapValue;
}
