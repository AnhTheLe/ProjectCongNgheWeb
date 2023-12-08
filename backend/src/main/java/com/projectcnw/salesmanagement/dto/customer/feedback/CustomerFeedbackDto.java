package com.projectcnw.salesmanagement.dto.customer.feedback;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CustomerFeedbackDto {

    private String customerName;
    private String customerCode;
    // Các trường khác cần thiết từ Customer
    private List<FeedbackDto> feedbackList;

    // Constructors, getters, setters
}
