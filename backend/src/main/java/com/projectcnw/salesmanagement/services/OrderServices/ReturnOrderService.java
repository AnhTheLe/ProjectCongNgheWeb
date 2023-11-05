package com.projectcnw.salesmanagement.services.OrderServices;

import com.projectcnw.salesmanagement.dto.orderDtos.IReturnOrderItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.ReturnHistoryItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.ReturnOrderItemDto;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.OrderLineRepository;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.OrderRepository;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.ReturnOrderLineRepository;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.ReturnOrderRepository;
import com.projectcnw.salesmanagement.repositories.PaymentRepository;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.VariantRepository;
import com.projectcnw.salesmanagement.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ReturnOrderService {

    @Autowired
    private ReturnOrderRepository returnOrderRepository;

    @Autowired
    private ReturnOrderLineRepository returnOrderLineRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderLineRepository orderLineRepository;

    @Autowired
    private VariantRepository variantRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

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



}
