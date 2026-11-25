package com.eq11.habitos.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eq11.habitos.models.Habito;

public interface HabitoRepository extends JpaRepository<Habito, Integer> {

    @EntityGraph(attributePaths = {"usuario"})
    @Query("""
        SELECT h FROM Habito h
        WHERE (:usuarioId IS NULL OR h.usuario.id = :usuarioId)
          AND (:busqueda IS NULL OR LOWER(h.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')))
          AND (:activo IS NULL OR h.activo = :activo)
          AND (:categoriaId IS NULL OR EXISTS (
                SELECT c FROM h.categorias c WHERE c.id = :categoriaId))
        """)
    Page<Habito> buscar(@Param("usuarioId") Integer usuarioId,
                        @Param("busqueda") String busqueda,
                        @Param("activo") Boolean activo,
                        @Param("categoriaId") Integer categoriaId,
                        Pageable pageable);

    @EntityGraph(attributePaths = {"usuario", "categorias"})
    Optional<Habito> findConDetalleById(Integer id);
}
