package com.projectcnw.salesmanagement.services.CustomerServices;


import com.projectcnw.salesmanagement.dto.customer.CustomerSpendingDTO;
import com.projectcnw.salesmanagement.exceptions.BadRequestException;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.models.Customer;
import com.projectcnw.salesmanagement.repositories.CustomerRepository.CustomerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerServices {

    private final CustomerRepository customerRepository;
    private ModelMapper modelMapper = new ModelMapper();

    public CustomerServices(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    public List<Customer> getAllCustomer(int page, int size) {
        int offset = (page -1)*size;
        List<Customer> customerList = customerRepository.findAllCustomer(size, offset);
        return customerList;
    }


    public long countCustomer() {
        return customerRepository.count();
    }


}
