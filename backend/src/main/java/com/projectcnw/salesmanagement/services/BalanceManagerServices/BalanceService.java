package com.projectcnw.salesmanagement.services.BalanceManagerServices;

import com.projectcnw.salesmanagement.dto.balanceDtos.BalanceVariantDto;
import com.projectcnw.salesmanagement.dto.balanceDtos.WarehouseBalanceDto;
import com.projectcnw.salesmanagement.dto.balanceDtos.IWarehouseBalanceDto;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.exceptions.ProductManagerExceptions.ProductException;
import com.projectcnw.salesmanagement.models.UserEntity;
import com.projectcnw.salesmanagement.models.Variant;
import com.projectcnw.salesmanagement.models.WarehouseBalance;
import com.projectcnw.salesmanagement.repositories.BalanceManagerRepository.BalanceVariantRepository;
import com.projectcnw.salesmanagement.repositories.BalanceManagerRepository.WarehouseBalanceRepository;
import com.projectcnw.salesmanagement.repositories.ProductManagerRepository.VariantRepository;
import com.projectcnw.salesmanagement.repositories.UserRepository;
import com.projectcnw.salesmanagement.services.BaseService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class BalanceService extends BaseService {
    @Autowired
    private WarehouseBalanceRepository warehouseBalanceRepository;
    @Autowired
    private BalanceVariantRepository balanceVariantRepository;
    @Autowired
    private VariantRepository variantRepository;
    @Autowired
    private UserRepository userRepository;
    private ModelMapper modelMapper = new ModelMapper();


    @Transactional
    public WarehouseBalanceDto createBalance(WarehouseBalanceDto warehouseBalanceDto, UserDetails userDetails) {
//        WarehouseBalance warehouseBalance = modelMapper.map(warehouseBalanceDto, WarehouseBalance.class);
        WarehouseBalance warehouseBalance = new WarehouseBalance();
        warehouseBalance.setNote(warehouseBalanceDto.getNote());
        //thêm user
        UserEntity user = userRepository.findByPhone(userDetails.getUsername()).orElseThrow(() -> new NotFoundException("user's phone " + userDetails.getUsername() + " not found"));
        warehouseBalance.setUserEntity(user);
        //
        WarehouseBalance warehouseBalanceNew = warehouseBalanceRepository.save(warehouseBalance);
        if (warehouseBalanceDto.getBalanceVariantList().isEmpty()) throw new ProductException("Hãy thêm sản phẩm");

        for (BalanceVariantDto balanceVariantDto : warehouseBalanceDto.getBalanceVariantList()) {
            Variant variant = variantRepository.findById(balanceVariantDto.getVariantId());
            if (variant == null) throw new ProductException("variant id "+variant.getId()+" is not found");

            balanceVariantRepository.saveBalance(warehouseBalance.getId(), balanceVariantDto.getVariantId(), balanceVariantDto.getNote(),  balanceVariantDto.getRealQ(), variant.getQuantity());
            variantRepository.updateQuantityAfterBalance(variant.getId(), balanceVariantDto.getRealQ());

            // lưu lịch sử

        }

        WarehouseBalanceDto warehouseBalanceDto1 = modelMapper.map(warehouseBalanceNew, warehouseBalanceDto.getClass());
        warehouseBalanceDto1.setBalanceVariantList(warehouseBalanceDto.getBalanceVariantList());
        warehouseBalanceDto1.setPersonInCharge(user.getFullName());

        return warehouseBalanceDto1;

    }

    public long countWarehouseBalance() {
        return warehouseBalanceRepository.count();
    }

    public List<WarehouseBalanceDto> getAllWarehouseBalance(int page, int size) {
        int offset = (page -1)*size;
        List<IWarehouseBalanceDto> iWarehouseBalanceDtos = warehouseBalanceRepository.findAllWarehouseBalance(size, offset);

        return Arrays.asList(modelMapper.map(iWarehouseBalanceDtos, WarehouseBalanceDto[].class));
    }


}
