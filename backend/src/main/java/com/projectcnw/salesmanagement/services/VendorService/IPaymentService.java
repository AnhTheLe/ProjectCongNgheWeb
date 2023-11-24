package com.projectcnw.salesmanagement.services.VendorService;

import com.projectcnw.salesmanagement.dto.vendorDtos.PaymentDTO;

import java.util.List;

public interface IPaymentService {
    PaymentDTO save (PaymentDTO paymentDTO);
    PaymentDTO findPaymentById(Integer id);

    List<PaymentDTO> findAll();
}
