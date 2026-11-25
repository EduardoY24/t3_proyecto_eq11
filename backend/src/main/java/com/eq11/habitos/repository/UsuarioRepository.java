package com.eq11.habitos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eq11.habitos.models.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    @EntityGraph(attributePaths = {"rol"})
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Integer id);

    @EntityGraph(attributePaths = {"rol", "coach"})
    @Query("""
        SELECT u FROM Usuario u
        WHERE (:busqueda IS NULL OR LOWER(u.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%'))
               OR LOWER(u.email) LIKE LOWER(CONCAT('%', :busqueda, '%')))
          AND (:rol IS NULL OR u.rol.nombre = :rol)
        """)
    Page<Usuario> buscar(@Param("busqueda") String busqueda, @Param("rol") String rol, Pageable pageable);

    @EntityGraph(attributePaths = {"rol", "coach"})
    List<Usuario> findByCoachIdOrderByNombre(Integer coachId);

    @EntityGraph(attributePaths = {"rol", "coach"})
    Optional<Usuario> findWithRolById(Integer id);
}
