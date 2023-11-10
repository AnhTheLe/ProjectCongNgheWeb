package com.projectcnw.salesmanagement.repositories.ProductManagerRepository;

import com.projectcnw.salesmanagement.dto.productDtos.BaseProductDto;
import com.projectcnw.salesmanagement.dto.productDtos.IBaseProductDto;
import com.projectcnw.salesmanagement.dto.productDtos.IVariantDto;
import com.projectcnw.salesmanagement.models.BaseProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BaseProductRepository extends JpaRepository<BaseProduct, Integer> {

    // lấy danh sách base-product
    @Query(value = "SELECT bp.id AS id,\n" +
            "       bp.name AS name,\n" +
            "       bp.label AS label,\n" +
            "       bp.attribute1 AS attribute1,\n" +
            "       bp.attribute2 AS attribute2,\n" +
            "       bp.attribute3 AS attribute3,\n" +
            "       COUNT(v.id) AS variantNumber,\n" +
            "       SUM(v.quantity) AS quantity,\n" +
            "       bp.created_at AS createdAt,\n" +
            "       bp.updated_at AS updatedAt\n" +
            "FROM base_product bp\n" +
            "LEFT JOIN variant v ON bp.id = v.base_id AND v.is_deleted = false\n" +
            "WHERE bp.is_deleted = false\n"+
            "GROUP BY bp.id, bp.name, bp.is_deleted\n"+
            "ORDER BY bp.created_at DESC\n"+
            "LIMIT :size OFFSET :offset", nativeQuery = true)
    List<IBaseProductDto> findAllBaseProduct(@Param("size") int size,@Param("offset") int offset);

    @Query(value = "SELECT COUNT(*) FROM base_product bp WHERE bp.is_deleted = false", nativeQuery = true)
    long count();

    @Transactional
    @Modifying
    @Query(value = "UPDATE base_product SET name =:name, label=:label WHERE id =:baseId", nativeQuery = true)
    void updateBaseProduct(@Param("baseId") int baseId, @Param("name") String name, @Param("label") String label);
    @Query(value = "SELECT bp.id AS id,\n" +
            "       bp.name AS name,\n" +
            "       bp.label AS label,\n" +
            "       bp.attribute1 AS attribute1,\n" +
            "       bp.attribute2 AS attribute2,\n" +
            "       bp.attribute3 AS attribute3,\n" +
            "       COUNT(v.id) AS variantNumber,\n" +
            "       SUM(v.quantity) AS quantity,\n" +
            "       bp.created_at AS createdAt,\n" +
            "       bp.updated_at AS updatedAt\n" +
            "FROM base_product bp\n" +
            "LEFT JOIN variant v ON bp.id = v.base_id AND v.is_deleted = false\n" +
            "GROUP BY bp.id, bp.name, bp.is_deleted HAVING bp.id =:baseId AND bp.is_deleted = false\n", nativeQuery = true)
    IBaseProductDto findBaseProductById(@Param("baseId") int baseId);
    @Query(value = "SELECT bp.id AS id,\n" +
            "       bp.name AS name,\n" +
            "       bp.label AS label,\n" +
            "       bp.attribute1 AS attribute1,\n" +
            "       bp.attribute2 AS attribute2,\n" +
            "       bp.attribute3 AS attribute3,\n" +
            "       COUNT(v.id) AS variantNumber,\n" +
            "       SUM(v.quantity) AS quantity,\n" +
            "       bp.created_at AS createdAt,\n" +
            "       bp.updated_at AS updatedAt\n" +
            "FROM base_product bp\n" +
            "LEFT JOIN variant v ON bp.id = v.base_id AND v.is_deleted = false\n" +
            "GROUP BY bp.id, bp.name, bp.is_deleted HAVING (bp.name LIKE CONCAT('%', :keyword, '%') OR bp.label LIKE CONCAT('%', :keyword, '%')) AND bp.is_deleted = false\n", nativeQuery = true)
    List<IBaseProductDto> findAllBaseProductsByKeyword(@Param("keyword") String keyword);
    @Query(value = "SELECT v.id as id, v.barcode as barcode, v.image as image, v.import_price as importPrice, v.name as name, v.quantity as quantity, v.retail_price as retailPrice, v.sku as sku, v.wholesale_price as wholeSalePrice, v.created_at as createdAt, v.updated_at as updatedAt, v.base_id as baseId, v.value1 as value1, v.value2 as value2, v.value3 as value3\n" +
            " FROM variant v WHERE v.base_id = :baseId AND v.is_deleted = false"
            , nativeQuery = true)
    List<IVariantDto> findAllVariantByBaseProductId(@Param("baseId") int baseId);

    BaseProduct save(BaseProductDto baseProductDto);
    BaseProduct findById(int baseId);

    @Transactional
    @Modifying
    @Query(value = "UPDATE base_product SET attribute1 = :name WHERE id = :baseId", nativeQuery = true)
    void updateNameAttribute1(@Param("baseId") int baseId, @Param("name") String name);
    @Transactional
    @Modifying
    @Query(value = "UPDATE base_product SET attribute2 = :name WHERE id = :baseId", nativeQuery = true)
    void updateNameAttribute2(@Param("baseId") int baseId, @Param("name") String name);
    @Transactional
    @Modifying
    @Query(value = "UPDATE base_product SET attribute3 = :name WHERE id = :baseId", nativeQuery = true)
    void updateNameAttribute3(@Param("baseId") int baseId, @Param("name") String name);
    @Transactional
    @Modifying
    @Query(value ="UPDATE variant SET value2 =:value WHERE base_id =:baseId", nativeQuery = true)
    void createValue2AttributeForVariant(@Param("baseId") int baseId, @Param("value") String value);

    @Transactional
    @Modifying
    @Query(value ="UPDATE variant SET value3 =:value WHERE base_id =:baseId", nativeQuery = true)
    void createValue3AttributeForVariant(@Param("baseId") int baseId, @Param("value") String value);


    @Transactional
    @Modifying
    @Query(value = "UPDATE base_product SET is_deleted = true WHERE id =:baseId", nativeQuery = true)
    void deleteBaseProductById(@Param("baseId") int baseId);
    @Transactional
    @Modifying
    @Query(value = "UPDATE variant SET is_deleted = true WHERE base_id =:baseId", nativeQuery = true)
    void deleteAllVariantByBaseId(@Param("baseId") int baseId);

}
