package com.projectcnw.salesmanagement.services.VendorService;

import com.projectcnw.salesmanagement.dto.vendorDtos.PaymentDTO;

import java.util.List;

public interface IPaymentService {
    PaymentDTO save (PaymentDTO paymentDTO);
    PaymentDTO findById_ImportOrderId(Integer id);

    List<PaymentDTO> findAll();
}
