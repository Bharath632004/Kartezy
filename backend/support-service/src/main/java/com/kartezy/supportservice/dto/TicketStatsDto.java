package com.kartezy.supportservice.dto;
import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TicketStatsDto {
    private long open; private long inProgress; private long resolved; private long closed;
    private long urgent; private double avgResolutionTimeHours;
}
