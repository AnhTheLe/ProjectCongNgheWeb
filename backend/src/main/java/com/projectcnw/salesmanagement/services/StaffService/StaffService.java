package com.projectcnw.salesmanagement.services.StaffService;


import com.projectcnw.salesmanagement.dto.staff.StaffItemDto;

import com.projectcnw.salesmanagement.models.UserEntity;

import com.projectcnw.salesmanagement.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class StaffService {

    @Autowired
    private UserRepository userRepository;


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

}
