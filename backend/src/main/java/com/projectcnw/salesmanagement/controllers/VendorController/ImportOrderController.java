package com.projectcnw.salesmanagement.controllers.VendorController;

import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.vendorDtos.ImportOrderDTO;
import com.projectcnw.salesmanagement.dto.vendorDtos.PaymentDTO;
import com.projectcnw.salesmanagement.services.VendorService.IPaymentService;
import com.projectcnw.salesmanagement.services.VendorService.impl.ImportOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Time;
import java.util.Calendar;
import java.util.List;

@RestController
@RequestMapping("/admin/import")
public class ImportOrderController {
    private ImportOrderService importOrderService;
    private IPaymentService paymentService;
    ImportOrderController(ImportOrderService importOrderService,IPaymentService paymentService){
        this.importOrderService = importOrderService;
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getImportOrderList(){
        List<ImportOrderDTO> importOrderDTOList = importOrderService.findAll();
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(importOrderDTOList)
                .build());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ResponseObject> getImportOrderById(@PathVariable Integer id){
        ImportOrderDTO importOrderDTOList = importOrderService.findById(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(importOrderDTOList)
                .build());
    }

    @PostMapping
    public ResponseEntity<ResponseObject> createImportOrder(@RequestBody @Valid ImportOrderDTO importOrderDTO, @AuthenticationPrincipal UserDetails userDetails) {
        String phoneUser = userDetails.getUsername();
        ImportOrderDTO importOrderDTO1 = importOrderService.save(importOrderDTO, phoneUser);
        return ResponseEntity.ok(ResponseObject.builder()
                .data(importOrderDTO1)
                .message("success")
                .responseCode(200)
                .build());
    }

    @PutMapping(value= "/{id}")
    public ResponseEntity<ResponseObject> upadateImportOrder(@RequestBody @Valid ImportOrderDTO importOrderDTO, @PathVariable int id, @AuthenticationPrincipal UserDetails userDetails){
        String phoneUser = userDetails.getUsername();
        importOrderDTO.setId(id);
        ImportOrderDTO importOrderDTO1 = importOrderService.save(importOrderDTO, phoneUser);
        return ResponseEntity.ok(ResponseObject.builder()
                .data(importOrderDTO1)
                .message("success")
                .responseCode(200)
                .build());
    }
    @PostMapping(value= "/{id}/pay")
    public ResponseEntity<ResponseObject> createPay(@RequestBody @Valid int amount, @PathVariable int id, @AuthenticationPrincipal UserDetails userDetails)
    {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(amount);
        paymentDTO.setOrderId(id);
        PaymentDTO paymentDTO1 = paymentService.save(paymentDTO);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(paymentDTO1)
                .build());
    }
    @GetMapping(value= "/{id}/pay")
    public ResponseEntity<ResponseObject> getPayHistory(@PathVariable int id,@AuthenticationPrincipal UserDetails userDetails)
    {
        PaymentDTO paymentDTO = paymentService.findPaymentById(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(paymentDTO)
                .build());
    }
}
