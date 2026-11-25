package com.eq11.habitos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.eq11.habitos.models.TokenRecuperacion;

public interface TokenRecuperacionRepository extends JpaRepository<TokenRecuperacion, Integer> {

    @EntityGraph(attributePaths = {"usuario"})
    Optional<TokenRecuperacion> findByTokenAndUsadoFalse(String token);
}
