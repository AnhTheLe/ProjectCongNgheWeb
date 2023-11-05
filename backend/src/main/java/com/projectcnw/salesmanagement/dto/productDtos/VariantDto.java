package com.projectcnw.salesmanagement.dto.productDtos;


import com.projectcnw.salesmanagement.dto.BaseDto;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//public class VariantDto {
    public class VariantDto extends BaseDto {
//    private int id;
//    private Timestamp createdAt;
//    private Timestamp updatedAt;
    @NotBlank(message = "Tên phiên bản không được trống")
    private String name;
    @NotNull(message = "Số lượng không được trống")
    @Min(value = 0, message = "Số lượng phải lớn hơn 0")
    @Max(value = 9999, message = "Số lượng phải nhỏ hơn 9999")
    private int quantity;
    @NotNull(message = "Giá nhập không được trống")
    @Min(value = 0, message = "Giá nhập không được âm")
    private int importPrice;
    @NotNull(message = "Giá bán lẻ không được trống")
    @Min(value = 0, message = "Giá bán lẻ không được âm")
    private int retailPrice;
    @NotNull(message = "Giá bán buôn không được trống")
    @Min(value = 0, message = "Giá bán buôn không được âm")
    private int wholeSalePrice;
    private String image;

    private String sku;

    private String barcode;
    private int baseId;

    @NotNull(message = "Thuộc tính không được trống")
    @NotBlank(message = "Thuộc tính không được trống")
    private String value1;

    private String value2;

    private String value3;

    private int discount;
}
