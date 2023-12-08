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

    public long countCustomer() {
        return customerRepository.count();
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

    public Customer createCustomer(Customer customer) {
        // Kiểm tra xem số điện thoại đã tồn tại trong hệ thống chưa
        Customer existingCustomer = customerRepository.findByPhone(customer.getPhone());

        if (existingCustomer != null) {
            throw new BadRequestException("Số điện thoại đã tồn tại trong hệ thống.");
        }

        // Lấy ID của khách hàng sau khi lưu vào cơ sở dữ liệu
        Customer savedCustomer = customerRepository.save(customer);
        Integer customerId = savedCustomer.getId();

        // Tạo mã khách hàng dựa trên ID
        String customerCode = String.format("CUZ%05d", customerId);
        savedCustomer.setCustomerCode(customerCode);

        // Lưu lại khách hàng với mã khách hàng đã được tạo
        return customerRepository.save(savedCustomer);
    }


    public Customer updateCustomer(int customerId, Customer customer) {
        // Tìm khách hàng theo id trong cơ sở dữ liệu
        Customer existingCustomer = customerRepository.findById(customerId).orElse(null);

        if (existingCustomer == null) {
            // Khách hàng không tồn tại, bạn có thể ném một ngoại lệ hoặc trả về null
            throw new BadRequestException("Khách hàng không tồn tại.");
        }

        // Cập nhật thông tin của khách hàng từ customer truyền vào
        existingCustomer.setName(customer.getName());
        existingCustomer.setAddress(customer.getAddress());
        existingCustomer.setPhone(customer.getPhone());
        existingCustomer.setGender(customer.getGender());
        existingCustomer.setDateOfBirth(customer.getDateOfBirth());
        existingCustomer.setEmail(customer.getEmail());

        // Lưu khách hàng đã cập nhật vào cơ sở dữ liệu
        return customerRepository.save(existingCustomer);
    }


    @Transactional
    public void deleteCustomerById(int customerId) {
        // Kiểm tra xem khách hàng có tồn tại dựa trên customerId hay không
        boolean exists = customerRepository.existsById(customerId);

        if (exists) {
            // Nếu khách hàng tồn tại, xóa khách hàng khỏi cơ sở dữ liệu
            customerRepository.deleteById(customerId);
        } else {
            // Nếu không tìm thấy khách hàng, bạn có thể ném một ngoại lệ hoặc xử lý theo ý muốn
            throw new BadRequestException("Không tìm thấy khách hàng với ID: " + customerId);
        }
    }

}
