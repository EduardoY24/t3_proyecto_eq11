package com.eq11.habitos.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.eq11.habitos.dto.AuthResponse;
import com.eq11.habitos.dto.LoginRequest;
import com.eq11.habitos.dto.RecuperarRequest;
import com.eq11.habitos.dto.RegisterRequest;
import com.eq11.habitos.dto.RestablecerRequest;
import com.eq11.habitos.exception.ReglaNegocioException;
import com.eq11.habitos.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registrar(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader(value = "Authorization", required = false) String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new ReglaNegocioException(HttpStatus.UNAUTHORIZED, "Falta el token");
        }
        authService.logout(header.substring(7));
        return ResponseEntity.ok(Map.of("mensaje", "Sesión cerrada"));
    }

    @PostMapping("/recuperar")
    public ResponseEntity<Map<String, String>> recuperar(@Valid @RequestBody RecuperarRequest request) {
        authService.recuperar(request);
        return ResponseEntity.ok(Map.of("mensaje", "Si el email existe, te enviamos un enlace para recuperar tu contraseña"));
    }

    @PostMapping("/restablecer")
    public ResponseEntity<Map<String, String>> restablecer(@Valid @RequestBody RestablecerRequest request) {
        authService.restablecer(request);
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada"));
    }
}
