package com.projectcnw.salesmanagement.dto.productDtos;

import java.sql.Timestamp;

public interface IBaseProductDto {
    int getId();
    Timestamp getCreatedAt();
    Timestamp getUpdatedAt();
    String getName();
    String getLabel();
    int getVariantNumber();
    int getQuantity();
    String getAttribute1();
    String getAttribute2();
    String getAttribute3();

}
