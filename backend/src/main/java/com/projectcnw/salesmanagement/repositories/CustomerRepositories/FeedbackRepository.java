package com.projectcnw.salesmanagement.repositories.CustomerRepositories;

import com.projectcnw.salesmanagement.models.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    @Query(value = "SELECT * FROM feedback f WHERE f.customer_id = :customerId ORDER BY f.id DESC"
            , nativeQuery = true)
    List<Feedback> findAllFeedbackByCustomer(@Param("customerId") int customerId);

    @Query(value = "SELECT * FROM feedback f ORDER BY COALESCE(f.updated_at, f.created_at) DESC LIMIT :size OFFSET :offset", nativeQuery = true)
    List<Feedback> findAllFeedback(@Param("size") int size, @Param("offset") int offset);

    @Query("SELECT f FROM Feedback f WHERE f.customer.name LIKE %:searchTerm% OR f.customer.phone LIKE %:searchTerm%")
    List<Feedback> searchFeedback(@Param("searchTerm") String searchTerm);

    @Query(value = "SELECT COUNT(*) FROM feedback", nativeQuery = true)
    long count();
}
            