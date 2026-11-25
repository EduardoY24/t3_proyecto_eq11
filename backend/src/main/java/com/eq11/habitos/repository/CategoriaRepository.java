package com.eq11.habitos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eq11.habitos.models.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    List<Categoria> findAllByOrderByNombre();

    boolean existsByNombre(String nombre);
}
