package com.projectcnw.salesmanagement.controllers.ProductManagerControllers;

import com.projectcnw.salesmanagement.controllers.BaseController;
import com.projectcnw.salesmanagement.dto.PagedResponseObject;
import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.dto.productDtos.VariantDto;
import com.projectcnw.salesmanagement.services.ProductManagerServices.VariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class VariantController extends BaseController {

    private final VariantService variantService;

    @GetMapping("/base-products/variants")
    public ResponseEntity<PagedResponseObject> getAllVariants(@RequestParam(name = "page", defaultValue = "1") int page,
                                                              @RequestParam(name = "size", defaultValue = "10") int size) {
        long totalItems = variantService.countVariant();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        List<VariantDto> variantDtos = variantService.getAllVariants(page, size);
        return ResponseEntity.ok(PagedResponseObject.builder()
                .page(page)
                .perPage(size)
                .totalPages(totalPages)
                .totalItems(totalItems)
                .responseCode(200)
                .message("Success")
                .data(variantDtos)
                .build());
    }

    @GetMapping("base-products/variants/search")
    public ResponseEntity<ResponseObject> getAllVariantsByKeyword(@RequestParam(name = "keyword") String keyword) {

        List<VariantDto> variantDtos = variantService.getAllVariantsByKeyword(keyword);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(variantDtos)
                .build());
    }


}
