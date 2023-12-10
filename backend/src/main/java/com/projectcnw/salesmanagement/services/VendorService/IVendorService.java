package com.projectcnw.salesmanagement.services.VendorService;

import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.vendorDtos.VendorDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IVendorService {
    ResponseEntity<ResponseObject> save(VendorDTO vendorDTO) throws Exception;
    List<VendorDTO> findAll();
    List<VendorDTO> findAll(Pageable pageable);
    VendorDTO findById(Integer id);
    VendorDTO findByName(String name);
}
