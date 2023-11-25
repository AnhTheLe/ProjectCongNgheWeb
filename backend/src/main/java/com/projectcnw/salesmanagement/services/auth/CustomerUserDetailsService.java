package com.projectcnw.salesmanagement.services.auth;

import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.models.Role;
import com.projectcnw.salesmanagement.models.UserEntity;
import com.projectcnw.salesmanagement.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String phone) throws NotFoundException {
        UserEntity userEntity = userRepository.findByPhone(phone)
                .orElseThrow(
                        () -> new NotFoundException("User " + phone + " not found"));

        return new User(userEntity.getPhone(), userEntity.getPassword(), mapRolesToAuthorities(userEntity.getRoles()));
    }

    private Collection<GrantedAuthority> mapRolesToAuthorities(List<Role> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName().toString())).collect(Collectors.toList());
    }
}
