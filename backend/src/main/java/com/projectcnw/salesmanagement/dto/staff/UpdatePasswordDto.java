package com.projectcnw.salesmanagement.dto.staff;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UpdatePasswordDto {

    @NotBlank
    private String password;
}
