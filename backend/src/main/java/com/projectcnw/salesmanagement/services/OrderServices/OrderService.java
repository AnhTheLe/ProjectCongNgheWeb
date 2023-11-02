package com.projectcnw.salesmanagement.services.OrderServices;

import com.projectcnw.salesmanagement.dto.orderDtos.IOrderListItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.OrderDetailInfo;
import com.projectcnw.salesmanagement.dto.orderDtos.OrderListItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.createOrder.CreateOrderDto;
import com.projectcnw.salesmanagement.dto.orderDtos.createOrder.OrderVariant;
import com.projectcnw.salesmanagement.exceptions.BadRequestException;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.models.*;
import com.projectcnw.salesmanagement.models.enums.OrderType;
import com.projectcnw.salesmanagement.models.enums.PaymentStatus;
import com.projectcnw.salesmanagement.repositories.CustomerRepositories.CustomerRepository;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.OrderLineRepository;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.OrderRepository;
import com.projectcnw.salesmanagement.repositories.PaymentRepository;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.VariantRepository;
import com.projectcnw.salesmanagement.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final OrderLineRepository orderLineRepository;
    private final VariantRepository variantRepository;
    private final PaymentRepository paymentRepository;

    public long countTotalOrders() {
        return orderRepository.count();
    }
    public List<OrderListItemDto> getOrderList(int page, int size, String search) {
        ModelMapper modelMapper = new ModelMapper();
        Pageable paging = PageRequest.of(page, size);
        Page<IOrderListItemDto> orderListPage = orderRepository.getOrderList(search, paging);
        return Arrays.asList(modelMapper.map(orderListPage.getContent(), OrderListItemDto[].class));
    }

    @Transactional
    public void createOrder(CreateOrderDto createOrderDto, String staffPhone) {

        Customer customer;
        if (createOrderDto.getCustomerId() != null) {
            customer = customerRepository.findById(createOrderDto.getCustomerId()).orElseThrow(() -> new NotFoundException("customer " + createOrderDto.getCustomerId() + " not found"));
        } else {
            customer = customerRepository.findByPhone("-1");
        }

        UserEntity user = userRepository.findByPhone(staffPhone).orElseThrow(() -> new NotFoundException("user's phone " + staffPhone + " not found"));

        Order order = Order.builder()
                .discount(createOrderDto.getDiscount())
                .userEntity(user)
                .customer(customer)
                .build();

        List<OrderVariant> orderVariantList = createOrderDto.getOrderVariantList();
        List<OrderLine> orderLineList = new ArrayList<>();
        List<Variant> updatedVariantList = new ArrayList<>();
        int amount = 0;

        for (OrderVariant orderVariant : orderVariantList) {
            Variant variant = variantRepository.findById(orderVariant.getVariantId());
            if (variant == null) {
                throw new NotFoundException("variant " + orderVariant.getVariantId() + " not found");
            }

            if (variant.getQuantity() < orderVariant.getQuantity()) {
                throw new BadRequestException("insufficient stock for order variant " + orderVariant.getVariantId());
            }

            amount += orderVariant.getQuantity() * variant.getRetailPrice();
            variant.setQuantity(variant.getQuantity() - orderVariant.getQuantity());
            updatedVariantList.add(variant);
            orderLineList.add(OrderLine.builder()
                    .quantity(orderVariant.getQuantity())
                    .variant(variant)
                    .order(order)
                    .price(variant.getRetailPrice())
                    .build());
        }

        order.setOrderLineList(orderLineList);
        variantRepository.saveAll(updatedVariantList);
        Order savedOrder = orderRepository.save(order);
        orderLineRepository.saveAll(orderLineList);

        Payment payment = Payment.builder()
                .orderId(savedOrder.getId())
                .orderType(OrderType.ORDER)
                .amount(amount - createOrderDto.getDiscount())
                .paymentMethod(createOrderDto.getPaymentMethod())
                .payDate(new Date(new java.util.Date().getTime()))
                .paymentStatus(PaymentStatus.COMPLETE)
                .build();
        paymentRepository.save(payment);
    }

    public OrderDetailInfo getOrderDetailInfo(int id) {
        if (!orderRepository.existsById(id)) {
            throw new NotFoundException("order not found");
        }
        ModelMapper modelMapper = new ModelMapper();
        return modelMapper.map(orderRepository.getOrderDetailInfo(id), OrderDetailInfo.class);
    }

    public List<OrderLine> getAllOrderLines(int id) {
        if (!orderRepository.existsById(id)) {
            throw new NotFoundException("order not found");
        }

        return orderLineRepository.findAllByOrderId(id);
    }
}
