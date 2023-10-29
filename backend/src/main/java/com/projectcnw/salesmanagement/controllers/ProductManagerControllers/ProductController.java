package com.projectcnw.salesmanagement.controllers.ProductManagerControllers;


import com.projectcnw.salesmanagement.dto.PagedResponseObject;
import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.productDtos.BaseProductDto;
import com.projectcnw.salesmanagement.dto.productDtos.VariantDto;
import com.projectcnw.salesmanagement.services.ProductManagerServices.BaseProductService;
import com.projectcnw.salesmanagement.services.ProductManagerServices.VariantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class ProductController {
    @Autowired
    private BaseProductService baseProductService;

    @Autowired
    private VariantService variantService;

//
    //viewListProducts
    //lấy danh sách sản phẩm (gồm tồn kho, số phiên bản)
    @GetMapping("/base-products")
    public ResponseEntity<PagedResponseObject> getAllBaseProduct(@RequestParam(name = "page", defaultValue = "1") int page,
                                                                 @RequestParam(name = "size", defaultValue = "10") int size) {

        long totalItems = baseProductService.countBaseProduct();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        List<BaseProductDto> products = baseProductService.getAll(page, size);
        return ResponseEntity.ok(PagedResponseObject.builder()
                        .page(page)
                        .perPage(size)
                        .totalItems(totalItems)
                        .totalPages(totalPages)
                        .responseCode(200)
                        .message("Success")
                        .data(products)
                        .build());
    }

//    private int page;
//    private int perPage;
//    private int totalItems;
//    private int totalPages;

    //viewProduct
    //lây chi tiết 1 sản phẩm (gồm cả các phiên bản của nó)
    @GetMapping("/base-products/{id}")
    public ResponseEntity<ResponseObject> getDetailedBaseProductByBaseId(@PathVariable("id") int baseId) {
        BaseProductDto baseProductDto = baseProductService.getBaseProductById(baseId);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(baseProductDto)
                .build());
    }

    //createBaseProduct
    //tạo mới một base-product
    @PostMapping("/base-products")
    public ResponseEntity<ResponseObject> createBaseProduct(@Valid @RequestBody BaseProductDto baseProductDto){
        BaseProductDto baseProductDto1 = baseProductService.createBaseProduct(baseProductDto);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(baseProductDto1)
                .build());
    }

    @PutMapping("/base-products/{id}")
    public ResponseEntity<ResponseObject> updateBaseProduct(@PathVariable("id") int baseId, @RequestBody BaseProductDto baseProductDto){
        BaseProductDto baseProductDto1 = baseProductService.updateBaseProduct(baseId, baseProductDto);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(baseProductDto1)
                .build());
    }

    @PostMapping("/base-products/{id}/variants")
    public ResponseEntity<ResponseObject> createVariantOfBaseProduct(@PathVariable("id") int baseId,@Valid @RequestBody VariantDto variantDto){
        VariantDto variantDto1 = variantService.createVariant(baseId, variantDto);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(variantDto1)
                .build());
    }

}
