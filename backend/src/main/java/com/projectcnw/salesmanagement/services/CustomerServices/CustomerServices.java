package com.projectcnw.salesmanagement.services.CustomerServices;


import com.projectcnw.salesmanagement.dto.customer.CustomerSpendingDTO;
import com.projectcnw.salesmanagement.exceptions.BadRequestException;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.models.Customer;
import com.projectcnw.salesmanagement.repositories.CustomerRepositories.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServices {

    private final CustomerRepository customerRepository;
    private ModelMapper modelMapper = new ModelMapper();

    public List<Customer> getAllCustomer(int page, int size) {
        int offset = (page -1)*size;
        List<Customer> customerList = customerRepository.findAllCustomer(size, offset);
        return customerList;
    }


    public long countCustomer() {
        return customerRepository.count();
    }

    public List<CustomerSpendingDTO> getAllCustomerBySpending(int page, int size) {
        int offset = (page -1)*size;
        List<Object[]> customerDataList = customerRepository.findAllCustomerBySpending(size, offset);

        List<CustomerSpendingDTO> customerList = new ArrayList<>();

        for (Object[] data : customerDataList) {
            int customerId = (int) data[0];
            Customer customer = null;
            customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new NotFoundException("customer " + customerId + " not found"));
//            BigDecimal totalAmount = (BigDecimal) data[1];
//            BigDecimal orderCount = (BigDecimal) data[2];
            BigDecimal totalAmount = (data[1] != null) ? BigDecimal.valueOf(((Number) data[1]).doubleValue()) : BigDecimal.ZERO;
            BigDecimal orderCount = (data[2] != null) ? BigDecimal.valueOf(((Number) data[2]).doubleValue()) : BigDecimal.ZERO;

            CustomerSpendingDTO customerSpending = new CustomerSpendingDTO(customer, totalAmount, orderCount);
            customerList.add(customerSpending);
        }

        return customerList;
    }

    public Customer getDetailCustomer(int customerId) {
        // Sử dụng findById để tìm khách hàng dựa trên id
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy khách hàng với ID: " + customerId));
    }

    public List<Customer> searchCustomers1(String searchTerm) {
        return customerRepository.searchCustomersByNameOrPhone1(searchTerm);
    }

    public List<CustomerSpendingDTO> searchCustomers(String searchTerm) {
        List<Object[]> customerDataList = customerRepository.searchCustomersByNameOrPhone(searchTerm);

        List<CustomerSpendingDTO> customerList = new ArrayList<>();

        for (Object[] data : customerDataList) {
            Customer customer = null;
            if (data[0] != null) {
                int customerId = (int) data[0];
                customer = customerRepository.findById(customerId)
                        .orElseThrow(() -> new NotFoundException("customer " + customerId + " not found"));
                BigDecimal totalAmount = BigDecimal.valueOf(((Number) data[1]).doubleValue());
                BigDecimal orderCount = BigDecimal.valueOf(((Number) data[2]).doubleValue());

                CustomerSpendingDTO customerSpending = new CustomerSpendingDTO(customer, totalAmount, orderCount);
                customerList.add(customerSpending);
            }

//            BigDecimal totalAmount = (BigDecimal) data[1];
//            BigDecimal orderCount = (BigDecimal) data[2];

        }

        return customerList;
    }
}
