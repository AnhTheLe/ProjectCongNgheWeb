package com.projectcnw.salesmanagement.controllers.OrderPaymentController;

import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.payment.MakePaymentDto;
import com.projectcnw.salesmanagement.services.OrderPaymentService.OrderPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/payment/orders")
@Validated
@RequiredArgsConstructor
public class OrderPaymentController {
    private final OrderPaymentService paymentService;

    @PostMapping
    public ResponseEntity<ResponseObject> makePayment(@RequestBody @Valid MakePaymentDto makePaymentDto) {
        paymentService.makeOrderPayment(makePaymentDto);
        return ResponseEntity.ok(ResponseObject.builder()
                .message("success")
                .responseCode(200)
                .build());
    }
}
