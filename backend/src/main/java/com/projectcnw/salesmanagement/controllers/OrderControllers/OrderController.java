package com.projectcnw.salesmanagement.controllers.OrderControllers;

import com.projectcnw.salesmanagement.dto.PagedResponseObject;
import com.projectcnw.salesmanagement.dto.orderDtos.OrderListItemDto;
import com.projectcnw.salesmanagement.services.OrderServices.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}