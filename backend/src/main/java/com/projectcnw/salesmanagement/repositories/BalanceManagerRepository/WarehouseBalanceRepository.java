package com.projectcnw.salesmanagement.repositories.BalanceManagerRepository;

import com.projectcnw.salesmanagement.dto.balanceDtos.IWarehouseBalanceDto;
import com.projectcnw.salesmanagement.models.WarehouseBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WarehouseBalanceRepository extends JpaRepository<WarehouseBalance, Integer> {

    @Query(value = "SELECT w.id as id, w.created_at as createdAt, w.updated_at as updatedAt,w.note as note, u.full_name as personInCharge\n"
            +"              FROM warehouse_balance w \n"
            +"              LEFT JOIN user u ON w.person_in_charge = u.id\n"
            +"              WHERE w.is_deleted = false\n"
            +"              ORDER BY w.created_at DESC\n"
            +"              LIMIT :size OFFSET :offset", nativeQuery = true)
    List<IWarehouseBalanceDto> findAllWarehouseBalance(@Param("size") int size, @Param("offset") int offset);
}
