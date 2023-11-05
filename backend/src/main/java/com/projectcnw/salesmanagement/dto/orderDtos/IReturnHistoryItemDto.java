package com.projectcnw.salesmanagement.dto.orderDtos;

import java.sql.Timestamp;

public interface IReturnHistoryItemDto {

    Integer getReturnOrderId();

    Timestamp getCreatedAt();

    Integer getReturnQuantity();

    Integer getReturnValue();

    Integer getSwapOrderId();

    Integer getSwapQuantity();

    Integer getSwapValue();
}
