package com.projectcnw.salesmanagement.services.ProductManagerServices;


import com.projectcnw.salesmanagement.dto.productDtos.ILastIdVariant;
import com.projectcnw.salesmanagement.dto.productDtos.IVariantDto;
import com.projectcnw.salesmanagement.dto.productDtos.VariantDto;
import com.projectcnw.salesmanagement.exceptions.ProductManagerExceptions.ProductException;
import com.projectcnw.salesmanagement.models.BaseProduct;
import com.projectcnw.salesmanagement.models.Variant;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.BaseProductRepository;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.VariantRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class VariantService {
    @Autowired
    private VariantRepository variantRepository;
    @Autowired
    private BaseProductRepository baseProductRepository;
    private ModelMapper modelMapper = new ModelMapper();
    public List<VariantDto> getAllVariants(int page, int size) {
        int offset = (page -1)*size;
        List<IVariantDto> iVariantDtos = variantRepository.findAllVariant(size, offset);
        return Arrays.asList(modelMapper.map(iVariantDtos, VariantDto[].class));
    }
    public long countVariant() {
        return variantRepository.count();
    }



    public VariantDto createVariant(int baseId, VariantDto variantDto) {
        BaseProduct baseProduct = baseProductRepository.findById(baseId);
        if (baseProduct == null) throw new ProductException("baseProduct is not found");
        ILastIdVariant lastIdVariant = variantRepository.getLastSetId();

        Variant variant = modelMapper.map(variantDto, Variant.class);
        if (variant.getSku() == null||variant.getSku().equals("")) {
            int tmpSku = baseProduct.getId()+100000+lastIdVariant.getLastId()+1;
            String skuString = "SKU"+baseProduct.getId()+tmpSku;
            variant.setSku(skuString);
        }  else if(variant.getSku().startsWith("SKU")) {
            throw new ProductException("Mã SKU không được bắt đầu bằng \"SKU\"");
        }
        if (variant.getBarcode() == null||variant.getBarcode().equals("")) {
            variant.setBarcode(variant.getSku());
        }
        if (baseProduct.getAttribute1() != null && !baseProduct.getAttribute1().isBlank())
            if (variant.getValue1() == null || variant.getValue1().isBlank())
                throw new ProductException("Thuộc tính "+baseProduct.getAttribute1()+" không được để trống");
        if (baseProduct.getAttribute2() != null && !baseProduct.getAttribute2().isBlank())
            if (variant.getValue2() == null || variant.getValue2().isBlank())
                throw new ProductException("Thuộc tính "+baseProduct.getAttribute2()+" không được để trống");
        if (baseProduct.getAttribute3() != null && !baseProduct.getAttribute3().isBlank())
            if (variant.getValue3() == null || variant.getValue3().isBlank())
                throw new ProductException("Thuộc tính "+baseProduct.getAttribute3()+" không được để trống");
        variant.setBaseProduct(baseProduct);
        Variant variant1 = variantRepository.save(variant);


        return modelMapper.map(variant1, VariantDto.class);
    }


}
