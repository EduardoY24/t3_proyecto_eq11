package com.eq11.habitos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RestablecerRequest(
        @NotBlank(message = "El token es obligatorio")
        String token,

        @NotBlank(message = "La contraseña es obligatoria")
        @Pattern(regexp = Reglas.PASSWORD, message = Reglas.MENSAJE_PASSWORD)
        String password) {
}
