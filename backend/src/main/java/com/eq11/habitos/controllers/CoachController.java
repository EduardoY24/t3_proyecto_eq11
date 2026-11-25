package com.eq11.habitos.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.eq11.habitos.dto.HabitoRequest;
import com.eq11.habitos.dto.HabitoResponse;
import com.eq11.habitos.dto.UsuarioResponse;
import com.eq11.habitos.models.Usuario;
import com.eq11.habitos.service.UsuarioService;

@RestController
@RequestMapping("/api/coach")
@PreAuthorize("hasRole('COACH')")
@RequiredArgsConstructor
public class CoachController {

    private final UsuarioService usuarioService;

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponse>> misUsuarios(@AuthenticationPrincipal Usuario coach) {
        return ResponseEntity.ok(usuarioService.usuariosDeCoach(coach));
    }

    @GetMapping("/usuarios/{id}/habitos")
    public ResponseEntity<Page<HabitoResponse>> habitosDeUsuario(
            @PathVariable Integer id,
            @AuthenticationPrincipal Usuario coach,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(usuarioService.habitosDeUsuario(coach, id, pageable));
    }

    @PostMapping("/usuarios/{id}/habitos")
    public ResponseEntity<HabitoResponse> asignarHabito(@PathVariable Integer id,
                                                        @AuthenticationPrincipal Usuario coach,
                                                        @Valid @RequestBody HabitoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.asignarHabito(coach, id, request));
    }
}
