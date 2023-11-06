package com.projectcnw.salesmanagement.services.VendorService.impl;


import com.projectcnw.salesmanagement.converter.ImportItemConvert;
import com.projectcnw.salesmanagement.converter.ImportOrderConverter;
import com.projectcnw.salesmanagement.converter.PaymentConverter;
import com.projectcnw.salesmanagement.dto.vendorDtos.ImportOrderDTO;
import com.projectcnw.salesmanagement.dto.vendorDtos.PaymentDTO;
import com.projectcnw.salesmanagement.dto.productDtos.VariantDto;
import com.projectcnw.salesmanagement.dto.vendorDtos.VendorDTO;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.models.*;
import com.projectcnw.salesmanagement.models.enums.OrderType;

import com.projectcnw.salesmanagement.models.enums.PaymentStatus;
import com.projectcnw.salesmanagement.models.enums.ShipmentStatus;
import com.projectcnw.salesmanagement.models.keys.ImportItemKey;
import com.projectcnw.salesmanagement.repositories.PaymentRepository;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.VariantRepository;
import com.projectcnw.salesmanagement.repositories.UserRepository;
import com.projectcnw.salesmanagement.repositories.VendorManagerRepository.ImportItemRepository;
import com.projectcnw.salesmanagement.repositories.VendorManagerRepository.ImportOrderRepository;
import com.projectcnw.salesmanagement.repositories.VendorManagerRepository.VendorRepository;
import com.projectcnw.salesmanagement.services.VendorService.IImportOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ImportOrderService implements IImportOrderService {

    ImportOrderRepository importOrderRepository;
    ImportOrderConverter importOrderConverter;
    ImportItemRepository importItemRepository;
    ImportItemConvert importItemConvert;
    PaymentRepository paymentRepository;
    PaymentConverter paymentConverter;
    VendorRepository vendorRepository;
    VendorService vendorService;
    VariantRepository variantRepository;
    UserRepository userRepository;

    private ModelMapper modelMapper = new ModelMapper();

    public ImportOrderService(ImportOrderRepository importOrderRepository, ImportOrderConverter importOrderConverter, VendorRepository vendorRepository, ImportItemConvert importItemConvert, ImportItemRepository importItemRepository, VariantRepository variantRepository,  PaymentConverter paymentConverter, PaymentRepository paymentRepository,  VendorService vendorService,  UserRepository userRepository){
        this.importOrderRepository = importOrderRepository;
        this.importOrderConverter = importOrderConverter;
        this.importItemRepository = importItemRepository;
        this.importItemConvert = importItemConvert;
        this.paymentRepository = paymentRepository;
        this.paymentConverter = paymentConverter;
        this.vendorRepository = vendorRepository;
        this.vendorService = vendorService;
        this.variantRepository = variantRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ImportOrderDTO save(ImportOrderDTO importOrderDTO, String phone) {

        if(importOrderDTO.getId() != 0){
            ImportOrder oldImportOrder =  importOrderRepository.findById(importOrderDTO.getId()).orElse(null);
            if(oldImportOrder == null){
                throw  new NotFoundException("ImportOrder not found with id: " + importOrderDTO.getId());
            }

            oldImportOrder.setShipmentStatus(ShipmentStatus.ARRIVED);
            importOrderRepository.save(oldImportOrder);
            return importOrderConverter.toDto(oldImportOrder);
        }else{
            ImportOrder importOrder = new ImportOrder();
            importOrder.setShipmentStatus(ShipmentStatus.INIT);
            System.out.println(importOrderDTO.getVendor().getEmail());
            Vendor vendor = vendorRepository.findVendorByEmail(importOrderDTO.getVendor().getEmail());
            if(vendor == null){
                throw  new NotFoundException("Vendor not found");
            }
            importOrder.setVendor(vendor);
            UserEntity user = userRepository.findByPhone(phone).orElseThrow(() -> new NotFoundException("user's phone " + phone + " not found"));

            importOrder.setUserEntity(user);
            importOrderRepository.save(importOrder);


            List<VariantDto> variantDTOList = importOrderDTO.getVariantDTOList();
            int amount = 0;
            for ( VariantDto variantDTO: variantDTOList) {
                Variant variant = variantRepository.findById(variantDTO.id);
                if(variant == null){
                    throw  new NotFoundException("variant not found");
                }
                variant.setQuantity(variant.getQuantity() + variantDTO.getQuantity());
                variant.setImportPrice(variantDTO.getImportPrice());

                ImportItem importItem = new ImportItem();
                ImportItemKey id = new ImportItemKey();
                id.setImportOrderId(importOrder.getId());
                id.setVariantId(variantDTO.getId());
                importItem.setId(id);
                importItem.setImportOrder(importOrder);
                importItem.setVariant(variant);
                importItem.setImportPrice(variantDTO.getImportPrice());
                importItem.setQuantity(variantDTO.getQuantity());
                importItem.setDiscount(variantDTO.getDiscount());
//                System.out.println(importItem.getDiscount()/100.0);
                amount +=  variantDTO.getImportPrice() * variantDTO.getQuantity()*(1- importItem.getDiscount()/100.0);
//                System.out.println(amount);
                importItemRepository.save(importItem);
                variantRepository.save(variant);
            }

            Payment payment = new Payment();
            payment.setOrderId(importOrder.getId());
            payment.setAmount(amount);
            payment.setOrderType(OrderType.IMPORT);
            payment.setPaymentStatus(PaymentStatus.INIT);
            paymentConverter.toDto(payment);
            paymentRepository.save(payment);

            importOrder = importOrderRepository.save(importOrder);
            return importOrderConverter.toDto(importOrder);
        }
    }
    @Override
    public List<ImportOrderDTO> findAll() {
        List<ImportOrderDTO> results = new ArrayList<>();
        List<ImportOrder> importOrders = importOrderRepository.findAll();
        
        for(ImportOrder importOrder: importOrders){
            ImportOrderDTO importOrderDTO = importOrderConverter.toDto(importOrder);
            Payment payment = paymentRepository.findPaymentByOrderIdAndOrderType(importOrder.getId(), OrderType.IMPORT);
            if(payment == null){
                throw  new NotFoundException("payment not found");
            }
            PaymentDTO paymentDTO = paymentConverter.toDto(payment);
            importOrderDTO.setPaymentDTO(paymentDTO);
            results.add(importOrderDTO);
        }
        return results;
    }
    @Override
    public List<ImportOrderDTO> findAll(Pageable pageable) {
        List<ImportOrderDTO> results = new ArrayList<>();
        List<ImportOrder> entities = importOrderRepository.findAll(pageable).getContent();
        if (entities.isEmpty()) {
            throw new NotFoundException("No importOrders found");
        }
        for(ImportOrder item: entities){
            ImportOrderDTO importOrderDTO = importOrderConverter.toDto(item);
            results.add(importOrderDTO);
        }
        return results;
    }

    @Override
    public ImportOrderDTO findById(Integer id) {
        ImportOrder importOrder = importOrderRepository.findById(id).orElse(null);
        if(importOrder == null){
            throw new NotFoundException("No importOrder found");
        }

        List<ImportItem> importItems = importItemRepository.findById_ImportOrderId(importOrder.getId());
        List<VariantDto> variantDtoList = new ArrayList<>();
        for(ImportItem importItem : importItems){
            Variant variant = variantRepository.findById(importItem.getId().getVariantId());
            variant.setQuantity(importItem.getQuantity());
            variant.setImportPrice(importItem.getImportPrice());
            VariantDto variantDto = modelMapper.map(variant, VariantDto.class);
            variantDto.setDiscount(importItem.getDiscount());
            variantDtoList.add(variantDto);
        }
        ImportOrderDTO importOrderDTO = importOrderConverter.toDto(importOrder);
        importOrderDTO.setVariantDTOList(variantDtoList);

        Payment payment = paymentRepository.findPaymentByOrderIdAndOrderType(importOrder.getId(), OrderType.IMPORT);
        PaymentDTO paymentDTO = paymentConverter.toDto(payment);
        importOrderDTO.setPaymentDTO(paymentDTO);

        VendorDTO vendorDTO = vendorService.findById(importOrder.getVendor().getId());
        importOrderDTO.setVendor(vendorDTO);

        return importOrderDTO;
    }

    @Override
    public List<ImportOrderDTO> findByName(String  name) {
        List<ImportOrderDTO> results = new ArrayList<>();
        List<ImportOrder> entities = importOrderRepository.findByVendorName(name);
        for(ImportOrder item: entities){
            ImportOrderDTO importOrderDTO = importOrderConverter.toDto(item);
            results.add(importOrderDTO);
        }
        return results;
    }
    
}
