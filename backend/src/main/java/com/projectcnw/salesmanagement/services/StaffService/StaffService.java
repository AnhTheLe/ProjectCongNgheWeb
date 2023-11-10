package com.projectcnw.salesmanagement.services.StaffService;


import com.projectcnw.salesmanagement.dto.staff.StaffItemDto;
import com.projectcnw.salesmanagement.dto.staff.CreateStaffDto;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.models.Role;
import com.projectcnw.salesmanagement.models.UserEntity;

import com.projectcnw.salesmanagement.models.enums.RoleType;
import com.projectcnw.salesmanagement.models.enums.WorkStatus;
import com.projectcnw.salesmanagement.repositories.UserRepository;
import com.projectcnw.salesmanagement.repositories.RoleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class StaffService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public long countTotalStaffs() {
        return userRepository.count() - 1;
    }

    public List<StaffItemDto> getAllStaffs(int page, int size, String search) {
        ModelMapper modelMapper = new ModelMapper();
        Pageable paging = PageRequest.of(page, size);
        Page<UserEntity> staffListPage = userRepository.getAllStaffs(search, paging);
        List<UserEntity> staffList = staffListPage.getContent();
        return Arrays.asList(modelMapper.map(staffList, StaffItemDto[].class));
    }

    public void createStaff(CreateStaffDto createStaffDto) {
        createStaffDto.setPassword(passwordEncoder.encode(createStaffDto.getPassword()));
        ModelMapper modelMapper = new ModelMapper();
        List<Role> roles = new ArrayList<>();
        for (RoleType roleName: createStaffDto.getRoleNames()) {
            Role role = roleRepository.findByName(roleName).orElseThrow(() -> new NotFoundException("role not found"));
            roles.add(role);
        }
        UserEntity user = modelMapper.map(createStaffDto, UserEntity.class);
        user.setWorkStatus(WorkStatus.WORKING);
        user.setRoles(roles);
        userRepository.save(user);
    }
    public UserEntity getStaffDetailByID(int id) {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException("user not found"));
    }
}
