package com.projectcnw.salesmanagement.services.OrderPaymentService;


import com.projectcnw.salesmanagement.dto.payment.MakePaymentDto;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.models.Payment;
import com.projectcnw.salesmanagement.models.enums.OrderType;
import com.projectcnw.salesmanagement.models.enums.PaymentStatus;
import com.projectcnw.salesmanagement.repositories.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderPaymentService {

    private final PaymentRepository paymentRepository;

    public void makeOrderPayment(MakePaymentDto makePaymentDto) {

        if (makePaymentDto.getReturnOrderId() != null) {
            Payment returnPayment = paymentRepository.findPaymentByOrderIdAndOrderType(
                    makePaymentDto.getReturnOrderId(),
                    OrderType.RETURN
            );

            if (returnPayment == null) {
                throw new NotFoundException("payment not found");
            }

            returnPayment.setPaymentMethod(makePaymentDto.getPaymentMethod());
            returnPayment.setPaymentStatus(PaymentStatus.COMPLETE);
            returnPayment.setCreatedAt(makePaymentDto.getCreatedAt());
            paymentRepository.save(returnPayment);
        }

        if (makePaymentDto.getSwapOrderId() != null) {
            Payment swapPayment = paymentRepository.findPaymentByOrderIdAndOrderType(
                    makePaymentDto.getSwapOrderId(),
                    OrderType.ORDER
            );

            if (swapPayment == null) {
                throw new NotFoundException("payment not found");
            }

            swapPayment.setPaymentMethod(makePaymentDto.getPaymentMethod());
            swapPayment.setPaymentStatus(PaymentStatus.COMPLETE);
            swapPayment.setCreatedAt(makePaymentDto.getCreatedAt());
            paymentRepository.save(swapPayment);
        }
    }
}
