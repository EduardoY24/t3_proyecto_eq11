package com.eq11.habitos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 50, message = "El nombre es demasiado largo")
        String nombre,

        @NotBlank(message = "El color es obligatorio")
        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "El color debe tener formato #RRGGBB")
        String color) {
}
