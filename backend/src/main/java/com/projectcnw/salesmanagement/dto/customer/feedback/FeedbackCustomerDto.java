package com.projectcnw.salesmanagement.dto.customer.feedback;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackCustomerDto {

    private UUID id;
    private int evaluate;
    private String content;
    private Integer customerId;
    private String customerName;
    private String customerCode;
    private String userFullName;
    private Timestamp responseAt;
    private String customerPhone;
    // Các trường khác cần thiết từ Customer

    // Constructors, getters, setters
}
