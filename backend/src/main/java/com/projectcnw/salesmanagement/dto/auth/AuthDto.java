package com.projectcnw.salesmanagement.dto.auth;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AuthDto {

    @NotEmpty
    private String phone;

    @NotEmpty
    private String password;
}
