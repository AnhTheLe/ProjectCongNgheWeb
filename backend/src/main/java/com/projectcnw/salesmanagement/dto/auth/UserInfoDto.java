package com.projectcnw.salesmanagement.dto.auth;

import com.projectcnw.salesmanagement.models.Role;
import com.projectcnw.salesmanagement.models.enums.Gender;
import com.projectcnw.salesmanagement.models.enums.WorkStatus;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
public class UserInfoDto {

    private String fullName;

    private boolean isActive;

    private String phone;

    private String address;

    private Date dob;

    private Gender gender;

    private WorkStatus workStatus;

    private List<Role> roles;
}
