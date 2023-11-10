package com.projectcnw.salesmanagement.controllers.StaffController;

import com.projectcnw.salesmanagement.dto.PagedResponseObject;

import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.staff.CreateStaffDto;
import com.projectcnw.salesmanagement.dto.staff.StaffItemDto;
import com.projectcnw.salesmanagement.services.StaffService.StaffService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.projectcnw.salesmanagement.models.UserEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/staffs")
@Validated
public class StaffController {

    @Autowired
    private StaffService staffService;

    @GetMapping
    public ResponseEntity<PagedResponseObject> getAllStaffs(@RequestParam(value = "page", defaultValue = "0") @Valid int page,
                                                            @RequestParam(value = "size", defaultValue = "10") @Valid int size,
                                                            @RequestParam(defaultValue = "") String search) {
        long totalItems = staffService.countTotalStaffs();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        List<StaffItemDto> staffs = staffService.getAllStaffs(page, size, search);
        return ResponseEntity.ok(PagedResponseObject.builder()
                .page(page)
                .perPage(size)
                .totalItems(totalItems)
                .totalPages(totalPages)
                .data(staffs)
                .message("Success")
                .responseCode(200)
                .build());
    }

    @GetMapping("{id}")
    public ResponseEntity<ResponseObject> getStaffDetail(@PathVariable Integer id) {
        UserEntity user = staffService.getStaffDetailByID(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .data(user)
                .message("success")
                .responseCode(200)
                .build());
    }

    @PostMapping
    public ResponseEntity<ResponseObject> createStaff(@RequestBody @Valid CreateStaffDto createStaffDto) {
        staffService.createStaff(createStaffDto);
        return ResponseEntity.ok(ResponseObject.builder()
                .message("success")
                .responseCode(200)
                .build());
    }



}
