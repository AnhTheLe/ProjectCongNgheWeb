package com.projectcnw.salesmanagement.converter;

import com.projectcnw.salesmanagement.dto.vendorDtos.ImportItemDTO;
import com.projectcnw.salesmanagement.models.ImportItem;
import org.springframework.stereotype.Component;

@Component
public class ImportItemConvert {

    public ImportItemDTO toDto(ImportItem entity){
        ImportItemDTO dto = new ImportItemDTO();
        if(entity.getId() != null){
            dto.setId(entity.getId());
        }
        dto.setId(entity.getId());
        dto.setQuantity(entity.getQuantity());
        dto.setImportPrice(entity.getImportPrice());
        dto.setDiscount(entity.getDiscount());
        return dto;
    }

    public ImportItem toEntity(ImportItemDTO dto){
        ImportItem entity = new ImportItem();
        entity.setId(dto.getId());
        entity.setQuantity(dto.getQuantity());
        entity.setImportPrice(dto.getImportPrice());
        entity.setDiscount(dto.getDiscount());
        return entity;
    }

    public ImportItem toEntity(ImportItemDTO dto, ImportItem entity){
        entity.setId(dto.getId());
        entity.setQuantity(dto.getQuantity());
        entity.setImportPrice(dto.getImportPrice());
        entity.setDiscount(dto.getDiscount());
        return entity;
    }
}
