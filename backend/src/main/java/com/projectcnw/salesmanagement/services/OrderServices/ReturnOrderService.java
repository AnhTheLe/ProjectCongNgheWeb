package com.projectcnw.salesmanagement.services.OrderServices;

import com.projectcnw.salesmanagement.dto.orderDtos.IReturnOrderItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.ReturnHistoryItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.ReturnOrderDetailInfo;
import com.projectcnw.salesmanagement.dto.orderDtos.ReturnOrderItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.createreturnorder.CreateReturnOrderDto;
import com.projectcnw.salesmanagement.dto.orderDtos.createreturnorder.ReturnVariant;
import com.projectcnw.salesmanagement.dto.orderDtos.createreturnorder.SwapVariant;
import com.projectcnw.salesmanagement.exceptions.BadRequestException;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.models.*;
import com.projectcnw.salesmanagement.models.enums.OrderType;
import com.projectcnw.salesmanagement.models.enums.PaymentMethod;
import com.projectcnw.salesmanagement.models.enums.PaymentStatus;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.OrderLineRepository;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.OrderRepository;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.ReturnOrderLineRepository;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.ReturnOrderRepository;
import com.projectcnw.salesmanagement.repositories.PaymentRepository;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.VariantRepository;
import com.projectcnw.salesmanagement.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ReturnOrderService {
    private final ReturnOrderRepository returnOrderRepository;

    private final ReturnOrderLineRepository returnOrderLineRepository;

    private final OrderRepository orderRepository;

    private final OrderLineRepository orderLineRepository;

    private final VariantRepository variantRepository;

    private final PaymentRepository paymentRepository;

    private final UserRepository userRepository;

    public long countTotalReturnOrders() {
        return returnOrderRepository.count();
    }

    public List<ReturnOrderItemDto> getReturnOrderList(int page, int size, String search) {
        ModelMapper modelMapper = new ModelMapper();
        Pageable paging = PageRequest.of(page, size);
        Page<IReturnOrderItemDto> returnOrderListPage = returnOrderRepository.getReturnOrderList(search, paging);
        return Arrays.asList(modelMapper.map(returnOrderListPage.getContent(), ReturnOrderItemDto[].class));
    }

    public List<ReturnHistoryItemDto> getReturnHistories(int orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new NotFoundException("order not found");
        }
        ModelMapper modelMapper = new ModelMapper();
        return Arrays.asList(modelMapper.map(returnOrderRepository.getReturnHistories(orderId), ReturnHistoryItemDto[].class));
    }

    public ReturnOrderDetailInfo getReturnOrderDetailInfo(int returnId) {
        if (!returnOrderRepository.existsById(returnId)) {
            throw new NotFoundException("return order not found");
        }
        ModelMapper modelMapper = new ModelMapper();
        return modelMapper.map(returnOrderRepository.getReturnOrderDetailInfo(returnId), ReturnOrderDetailInfo.class);
    }

    public List<ReturnOrderLine> getAllReturnOrderLines(int id) {
        if (!returnOrderRepository.existsById(id)) {
            throw new NotFoundException("return order not found");
        }

        return returnOrderLineRepository.findAllByReturnOrderId(id);
    }

    @Transactional
    public ReturnOrder createReturnOrder(int orderId, CreateReturnOrderDto createReturnOrderDto, String staffPhone) {

        UserEntity user = userRepository.findByPhone(staffPhone).orElseThrow(() -> new NotFoundException("user's phone " + staffPhone + " not found"));
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new NotFoundException("order not found"));

        List<OrderLine> orderLineList = orderLineRepository.findAllByOrderId(orderId);
        List<ReturnVariant> returnVariantList = createReturnOrderDto.getReturnVariantList();
        List<SwapVariant> swapVariantList = createReturnOrderDto.getSwapVariantList();

        List<ReturnOrderLine> returnOrderLineList = new ArrayList<>();
        Map<Integer, Variant> updatedVariantsMap = new HashMap<>();

        ReturnOrder returnOrder = ReturnOrder.builder()
                .user(user)
                .baseOrder(order)
                .build();
        int returnAmount = 0;

        for (ReturnVariant returnVariant : returnVariantList) {
            boolean variantOrdered = false;

            for (OrderLine orderLine : orderLineList) {
                if (returnVariant.getVariantId() == orderLine.getVariant().getId()) {
                    if (returnVariant.getReturnQuantity() > orderLine.getQuantity() - orderLine.getReturnQuantity()) {
                        throw new BadRequestException("return quantity of variant " + returnVariant.getVariantId() +
                                " exceeds ordered quantity");
                    }

                    variantOrdered = true;
                    returnAmount += returnVariant.getReturnQuantity() * returnVariant.getReturnPrice();
                    orderLine.setReturnQuantity(orderLine.getReturnQuantity() + returnVariant.getReturnQuantity());
                    returnOrderLineList.add(ReturnOrderLine.builder()
                            .returnQuantity(returnVariant.getReturnQuantity())
                            .returnPrice(returnVariant.getReturnPrice())
                            .originalPrice(orderLine.getVariant().getRetailPrice())
                            .returnOrder(returnOrder)
                            .variant(orderLine.getVariant())
                            .build());

                    Variant variant = orderLine.getVariant();
                    variant.setQuantity(variant.getQuantity() + returnVariant.getReturnQuantity());
                    updatedVariantsMap.put(variant.getId(), variant);
                    break;
                }
            }

            if (!variantOrdered) {
                throw new BadRequestException("variant " + returnVariant.getVariantId() + " not ordered");
            }
        }

        returnOrder.setReturnOrderLineList(returnOrderLineList);

        if (swapVariantList != null && !swapVariantList.isEmpty()) {
            Order swapOrder = Order.builder()
                    .userEntity(user)
                    .customer(order.getCustomer())
                    .returnOrder(returnOrder)
                    .build();

            List<OrderLine> swapOrderLines = new ArrayList<>();
            int swapAmount = 0;
            int swapDiscount = 0;

            for (SwapVariant swapVariant : swapVariantList) {

                Variant variant;
                if (updatedVariantsMap.containsKey(swapVariant.getVariantId())) {
                    variant = updatedVariantsMap.get(swapVariant.getVariantId());
                } else {
                    variant = variantRepository.findById(swapVariant.getVariantId());
                    if (variant == null) {
                        throw new NotFoundException("swap variant " + swapVariant.getVariantId() + " not found in stock");
                    }
                }

                if (variant.getQuantity() < swapVariant.getSwapQuantity()) {
                    throw new BadRequestException("insufficient stock for swap variant " + swapVariant.getVariantId());
                }

                swapAmount += swapVariant.getSwapQuantity() * (swapVariant.getSwapPrice() - swapVariant.getDiscount());
                swapDiscount += swapVariant.getSwapQuantity() * swapVariant.getDiscount();
                // update variant's quantity
                variant.setQuantity(variant.getQuantity() - swapVariant.getSwapQuantity());
                updatedVariantsMap.put(variant.getId(), variant);

                // create new swapOrderLine
                OrderLine swapOrderLine = OrderLine.builder()
                        .quantity(swapVariant.getSwapQuantity())
                        .price(swapVariant.getSwapPrice())
                        .order(swapOrder)
                        .variant(variant)
                        .build();
                swapOrderLines.add(swapOrderLine);
            }

            returnOrder.setSwapOrder(swapOrder);
            swapOrder.setOrderLineList(swapOrderLines);
            swapOrder.setDiscount(swapDiscount);

            // save swap order
            Order savedSwapOrder = orderRepository.save(swapOrder);
            orderLineRepository.saveAll(swapOrderLines);

            // create payment
            Payment swapPayment = Payment.builder()
                    .paymentMethod(PaymentMethod.CASH)
                    .orderId(savedSwapOrder.getId())
                    .amount(swapAmount)
                    .orderType(OrderType.ORDER)
                    .paymentStatus(PaymentStatus.INIT)
                    .build();

            paymentRepository.save(swapPayment);
        }

        // update returnQuantity of order line
        orderLineRepository.saveAll(orderLineList);

        // save return order
        ReturnOrder savedReturnOrder = returnOrderRepository.save(returnOrder);
        returnOrderLineRepository.saveAll(returnOrderLineList);

        // create payment
        Payment returnPayment = Payment.builder()
                .paymentMethod(PaymentMethod.CASH)
                .amount(returnAmount)
                .orderId(savedReturnOrder.getId())
                .orderType(OrderType.RETURN)
                .paymentStatus(PaymentStatus.INIT)
                .build();
        paymentRepository.save(returnPayment);

        List<Variant> updatedVariants = new ArrayList<>(updatedVariantsMap.values());
        variantRepository.saveAll(updatedVariants);
        return savedReturnOrder;
    }


}
