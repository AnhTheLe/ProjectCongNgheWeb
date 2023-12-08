package com.projectcnw.salesmanagement.services.OrderServices;

import com.projectcnw.salesmanagement.dto.orderDtos.*;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderLineRepository orderLineRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private VariantRepository variantRepository;

    @Autowired
    private UserRepository userRepository;

    public long countTotalOrders() {
        return orderRepository.count();
    }

    public List<OrderLine> statisticalByTime(java.util.Date startDate, java.util.Date endDate) {
        List<OrderLine> result = new ArrayList<>();

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);

        while (!calendar.getTime().after(endDate)) {
            java.util.Date currentDate = calendar.getTime();
            calendar.add(Calendar.DAY_OF_MONTH, 1); // Tăng ngày lên 1 để lấy ngày tiếp theo
            java.util.Date nextDate = calendar.getTime();
            List<OrderLine> statisticalList = orderRepository.statisticalOrderByTime(currentDate, nextDate);
            result.addAll(statisticalList);
        }

        return result;
    }

    public List<OrderStatistical> statisticalListByTime(java.util.Date startDate, java.util.Date endDate) {
        List<OrderStatistical> result = new ArrayList<>();

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);

        while (!calendar.getTime().after(endDate)) {
            java.util.Date currentDate = calendar.getTime();
            calendar.add(Calendar.DAY_OF_MONTH, 1); // Tăng ngày lên 1 để lấy ngày tiếp theo
            java.util.Date nextDate = calendar.getTime();
            OrderStatistical statistical = orderRepository.statisticalByTime(currentDate, nextDate);
            result.add(statistical);
        }

        return result;
    }

    public List<TopOrder> topOrder(java.util.Date startDate, java.util.Date endDate, String type) {
        List<TopOrder> result = new ArrayList<>();
        List<Object[]> listVariant = orderRepository.topProductByRevenue(startDate, endDate);
        if ("revenue".equals(type)) {
            listVariant = orderRepository.topProductByRevenue(startDate, endDate);
            System.out.println("revenue");
        } else if ("quantity".equals(type)) {
            listVariant = orderRepository.topProductByQuantity(startDate, endDate);
            System.out.println("quantity");
        } else if ("order".equals(type)) {
            listVariant = orderRepository.topProductByOrder(startDate, endDate);
            System.out.println("order");
        }

        for (Object[] data : listVariant) {
            int variantId = (int) data[0];
            Variant variant = null;
            variant = variantRepository.findById((Integer) variantId)
                    .orElseThrow(() -> new NotFoundException("variant " + variantId + " not found"));
            BigDecimal value = BigDecimal.valueOf(((Number) data[1]).doubleValue());
            TopOrder topOrder = new TopOrder(variant, value);
            result.add(topOrder);
        }

        return result;
    }

    public List<TopCustomer> topCustomer(java.util.Date startDate, java.util.Date endDate, String type) {
        List<TopCustomer> result = new ArrayList<>();
        List<Object[]> listCustomer = orderRepository.topCustomerByRevenue(startDate, endDate);
        if ("revenue".equals(type)) {
            listCustomer = orderRepository.topCustomerByRevenue(startDate, endDate);
            System.out.println("revenue");
//        } else if("quantity".equals(type)) {
//            listVariant = orderRepository.topCustomerByQuantity(startDate, endDate);
//            System.out.println("quantity");
        } else if ("order".equals(type)) {
            listCustomer = orderRepository.topCustomerByOrder(startDate, endDate);
            System.out.println("order");
        }

        for (Object[] data : listCustomer) {
            int customerId = (int) data[0];
            Customer customer = null;
            customer = customerRepository.findById((Integer) customerId)
                    .orElseThrow(() -> new NotFoundException("customer " + customerId + " not found"));
            BigDecimal value = BigDecimal.valueOf(((Number) data[1]).doubleValue());
            TopCustomer topCustomer = new TopCustomer(customer, value);
            result.add(topCustomer);
        }

        return result;
    }


    public List<OrderListItemDto> getOrderList(int page, int size, String search) {
        ModelMapper modelMapper = new ModelMapper();
        Pageable paging = PageRequest.of(page, size);
        Page<IOrderListItemDto> orderListPage = orderRepository.getOrderList(search, paging);
        return Arrays.asList(modelMapper.map(orderListPage.getContent(), OrderListItemDto[].class));
    }

//    public List<OrderListByCustomer> getOrderListByCustomerId(int customerId) {
//        Customer existingCustomer = customerRepository.findById(customerId).orElse(null);
//
//        if (existingCustomer == null) {
//            // Khách hàng không tồn tại, bạn có thể ném một ngoại lệ hoặc trả về null
//            throw new BadRequestException("Khách hàng không tồn tại.");
//        }
//        List<Order> orderList = orderRepository.findAllOrderByCustomer(customerId);
//        List<OrderListByCustomer> orderListByCustomer = new ArrayList<>();
//
//        for (Order order : orderList) {
//            OrderListByCustomer orderDto = new OrderListByCustomer(order, paymentRepository.findPaymentByOrderId(order.getId()));
//            orderListByCustomer.add(orderDto);
//        }
//
//        return orderListByCustomer;
//    }

//    public List<OrderListByCustomer> getOrderListByCustomerId(int customerId) {
//        Customer existingCustomer = customerRepository.findById(customerId)
//                .orElseThrow(() -> new BadRequestException("Khách hàng không tồn tại."));
//
//        List<Order> orderList = orderRepository.findAllOrderByCustomer(customerId);
//
//        List<OrderListByCustomer> orderListByCustomer = orderList.stream()
//                .map(order -> new OrderListByCustomer(order, paymentRepository.findPaymentByOrder(order.getId())))
//                .collect(Collectors.toList());
//
//        return orderListByCustomer;
//    }

    public List<OrderListByCustomerDto> getOrderListByCustomerId(int customerId) {
        Customer existingCustomer = customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException("Khách hàng không tồn tại."));

        List<Order> orderList = orderRepository.findAllOrderByCustomer(customerId);

        List<OrderListByCustomerDto> orderListByCustomer = orderList.stream()
                .map(order -> {
                    Payment payment = paymentRepository.findPaymentByOrder(order.getId());
                    List<OrderLineDTO> orderLines = order.getOrderLineList().stream()
                            .map(orderLine -> new OrderLineDTO(orderLine.getQuantity(), orderLine.getReturnQuantity(), orderLine.getPrice(), orderLine.getVariant()))
                            .collect(Collectors.toList());
                    return new OrderListByCustomerDto(order.getId(), order.getUserEntity().getFullName(), order.getDiscount(), orderLines, paymentRepository.findPaymentByOrder(order.getId()));
                })
                .collect(Collectors.toList());

        return orderListByCustomer;
    }

    public OrderDetailInfo getOrderDetailInfo(int id) {
        Optional<Order> order = orderRepository.findById(id);
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

//        order.setOrderLineList(orderLineList);
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
}
