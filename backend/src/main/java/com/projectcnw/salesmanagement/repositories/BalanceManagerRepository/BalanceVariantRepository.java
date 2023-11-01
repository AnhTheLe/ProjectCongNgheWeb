package com.projectcnw.salesmanagement.repositories.BalanceManagerRepository;


import com.projectcnw.salesmanagement.models.BalanceVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;


public interface BalanceVariantRepository extends JpaRepository<BalanceVariant, Integer> {
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO balance_variant ( balance_id, variant_id, note, real_quantity, saved_quantity)\n"
    +"              VALUES (:balanceId, :variantId, :note, :realQuantity, :savedQuantity)", nativeQuery = true)
    void saveBalance(@Param("balanceId") int balanceId, @Param("variantId") int variantId, @Param("note") String note, @Param("realQuantity") int realQuantity, @Param("savedQuantity") int savedQuantity);

}