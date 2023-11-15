
package com.projectcnw.salesmanagement.services.CustomerServices;

import com.projectcnw.salesmanagement.dto.PagedResponseObject;
import com.projectcnw.salesmanagement.dto.customer.FeedbackDTO;
import com.projectcnw.salesmanagement.exceptions.BadRequestException;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.models.*;
import com.projectcnw.salesmanagement.repositories.CustomerRepositories.CustomerRepository;
import com.projectcnw.salesmanagement.repositories.CustomerRepositories.FeedbackRepository;
import com.projectcnw.salesmanagement.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class FeedbackService {
    private FeedbackRepository feedbackRepository;

    private CustomerRepository customerRepository;

    private final UserRepository userRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, CustomerRepository customerRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    public long countFeedback() {
        return feedbackRepository.count();
    }

    public List<Feedback> getFeedbackList(int customerId) {
        List<Feedback> feedbackList = feedbackRepository.findAllFeedbackByCustomer(customerId);
        return feedbackList;
    }

    public List<Feedback> getAllFeedback(int page, int size) {
        int offset = (page -1)*size;
        List<Feedback> feedbackList = feedbackRepository.findAllFeedback(size, offset);
        return feedbackList;
    }

    public List<Feedback> searchFeedbacks(String searchTerm) {
        return feedbackRepository.searchFeedback(searchTerm);
    }


    @Transactional
    public void createFeedback(FeedbackDTO feedbackDTO, String staffPhone) {
        Customer customer = null;

        if (feedbackDTO.getCustomerId() != null) {
            customer = customerRepository.findById(feedbackDTO.getCustomerId())
                    .orElseThrow(() -> new NotFoundException("customer " + feedbackDTO.getCustomerId() + " not found"));
        }

        UserEntity user = userRepository.findByPhone(staffPhone)
                .orElseThrow(() -> new NotFoundException("user's phone " + staffPhone + " not found"));

        Feedback feedback = new Feedback();
        feedback.setUserEntity(user);
        feedback.setCustomer(customer);
        feedback.setEvaluate(feedbackDTO.getEvaluate());
        feedback.setContent(feedbackDTO.getContent());

        feedbackRepository.save(feedback);
    }

    public Feedback updateFeedback(int feedbackId, FeedbackDTO feedbackDTO, String staffPhone) {
        // Tìm khách hàng theo id trong cơ sở dữ liệu
        Feedback existingFeedback = feedbackRepository.findById(feedbackId).orElse(null);

        if (existingFeedback == null) {
            // Phản hồi không tồn tại, bạn có thể ném một ngoại lệ hoặc trả về null
            throw new BadRequestException("Phản hồi không tồn tại.");
        }

        Customer customer = null;

        if (existingFeedback.getCustomer().getId() != null) {
            customer = customerRepository.findById(existingFeedback.getCustomer().getId())
                    .orElseThrow(() -> new NotFoundException("customer " + existingFeedback.getCustomer().getId() + " not found"));
        }

        UserEntity user = userRepository.findByPhone(staffPhone)
                .orElseThrow(() -> new NotFoundException("user's phone " + staffPhone + " not found"));

        existingFeedback.setUserEntity(user);
        existingFeedback.setCustomer(customer);
        existingFeedback.setEvaluate(feedbackDTO.getEvaluate());
        existingFeedback.setContent(feedbackDTO.getContent());
        existingFeedback.setUpdatedAt(new Timestamp(new Date().getTime()));

        return feedbackRepository.save(existingFeedback);
    }


    @Transactional
    public void deleteFeedbackById(int feedbackId) {
        boolean exists = feedbackRepository.existsById(feedbackId);

        if (exists) {
            feedbackRepository.deleteById(feedbackId);
        } else {
            throw new BadRequestException("Không tìm thấy phản hồi với ID: " + feedbackId);
        }
    }

}
