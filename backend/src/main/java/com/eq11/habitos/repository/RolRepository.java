package com.eq11.habitos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eq11.habitos.models.Rol;

public interface RolRepository extends JpaRepository<Rol, Integer> {

    Optional<Rol> findByNombre(String nombre);
}
