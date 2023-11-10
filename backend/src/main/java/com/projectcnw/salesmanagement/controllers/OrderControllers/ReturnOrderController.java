package com.projectcnw.salesmanagement.controllers.OrderControllers;


import com.projectcnw.salesmanagement.dto.PagedResponseObject;
import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.orderDtos.ReturnOrderDetailInfo;
import com.projectcnw.salesmanagement.dto.orderDtos.ReturnOrderItemDto;
import com.projectcnw.salesmanagement.services.OrderServices.ReturnOrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/return_orders")
@Validated
public class ReturnOrderController {

    @Autowired
    private ReturnOrderService returnOrderService;

    @GetMapping
    public ResponseEntity<PagedResponseObject> getReturnOrderList(@RequestParam(name = "page", defaultValue = "0") @Valid int page,
                                                                  @RequestParam(name = "size", defaultValue = "10") @Valid int size,
                                                                  @RequestParam(name = "search", defaultValue = "") String search) {
        long totalItems = returnOrderService.countTotalReturnOrders();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        List<ReturnOrderItemDto> orders = returnOrderService.getReturnOrderList(page, size, search);
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

    @GetMapping("{id}")
    public ResponseEntity<ResponseObject> getReturnOrderDetailInfo(@PathVariable int id) {
        ReturnOrderDetailInfo returnOrderDetailInfo = returnOrderService.getReturnOrderDetailInfo(id);
        return ResponseEntity.ok(ResponseObject.builder()
                        .data(returnOrderDetailInfo)
                        .message("success")
                        .responseCode(200)
                        .build());
    }


}
