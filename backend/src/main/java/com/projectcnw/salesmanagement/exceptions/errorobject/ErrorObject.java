package com.projectcnw.salesmanagement.exceptions.errorobject;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@Getter
@Setter
public class ErrorObject {
    private int errorCode;
    private int statusCode;
    private Date timestamp;

    public ErrorObject(int statusCode, Date timestamp) {
        this.errorCode = -1;
        this.statusCode = statusCode;
        this.timestamp = timestamp;
    }
}
