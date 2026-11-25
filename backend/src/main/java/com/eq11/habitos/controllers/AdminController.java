package com.eq11.habitos.controllers;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.eq11.habitos.dto.CategoriaRequest;
import com.eq11.habitos.dto.CategoriaResponse;
import com.eq11.habitos.dto.UsuarioRequest;
import com.eq11.habitos.dto.UsuarioResponse;
import com.eq11.habitos.models.Usuario;
import com.eq11.habitos.service.CategoriaService;
import com.eq11.habitos.service.UsuarioService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UsuarioService usuarioService;
    private final CategoriaService categoriaService;

    @GetMapping("/usuarios")
    public ResponseEntity<Page<UsuarioResponse>> listarUsuarios(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) String rol,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(usuarioService.listar(busqueda, rol, pageable));
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioResponse> crearUsuario(@Valid @RequestBody UsuarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(request));
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioResponse> actualizarUsuario(@PathVariable Integer id,
                                                             @Valid @RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(usuarioService.actualizar(id, request));
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Map<String, String>> eliminarUsuario(@PathVariable Integer id,
                                                               @AuthenticationPrincipal Usuario actual) {
        usuarioService.eliminar(id, actual);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado"));
    }

    @PostMapping("/categorias")
    public ResponseEntity<CategoriaResponse> crearCategoria(@Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.crear(request));
    }

    @PutMapping("/categorias/{id}")
    public ResponseEntity<CategoriaResponse> actualizarCategoria(@PathVariable Integer id,
                                                                 @Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.actualizar(id, request));
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<Map<String, String>> eliminarCategoria(@PathVariable Integer id) {
        categoriaService.eliminar(id);
        return ResponseEntity.ok(Map.of("mensaje", "Categoría eliminada"));
    }
}
