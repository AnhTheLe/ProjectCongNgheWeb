
package com.projectcnw.salesmanagement.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.net.HttpRetryException;


@Getter
@Setter
@Builder
public class ResponseObject {
    private int responseCode;
    private String message;
    private Object data;


}
