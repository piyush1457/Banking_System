package com.kodbank.repository;

import com.kodbank.entity.KodUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KodUserRepository extends JpaRepository<KodUser, String> {

    Optional<KodUser> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
