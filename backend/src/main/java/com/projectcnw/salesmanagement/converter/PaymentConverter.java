package com.projectcnw.salesmanagement.converter;

import com.projectcnw.salesmanagement.dto.vendorDtos.PaymentDTO;
import com.projectcnw.salesmanagement.models.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentConverter {

    public PaymentDTO toDto(Payment entity){
        PaymentDTO dto = new PaymentDTO();
        if(entity.getId() != null){
            dto.setPayId(entity.getId());
        }
        dto.setOrderId(entity.getOrderId());
        dto.setAmount(entity.getAmount());
        dto.setPaymentMethod(entity.getPaymentMethod());
        dto.setOrderType(entity.getOrderType());
        dto.setPaymentStatus(entity.getPaymentStatus());
        dto.setPayDate(entity.getPayDate());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

    public Payment toEntity(PaymentDTO dto){
        Payment entity = new Payment();
        entity.setOrderId(dto.getOrderId());
        entity.setAmount(dto.getAmount());
        entity.setPaymentMethod(dto.getPaymentMethod());
        entity.setOrderType(dto.getOrderType());
        entity.setPaymentStatus(dto.getPaymentStatus());
        entity.setPayDate(dto.getPayDate());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        return entity;
    }

    public Payment toEntity(PaymentDTO dto, Payment entity){
        entity.setOrderId(dto.getOrderId());
        entity.setAmount(dto.getAmount());
        entity.setPaymentMethod(dto.getPaymentMethod());
        entity.setOrderType(dto.getOrderType());
        entity.setPaymentStatus(dto.getPaymentStatus());
        entity.setPayDate(dto.getPayDate());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        return entity;
    }
}
