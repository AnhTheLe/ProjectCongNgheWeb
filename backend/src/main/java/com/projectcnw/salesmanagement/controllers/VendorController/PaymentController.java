package com.projectcnw.salesmanagement.controllers.VendorController;

import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.vendorDtos.ImportOrderDTO;
import com.projectcnw.salesmanagement.dto.vendorDtos.PaymentDTO;
import com.projectcnw.salesmanagement.services.VendorService.impl.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/admin/payment")
public class PaymentController {

    private PaymentService paymentService;

    PaymentController(PaymentService paymentService){
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<ResponseObject> updatePayment(@RequestBody @Valid PaymentDTO paymentDTO) {
        PaymentDTO paymentDTO1 = paymentService.save(paymentDTO);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(paymentDTO1)
                .build());
    }

}
