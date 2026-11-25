package com.eq11.habitos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre es demasiado largo")
        String nombre,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no es válido")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Pattern(regexp = Reglas.PASSWORD, message = Reglas.MENSAJE_PASSWORD)
        String password,

        @NotBlank(message = "El teléfono es obligatorio")
        @Pattern(regexp = Reglas.TELEFONO, message = "El teléfono debe tener de 10 a 15 dígitos")
        String telefono) {
}
