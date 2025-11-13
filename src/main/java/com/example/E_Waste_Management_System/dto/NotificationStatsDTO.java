
package com.example.E_Waste_Management_System.dto;

import lombok.Builder;
import lombok.Data;


@Data
public class NotificationStatsDTO {
    private long totalCount;
    private long unreadCount;

    public NotificationStatsDTO(long totalCount, long unreadCount) {
        this.totalCount = totalCount;
        this.unreadCount = unreadCount;
    }
}