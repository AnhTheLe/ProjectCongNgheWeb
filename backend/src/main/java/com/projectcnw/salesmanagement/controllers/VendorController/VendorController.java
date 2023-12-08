package com.projectcnw.salesmanagement.controllers.VendorController;

import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.vendorDtos.VendorDTO;
import com.projectcnw.salesmanagement.services.VendorService.IVendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/admin/vendor")
@RequiredArgsConstructor
public class VendorController {
    private final IVendorService vendorService;

    @GetMapping
    public ResponseEntity<ResponseObject> getVendorList(){
        List<VendorDTO> vendorDTOList = vendorService.findAll();
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(vendorDTOList)
                .build());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ResponseObject>getVendorById(@PathVariable Integer id){

        VendorDTO vendorDTO = vendorService.findById(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("success")
                .data(vendorDTO)
                .build());
    }

    @PostMapping
    public ResponseEntity<ResponseObject> createVendor(@RequestBody @Valid VendorDTO vendorDTO) throws Exception {
        VendorDTO vendorDTO1 = vendorService.save(vendorDTO);
        return ResponseEntity.ok(ResponseObject.builder()
                .data(vendorDTO1)
                .message("success")
                .responseCode(200)
                .build());
    }
}
