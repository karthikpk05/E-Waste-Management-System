package com.example.E_Waste_Management_System.Model;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "refresh_tokens", indexes = {
        @Index(name="idx_rt_token", columnList = "token", unique = true)
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique = true, length=400)
    private String token;

    @Column(nullable=false)
    private Instant expiry;

    @Column(nullable=false, length=120)
    private String subjectEmail;   // email of user/admin

    @Column(nullable=false, length=20)
    private String subjectType;    // "USER" or "ADMIN"

    @Column(nullable=false)
    private boolean revoked;
}
