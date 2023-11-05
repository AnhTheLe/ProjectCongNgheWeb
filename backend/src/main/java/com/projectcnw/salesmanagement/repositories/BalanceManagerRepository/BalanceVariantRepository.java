package com.projectcnw.salesmanagement.repositories.BalanceManagerRepository;


import com.projectcnw.salesmanagement.dto.balanceDtos.IBalanceVariantDto;
import com.projectcnw.salesmanagement.models.BalanceVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface BalanceVariantRepository extends JpaRepository<BalanceVariant, Integer> {
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO balance_variant ( balance_id, variant_id, note, real_quantity, saved_quantity)\n"
    +"              VALUES (:balanceId, :variantId, :note, :realQuantity, :savedQuantity)", nativeQuery = true)
    void saveBalance(@Param("balanceId") int balanceId, @Param("variantId") int variantId, @Param("note") String note, @Param("realQuantity") int realQuantity, @Param("savedQuantity") int savedQuantity);

    @Query(value = "SELECT b.balance_id as warehouseBalanceId, b.variant_id as variantId, b.note as note, b.real_quantity as realQ,b.saved_quantity as savedQ\n"
            +"              FROM balance_variant b WHERE b.balance_id =:warehouseBalanceId", nativeQuery = true )
    List<IBalanceVariantDto> findByWarehouseBalanceId(@Param("warehouseBalanceId") int warehouseBalanceId);

}