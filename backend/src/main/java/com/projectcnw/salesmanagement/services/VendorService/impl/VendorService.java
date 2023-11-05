package com.projectcnw.salesmanagement.services.VendorService.impl;

import com.projectcnw.salesmanagement.converter.*;
import com.projectcnw.salesmanagement.dto.vendorDtos.*;
import com.projectcnw.salesmanagement.exceptions.*;
import com.projectcnw.salesmanagement.models.*;
import com.projectcnw.salesmanagement.models.Payment;
import com.projectcnw.salesmanagement.models.Vendor;
import com.projectcnw.salesmanagement.models.enums.OrderType;
import com.projectcnw.salesmanagement.models.enums.PaymentStatus;
import com.projectcnw.salesmanagement.repositories.VendorManagerRepository.ImportOrderRepository;
import com.projectcnw.salesmanagement.repositories.PaymentRepository;
import com.projectcnw.salesmanagement.repositories.VendorManagerRepository.VendorRepository;
import com.projectcnw.salesmanagement.services.VendorService.IVendorService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VendorService implements IVendorService {

    VendorRepository vendorRepository;
    VendorConverter vendorConverter;
    ImportOrderRepository importOrderRepository;
    ImportOrderConverter importOrderConverter;
    PaymentRepository paymentRepository;
    PaymentConverter paymentConverter;

    public VendorService(VendorRepository vendorRepository, VendorConverter vendorConverter, ImportOrderRepository importOrderRepository, ImportOrderConverter importOrderConverter,  PaymentRepository paymentRepository, PaymentConverter paymentConverter){
        this.vendorRepository = vendorRepository;
        this.vendorConverter = vendorConverter;
        this.importOrderRepository = importOrderRepository;
        this.importOrderConverter = importOrderConverter;
        this.paymentRepository = paymentRepository;
        this.paymentConverter = paymentConverter;
    }

    @Override
    public VendorDTO save(VendorDTO vendorDTO){
        Vendor vendor = new Vendor();
        if(vendorDTO.getId() != 0){
            Vendor oldVendor = vendorRepository.findById(vendorDTO.getId()).orElse(null);
            if(oldVendor == null){
                throw new NotFoundException("Vendor not found with id: " + vendorDTO.getId());
            }
            vendor = vendorConverter.toEntity(vendorDTO, oldVendor);
        } else{
            if (vendorRepository.findByName(vendorDTO.getName()) != null ){
                throw new BadRequestException("Tên nhà cung cấp đã tồn tại");
            } else if (vendorRepository.findVendorByPhone(vendorDTO.getPhone()) != null ){
                throw new BadRequestException("Số điện thoại đã tồn tại");
            } else if (vendorRepository.findVendorByEmail(vendorDTO.getEmail()) != null ){
                throw new BadRequestException("Email đã tồn tại");
            }
            vendor = vendorConverter.toEntity(vendorDTO);
        }
        vendor = vendorRepository.save(vendor);
        return vendorConverter.toDto(vendor);
    }

    @Override
    public List<VendorDTO> findAll() {
        List<VendorDTO> results = new ArrayList<>();
        List<Vendor> entities = vendorRepository.findAll();
        for(Vendor item: entities){
            VendorDTO vendorDTO = findById(item.getId());
            results.add(vendorDTO);
        }
        return results;
    }

    @Override
    public List<VendorDTO> findAll(Pageable pageable) {
        return null;
    }

    @Override
    public VendorDTO findById(Integer id) {
        Vendor vendor = vendorRepository.findById(id).orElse(null);
        if(vendor == null){
            throw new NotFoundException("Vendor not found");
        }
        List<ImportOrder> importOrders = importOrderRepository.findImportOrderByVendor(vendor);
        List<PaymentDTO> paymentDTOList = new ArrayList<>();
        int Debt = 0;
        int TotalImportOrder = 0;
        for(ImportOrder importOrder : importOrders){
            System.out.println(importOrder.getId());
            Payment payment = paymentRepository.findPaymentByOrderIdAndOrderType(importOrder.getId(), OrderType.IMPORT);

            TotalImportOrder += payment.getAmount();
            if(payment.getPaymentStatus() == PaymentStatus.INIT) {
                Debt += payment.getAmount();
            }

            PaymentDTO paymentDTO = paymentConverter.toDto(payment);
            ImportOrderDTO importOrderDTO = importOrderConverter.toDto(importOrder);
            paymentDTO.setImportOrderDTO(importOrderDTO);
            paymentDTOList.add(paymentDTO);
        }
        VendorDTO vendorDTO = vendorConverter.toDto(vendor);

        if(Debt != 0){
            vendorDTO.setStatus("Đang giao dịch");
        } else{
            vendorDTO.setStatus("Hoàn thành");
        }
        vendorDTO.setPaymentDTOList(paymentDTOList);
        vendorDTO.setNumberImportOrder(importOrders.size());
        vendorDTO.setDebt(Debt);
        vendorDTO.setTotalImportOrder(TotalImportOrder);

        return vendorDTO;
    }

    @Override
    public VendorDTO findByName(String name) {
        Vendor vendor = vendorRepository.findByName(name);
        return vendorConverter.toDto(vendor);
    }
}
