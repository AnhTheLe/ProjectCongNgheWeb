package com.projectcnw.salesmanagement.services.VendorService;

import com.projectcnw.salesmanagement.dto.vendorDtos.ImportOrderDTO;
import com.projectcnw.salesmanagement.models.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface IImportOrderService {
    ImportOrderDTO save(ImportOrderDTO importOrderDTO, String phone);
    List<ImportOrderDTO> findAll();
    List<ImportOrderDTO> findAll(Pageable pageable);
    ImportOrderDTO findById(Integer id);
    List<ImportOrderDTO> findByName(String name);
}
