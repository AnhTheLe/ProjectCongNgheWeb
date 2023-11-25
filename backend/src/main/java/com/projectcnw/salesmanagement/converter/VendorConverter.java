package com.projectcnw.salesmanagement.converter;

import com.projectcnw.salesmanagement.dto.vendorDtos.VendorDTO;
import com.projectcnw.salesmanagement.models.Vendor;
import org.springframework.stereotype.Component;

@Component
public class VendorConverter {
    public VendorDTO toDto(Vendor entity){
        VendorDTO dto = new VendorDTO();
        if(entity.getId() != null){
            dto.setId(entity.getId());
        }
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setAddress(entity.getAddress());
        dto.setFax(entity.getFax());
        dto.setTax(entity.getTax());
        dto.setDescription(entity.getDescription());
        dto.setWebsite(entity.getWebsite());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setShop(entity.getShop());
        return dto;
    }

    public Vendor toEntity(VendorDTO dto){
        Vendor entity = new Vendor();
        entity.setName(dto.getName());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setAddress(dto.getAddress());
        entity.setShop(dto.getShop());
        entity.setFax(dto.getFax());
        entity.setTax(dto.getTax());
        entity.setDescription(dto.getDescription());
        entity.setWebsite(dto.getWebsite());
        return entity;
    }

    public Vendor toEntity(VendorDTO dto, Vendor entity){
        entity.setName(dto.getName());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setAddress(dto.getAddress());
        entity.setShop(dto.getShop());
        entity.setFax(dto.getFax());
        entity.setTax(dto.getTax());
        entity.setDescription(dto.getDescription());
        entity.setWebsite(dto.getWebsite());
        return entity;
    }
}
