package com.projectcnw.salesmanagement.dto.productDtos;

import java.sql.Timestamp;

public interface IVariantDto {
    int getId();
    Timestamp getCreatedAt();
    Timestamp getUpdatedAt();

    String getName();
    int getQuantity();
    int getImportPrice();
    int getRetailPrice();
    int getWholeSalePrice();
    String getImage();
    String getSku();
    String getBarcode();
    int getBaseId();
    String getValue1();

    String getValue2();

    String getValue3();
}
