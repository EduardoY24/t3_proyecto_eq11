package com.eq11.habitos.dto;

public record UsuarioResponse(
        Integer id,
        String nombre,
        String email,
        String telefono,
        String rol,
        Boolean activo,
        UsuarioResumen coach,
        String avatarUrl) {
}
