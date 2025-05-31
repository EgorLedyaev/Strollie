package ru.riveo.strollie.client.dto;

import lombok.Data;

import java.util.List;

@Data
public class PageDto<T> {
    private List<T> content;
    private int number; // current page number
    private int size; // page size
    private int totalPages;
    private long totalElements;
    private boolean first;
    private boolean last;
    private boolean empty;
}
