package com.projectcnw.salesmanagement.controllers.OrderControllers;

import com.projectcnw.salesmanagement.dto.PagedResponseObject;
import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.orderDtos.OrderDetailInfo;
import com.projectcnw.salesmanagement.dto.orderDtos.OrderListItemDto;
import com.projectcnw.salesmanagement.dto.orderDtos.createOrder.CreateOrderDto;
import com.projectcnw.salesmanagement.services.OrderServices.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
@Validated
public class OrderController {


    private final OrderService orderService;


    @GetMapping
    public ResponseEntity<PagedResponseObject> getOrderList(@RequestParam(value = "page", defaultValue = "0") @Valid int page,
                                                            @RequestParam(value = "size", defaultValue = "10") @Valid int size,
                                                            @RequestParam(defaultValue = "") String search) {
        long totalItems = orderService.countTotalOrders();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        List<OrderListItemDto> orders = orderService.getOrderList(page, size, search);
        return ResponseEntity.ok(PagedResponseObject.builder()
                .page(page)
                .perPage(size)
                .totalItems(totalItems)
                .totalPages(totalPages)
                .data(orders)
                .message("Success")
                .responseCode(200)
                .build());
    }

    @PostMapping
    public ResponseEntity<ResponseObject> createOrder(@RequestBody @Valid CreateOrderDto createOrderDto, @AuthenticationPrincipal UserDetails userDetails) {
        String staffPhone = userDetails.getUsername();
        orderService.createOrder(createOrderDto, staffPhone);
        return ResponseEntity.ok(ResponseObject.builder()
                .message("success")
                .responseCode(200)
                .build());
    }

    @GetMapping("{id}")
    public ResponseEntity<ResponseObject> getOrderDetailInfo(@PathVariable @Valid int id) {
        OrderDetailInfo orderDetailInfo = orderService.getOrderDetailInfo(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .data(orderDetailInfo)
                .message("success")
                .responseCode(200)
                .build());
    }
}