package com.eq11.habitos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eq11.habitos.models.TokenInvalidado;

public interface TokenInvalidadoRepository extends JpaRepository<TokenInvalidado, Integer> {

    boolean existsByToken(String token);
}
