package com.projectcnw.salesmanagement.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PagedResponseObject {
    private int responseCode;
    private String message;

    private int page;
    private int perPage;
    private long totalItems;
    private int totalPages;
    private Object data;
}
