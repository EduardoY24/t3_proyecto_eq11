package com.eq11.habitos.dto;

import java.util.Comparator;

import com.eq11.habitos.models.Categoria;
import com.eq11.habitos.models.Habito;
import com.eq11.habitos.models.Usuario;

public final class Mapper {

    private Mapper() {
    }

    public static CategoriaResponse categoria(Categoria c) {
        return new CategoriaResponse(c.getId(), c.getNombre(), c.getColor());
    }

    public static HabitoResponse habito(Habito h) {
        return new HabitoResponse(
                h.getId(),
                h.getNombre(),
                h.getDescripcion(),
                h.getFrecuencia(),
                h.getActivo(),
                h.getCategorias().stream()
                        .sorted(Comparator.comparing(Categoria::getNombre))
                        .map(Mapper::categoria)
                        .toList(),
                new UsuarioResumen(h.getUsuario().getId(), h.getUsuario().getNombre()));
    }

    public static UsuarioResponse usuario(Usuario u) {
        UsuarioResumen coach = u.getCoach() == null ? null
                : new UsuarioResumen(u.getCoach().getId(), u.getCoach().getNombre());
        return new UsuarioResponse(
                u.getId(),
                u.getNombre(),
                u.getEmail(),
                u.getTelefono(),
                u.getRol().getNombre(),
                u.getActivo(),
                coach,
                u.getAvatarUrl());
    }
}
