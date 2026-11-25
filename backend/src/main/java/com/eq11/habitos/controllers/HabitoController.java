package com.eq11.habitos.controllers;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.eq11.habitos.dto.HabitoRequest;
import com.eq11.habitos.dto.HabitoResponse;
import com.eq11.habitos.models.Usuario;
import com.eq11.habitos.service.HabitoService;

@RestController
@RequestMapping("/api/habitos")
@RequiredArgsConstructor
public class HabitoController {

    private final HabitoService habitoService;

    @GetMapping
    public ResponseEntity<Page<HabitoResponse>> listar(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) Integer categoriaId,
            @RequestParam(required = false) Boolean activo,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(habitoService.listar(usuario, busqueda, categoriaId, activo, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitoResponse> obtener(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(habitoService.obtener(id, usuario));
    }

    @PostMapping
    public ResponseEntity<HabitoResponse> crear(@Valid @RequestBody HabitoRequest request,
                                                @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(habitoService.crear(request, usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitoResponse> actualizar(@PathVariable Integer id,
                                                     @Valid @RequestBody HabitoRequest request,
                                                     @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(habitoService.actualizar(id, request, usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        habitoService.eliminar(id, usuario);
        return ResponseEntity.ok(Map.of("mensaje", "Hábito eliminado"));
    }

    @PostMapping("/{id}/recordatorio")
    public ResponseEntity<Map<String, Object>> recordatorio(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        boolean enviado = habitoService.enviarRecordatorioWhatsapp(id, usuario);
        return ResponseEntity.ok(Map.of("enviado", enviado));
    }
}
