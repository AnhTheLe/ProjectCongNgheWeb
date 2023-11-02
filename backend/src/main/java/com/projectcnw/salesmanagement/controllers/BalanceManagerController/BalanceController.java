package com.projectcnw.salesmanagement.controllers.BalanceManagerController;


import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.balanceDtos.WarehouseBalanceDto;
import com.projectcnw.salesmanagement.services.BalanceManagerServices.BalanceService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class BalanceController {
    @Autowired
    private BalanceService balanceService;


    @PostMapping("/balances")
    public ResponseEntity<ResponseObject> createBalance(@Valid @RequestBody WarehouseBalanceDto warehouseBalanceDto, @AuthenticationPrincipal UserDetails userDetails) {
        WarehouseBalanceDto warehouseBalanceDto1 = balanceService.createBalance(warehouseBalanceDto, userDetails);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(warehouseBalanceDto1)
                .build());
    }
}