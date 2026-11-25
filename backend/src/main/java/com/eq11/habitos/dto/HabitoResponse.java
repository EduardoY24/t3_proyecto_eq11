package com.eq11.habitos.dto;

import java.util.List;

public record HabitoResponse(
        Integer id,
        String nombre,
        String descripcion,
        String frecuencia,
        Boolean activo,
        List<CategoriaResponse> categorias,
        UsuarioResumen usuario) {
}
