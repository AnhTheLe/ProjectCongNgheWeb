package com.projectcnw.salesmanagement.services.ProductManagerServices;

import com.projectcnw.salesmanagement.dto.productDtos.*;
import com.projectcnw.salesmanagement.exceptions.ProductManagerExceptions.ProductException;
import com.projectcnw.salesmanagement.models.BaseProduct;
import com.projectcnw.salesmanagement.models.Variant;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.BaseProductRepository;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.VariantRepository;
import com.projectcnw.salesmanagement.services.BaseService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class BaseProductService extends BaseService {
    @Autowired
    private BaseProductRepository baseProductRepository;
    @Autowired
    private VariantRepository variantRepository;

    private ModelMapper modelMapper = new ModelMapper();


    public long countBaseProduct() {
        return baseProductRepository.count();
    }
    public List<BaseProductDto> getAll(int page, int size) {
        int offset = (page -1)*size;
        List<IBaseProductDto> iBaseProductDtos = baseProductRepository.findAllBaseProduct(size, offset);
        List<BaseProductDto> baseProducts = Arrays.asList(modelMapper.map(iBaseProductDtos, BaseProductDto[].class));
        return baseProducts;
//        return new PageImpl<>(baseProducts, pageable, baseProducts.size());
    }
    public List<VariantDto> getAllVariantOfBaseProductByBaseId(int baseId) {
        List<IVariantDto> iVariantDtos = baseProductRepository.findAllVariantByBaseProductId(baseId);
        return Arrays.asList(modelMapper.map(iVariantDtos, VariantDto[].class));
    }
    @Transactional
    public BaseProductDto getBaseProductById(int baseId) {
        IBaseProductDto iBaseProductDto = baseProductRepository.findBaseProductById(baseId);
        if (iBaseProductDto == null) throw new ProductException("Không tìm thấy sản phẩm");

        BaseProductDto baseProductDto = modelMapper.map(iBaseProductDto, BaseProductDto.class);
        baseProductDto.setVariants(this.getAllVariantOfBaseProductByBaseId(baseId));
        return baseProductDto;
    }

    @Transactional
    public BaseProductDto createBaseProduct(BaseProductDto baseProductDto) {
        BaseProduct baseProduct = modelMapper.map(baseProductDto, BaseProduct.class);
        if (baseProductDto.getAttribute1() != null
                && baseProductDto.getAttribute2() != null
                && !baseProductDto.getAttribute2().equals("")
                && baseProductDto.getAttribute1().equals(baseProductDto.getAttribute2())
        ) throw new ProductException("Thuộc tính "+baseProduct.getAttribute1()+ " đã tồn tại");
        if (baseProductDto.getAttribute2() != null
                && baseProductDto.getAttribute3() != null
                && !baseProductDto.getAttribute2().equals("")
                && baseProductDto.getAttribute2().equals(baseProductDto.getAttribute3())
        ) throw new ProductException("Thuộc tính "+baseProduct.getAttribute2()+ " đã tồn tại");

        BaseProduct baseProduct1 = baseProductRepository.save(baseProduct);


//      kiểm tra xem có attribute2, attribute3 không
        boolean isSetAttribute2 = false;
        boolean isSetAttribute3 = false;
        if (baseProduct1.getAttribute2() != null && !baseProduct1.getAttribute2().isBlank()) isSetAttribute2 = true;
        if (baseProduct1.getAttribute3() != null && !baseProduct1.getAttribute3().isBlank()) isSetAttribute3 = true;

        List<Variant> variantList = Arrays.asList(modelMapper.map(baseProductDto.getVariants(), Variant[].class));
        int i = 1;
        ILastIdVariant lastIdVariant = variantRepository.getLastSetId();
        int lastId = 0;
        if (lastIdVariant != null) lastId = lastIdVariant.getLastId();
        for (Variant variant : variantList) {
            variant.setBaseProduct(baseProduct1);
            if (variant.getSku() == null||variant.getSku().equals("")) {
                int tmpSku = baseProduct1.getId()+100000+lastId+i;
                String skuString = "SKU"+baseProduct1.getId()+tmpSku;
                variant.setSku(skuString);
            } else if(variant.getSku().startsWith("SKU")) {
                throw new ProductException("Mã SKU không được bắt đầu bằng \"SKU\"");
            }
            if (variant.getBarcode() == null||variant.getBarcode().equals("")) {
                variant.setBarcode(variant.getSku());
            }
            i++;
            if (variant.getValue1() == null || variant.getValue1().isBlank())
                throw new ProductException("Thuộc tính không được để trống");
            if (isSetAttribute2)
                if (variant.getValue2() == null ||variant.getValue2().isBlank()) throw new ProductException("Thuộc tính không được để trống");
            if (isSetAttribute3)
                if (variant.getValue3() == null ||variant.getValue3().isBlank()) throw new ProductException("Thuộc tính không được để trống");
        }
        variantRepository.saveAll(variantList);

        return this.getBaseProductById(baseProduct1.getId());
    }

    @Transactional
    public BaseProductDto updateBaseProduct(int baseId, BaseProductDto baseProductDto) {
        BaseProduct baseProduct = baseProductRepository.findById(baseId);
        if (baseProduct == null) throw new ProductException("Không tìm thấy sản phẩm");
        if (    baseProductDto.getName() == null || baseProductDto.getName().isBlank())
            throw new ProductException("Tên sản phẩm không được trống");

        baseProductRepository.updateBaseProduct(baseId, baseProductDto.getName(), baseProductDto.getLabel());
        BaseProduct baseProduct1 = baseProductRepository.findById(baseId);

        return modelMapper.map(baseProduct1, BaseProductDto.class);
    }

}
