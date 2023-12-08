
package com.projectcnw.salesmanagement.services.ProductManagerServices;

import com.projectcnw.salesmanagement.dto.productDtos.IBaseProductDto;
import com.projectcnw.salesmanagement.dto.productDtos.ILastIdVariant;
import com.projectcnw.salesmanagement.dto.productDtos.IVariantDto;
import com.projectcnw.salesmanagement.dto.productDtos.VariantDto;
import com.projectcnw.salesmanagement.exceptions.ProductManagerExceptions.ProductException;
import com.projectcnw.salesmanagement.models.BaseProduct;
import com.projectcnw.salesmanagement.models.Variant;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.BaseProductRepository;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.VariantRepository;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VariantService {

    private final VariantRepository variantRepository;

    private final BaseProductRepository baseProductRepository;
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

    public VariantDto updateVariant(int baseId, VariantDto variantDto) {
        BaseProduct baseProduct = baseProductRepository.findById(baseId);
        if (baseProduct == null) throw new ProductException("Không tìm thấy sản phẩm");

        Variant variant = variantRepository.findById(variantDto.getId());
        if (variant == null) throw new ProductException("Không tìm thấy phiên bản");

        Variant variant1 = modelMapper.map(variantDto, Variant.class);
        variant1.setCreatedAt(variant.getCreatedAt());
        variant1.setBaseProduct(baseProduct);
        variant1.setQuantity(variant1.getQuantity());
        if (variant1.getSku() == null||variant1.getSku().equals("")) {
            int tmpSku = baseProduct.getId()+100000+variant.getId();
            String skuString = "SKU"+baseProduct.getId()+tmpSku;
            variant1.setSku(skuString);
        }
        if (variant1.getBarcode() == null||variant1.getBarcode().equals("")) {
            variant1.setBarcode(variant1.getSku());
        }
        if (baseProduct.getAttribute2() != null)
            if (variant1.getValue1() == null || variant1.getValue1().isBlank())
                throw new ProductException("Thuộc tính"+baseProduct.getAttribute1()+" không được trống");
        if (baseProduct.getAttribute2() != null && !baseProduct.getAttribute2().equals(""))
            if (variant1.getValue2() == null || variant1.getValue2().isBlank())
                throw new ProductException("Thuộc tính"+baseProduct.getAttribute2()+" không được trống");
        if (baseProduct.getAttribute3() != null && !baseProduct.getAttribute3().equals(""))
            if (variant1.getValue3() == null || variant1.getValue3().isBlank())
                throw new ProductException("Thuộc tính"+baseProduct.getAttribute3()+" không được trống");


        Variant variant2 = variantRepository.save(variant1);

        return modelMapper.map(variant2, VariantDto.class);
    }

    @Transactional
    public void deleteVariantById(int baseId, int variantId) {
        IBaseProductDto iBaseProductDto = baseProductRepository.findBaseProductById(baseId);
        if (iBaseProductDto == null) throw new ProductException("baseProduct is not found");

        if (iBaseProductDto.getVariantNumber() == 1) throw new ProductException("It is not possible to delete a single version of a product");
        Variant variant = variantRepository.findById(variantId);
        if (variant == null || variant.isDeleted()) throw new ProductException("variant is not found");

        variantRepository.deleteVariantById(variantId);
    }

    @Transactional
    public List<VariantDto> getAllVariantsByKeyword(String keyword) {
        List<IVariantDto> iVariantDtos = variantRepository.findAllVariantsByKeyword(keyword);
        return Arrays.asList(modelMapper.map(iVariantDtos, VariantDto[].class));
    }

}
