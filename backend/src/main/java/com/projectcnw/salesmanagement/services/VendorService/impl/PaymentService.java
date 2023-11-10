package com.projectcnw.salesmanagement.services.VendorService.impl;

import com.projectcnw.salesmanagement.converter.PaymentConverter;
import com.projectcnw.salesmanagement.dto.vendorDtos.PaymentDTO;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.models.Payment;
import com.projectcnw.salesmanagement.models.enums.PaymentStatus;
import com.projectcnw.salesmanagement.repositories.PaymentRepository;
import com.projectcnw.salesmanagement.services.VendorService.IPaymentService;
import org.springframework.stereotype.Service;

import javax.crypto.spec.PSource;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService implements IPaymentService {

    PaymentRepository paymentRepository;
    PaymentConverter paymentConverter;
    PaymentService(PaymentRepository paymentRepository, PaymentConverter paymentConverter){
        this.paymentRepository = paymentRepository;
        this.paymentConverter = paymentConverter;
    }

    @Override
    public PaymentDTO save (PaymentDTO paymentDTO){
        if(paymentDTO.getPayId() != 0){
            Payment oldPayment =  paymentRepository.findById(paymentDTO.getPayId()).orElse(null);
            if(oldPayment == null){
                throw new NotFoundException("Oldpayment not found");
            }
            oldPayment.setPaymentStatus(PaymentStatus.COMPLETE);
            oldPayment.setPaymentMethod(paymentDTO.getPaymentMethod());
            oldPayment.setPayDate(new Date(System.currentTimeMillis()));
            paymentRepository.save(oldPayment);
            return paymentConverter.toDto(oldPayment);
        }
        return paymentDTO;
    }

    @Override
    public PaymentDTO findById_ImportOrderId(Integer id) {
        Payment payment = paymentRepository.findPaymentByOrderId(id);
        return null;
    }

    @Override
    public List<PaymentDTO> findAll(){
        List<PaymentDTO> results = new ArrayList<>();

        return results;
    }

}
