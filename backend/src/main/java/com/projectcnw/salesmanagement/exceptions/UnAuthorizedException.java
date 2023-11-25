package com.projectcnw.salesmanagement.exceptions;


public class UnAuthorizedException extends RuntimeException {

    public UnAuthorizedException() {
        super("Unauthorized");
    }
}
