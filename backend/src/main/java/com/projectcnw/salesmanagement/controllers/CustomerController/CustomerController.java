package com.projectcnw.salesmanagement.controllers.CustomerController;

import com.projectcnw.salesmanagement.controllers.BaseController;
import com.projectcnw.salesmanagement.dto.PagedResponseObject;

import com.projectcnw.salesmanagement.models.Customer;

import com.projectcnw.salesmanagement.services.CustomerServices.CustomerServices;
import com.projectcnw.salesmanagement.services.CustomerServices.FeedbackService;
import com.projectcnw.salesmanagement.services.OrderServices.OrderService;
import com.projectcnw.salesmanagement.services.SMSService;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class CustomerController extends BaseController {
    private final CustomerServices customerServices;
    private final FeedbackService feedbackService;
    private final OrderService orderService;
    private final SMSService smsService;

    public CustomerController(CustomerServices customerServices, FeedbackService feedbackService, OrderService orderService, SMSService smsService) {
        this.customerServices = customerServices;
        this.feedbackService = feedbackService;
        this.orderService = orderService;
        this.smsService = smsService;
    }

    //lấy danh sách khách hàng
    @GetMapping("/customer")
    public ResponseEntity<PagedResponseObject> getAllCustomer(@RequestParam(value = "page", defaultValue = "1") int page,
                                                                 @RequestParam(value = "size", defaultValue = "10") int size) {

        long totalItems = customerServices.countCustomer();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        List<Customer> customers = customerServices.getAllCustomer(page, size);
        return ResponseEntity.ok(PagedResponseObject.builder()
                        .page(page)
                        .perPage(size)
                        .totalItems(totalItems)
                        .totalPages(totalPages)
                        .responseCode(200)
                        .message("Success")
                        .data(customers)
                        .build());
    }



}
