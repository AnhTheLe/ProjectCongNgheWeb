package com.projectcnw.salesmanagement.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public abstract class BaseDto {

    public int id;
    public Timestamp createdAt;
    public Timestamp updatedAt;
}

