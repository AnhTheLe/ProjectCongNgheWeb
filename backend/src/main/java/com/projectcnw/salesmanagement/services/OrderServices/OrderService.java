package com.projectcnw.salesmanagement.services.OrderServices;

import com.projectcnw.salesmanagement.dto.orderDtos.IOrderListItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.OrderListItemDto;
import com.projectcnw.salesmanagement.repositories.OrderRepositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public long countTotalOrders() {
        return orderRepository.count();
    }
    public List<OrderListItemDto> getOrderList(int page, int size, String search) {
        ModelMapper modelMapper = new ModelMapper();
        Pageable paging = PageRequest.of(page, size);
        Page<IOrderListItemDto> orderListPage = orderRepository.getOrderList(search, paging);
        return Arrays.asList(modelMapper.map(orderListPage.getContent(), OrderListItemDto[].class));
    }
}
