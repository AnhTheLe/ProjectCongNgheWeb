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
public class AuthService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final JwtService jwtService;

    @Autowired
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

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
        boolean userEntity = userRepository.findByPhone(authDto.getPhone())
                .isPresent();
        UserEntity userEntity1 = new UserEntity();
        if(!userEntity){

            userEntity1.setPassword(passwordEncoder.encode(authDto.getPassword()));
            userRepository.save(userEntity1);
            var jwtToken = jwtService.generateToken(userEntity1.getPhone());
            ModelMapper modelMapper = new ModelMapper();
            return AuthResponse.builder()
                    .userInfoDto(modelMapper.map(userEntity1, UserInfoDto.class))
                    .token(jwtToken)
                    .build();
        }
        return null;
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