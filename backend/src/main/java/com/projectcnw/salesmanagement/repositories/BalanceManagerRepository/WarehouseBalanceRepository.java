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

    @Query(value = "SELECT w.id as id, w.created_at as createdAt, w.updated_at as updatedAt,w.note as note, u.full_name as personInCharge\n"
            +"              FROM warehouse_balance w \n"
            +"              LEFT JOIN user u ON w.person_in_charge = u.id\n"
            +"              WHERE w.is_deleted = false and (u.full_name LIKE CONCAT('%', :keyword, '%') OR w.id =:keyword )\n"
            +"              ORDER BY w.created_at DESC\n", nativeQuery = true)
    List<IWarehouseBalanceDto> findAllWarehouseBalanceByKeyword(@Param("keyword") String keyword);

    @Query(value = "SELECT COUNT(*) FROM warehouse_balance wp WHERE wp.is_deleted = false", nativeQuery = true)
    long count();
    @Query(value = "SELECT w.id as id,w.note as note, w.created_at as createdAt, w.updated_at as updatedAt, u.full_name as personInCharge\n"
            +"              FROM warehouse_balance w \n"
            +"              LEFT JOIN user u ON w.person_in_charge = u.id\n"
            +"              WHERE w.id =:warehouseBalanceId" , nativeQuery = true)
    IWarehouseBalanceDto findWarehouseBalanceById(@Param("warehouseBalanceId") int warehouseBalanceId);


}
