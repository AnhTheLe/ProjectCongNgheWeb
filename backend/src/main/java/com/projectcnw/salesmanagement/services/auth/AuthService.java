package com.projectcnw.salesmanagement.services.auth;

import com.projectcnw.salesmanagement.dto.auth.AuthDto;
import com.projectcnw.salesmanagement.dto.auth.AuthResponse;
import com.projectcnw.salesmanagement.dto.auth.UserInfoDto;
import com.projectcnw.salesmanagement.dto.auth.VerifyTokenRequest;
import com.projectcnw.salesmanagement.exceptions.NotFoundException;
import com.projectcnw.salesmanagement.exceptions.UnAuthorizedException;
import com.projectcnw.salesmanagement.models.UserEntity;
import com.projectcnw.salesmanagement.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthResponse authenticate(AuthDto authDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authDto.getPhone(),
                        authDto.getPassword()
                )
        );
        String token = jwtService.generateToken(authentication.getName());
        UserEntity userEntity = userRepository.findByPhone(authDto.getPhone())
                .orElseThrow(() -> new NotFoundException("profile not found"));
        ModelMapper modelMapper = new ModelMapper();
        return AuthResponse.builder()
                .userInfoDto(modelMapper.map(userEntity, UserInfoDto.class))
                .token(token)
                .build();
    }

    public AuthResponse register(AuthDto authDto) {
        UserEntity userEntity = userRepository.findByPhone(authDto.getPhone())
                .orElseThrow(() -> new NotFoundException("profile not found"));

        userEntity.setPassword(passwordEncoder.encode(authDto.getPassword()));
        userRepository.save(userEntity);
        var jwtToken = jwtService.generateToken(userEntity.getPhone());
        ModelMapper modelMapper = new ModelMapper();
        return AuthResponse.builder()
                .userInfoDto(modelMapper.map(userEntity, UserInfoDto.class))
                .token(jwtToken)
                .build();
    }

    public UserInfoDto verifyToken(VerifyTokenRequest request) {
        String phone = jwtService.extractUsername(request.getToken());
        if (!jwtService.isTokenValid(request.getToken(), phone)) {
            throw new UnAuthorizedException();
        }

        UserEntity userEntity = userRepository.findByPhone(phone)
                .orElseThrow(() -> new NotFoundException("profile not found"));
        ModelMapper modelMapper = new ModelMapper();
        return modelMapper.map(userEntity, UserInfoDto.class);
    }
}
