package com.kodbank.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "KodUser")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KodUser {

    @Id
    @Column(name = "uid", length = 50)
    private String uid;

    @Column(name = "username", length = 100, nullable = false, unique = true)
    private String username;

    @Column(name = "email", length = 150, nullable = false, unique = true)
    private String email;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @Column(name = "balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal balance = new BigDecimal("100000.00");

    @Column(name = "phone", length = 15, nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role = Role.Customer;

    public enum Role {
        Customer, Manager, Admin
    }
}
