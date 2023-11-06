package com.projectcnw.salesmanagement.repositories;

import com.projectcnw.salesmanagement.models.Role;
import com.projectcnw.salesmanagement.models.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    @Query("select r from Role r where r.name = :name")
    Optional<Role> findByName(@Param("name") RoleType name);
}
