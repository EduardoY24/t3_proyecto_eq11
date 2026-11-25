package com.eq11.habitos.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record HabitoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre es demasiado largo")
        String nombre,

        @Size(max = 255, message = "La descripción es demasiado larga")
        String descripcion,

        @NotBlank(message = "La frecuencia es obligatoria")
        @Pattern(regexp = "DIARIO|SEMANAL", message = "La frecuencia debe ser DIARIO o SEMANAL")
        String frecuencia,

        @NotNull(message = "Indica si el hábito está activo")
        Boolean activo,

        List<Integer> categoriaIds) {
}
