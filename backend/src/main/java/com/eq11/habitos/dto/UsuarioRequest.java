package com.eq11.habitos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre es demasiado largo")
        String nombre,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no es válido")
        String email,

        @Pattern(regexp = Reglas.PASSWORD_OPCIONAL, message = Reglas.MENSAJE_PASSWORD)
        String password,

        @Pattern(regexp = "^$|" + Reglas.TELEFONO, message = "El teléfono debe tener de 10 a 15 dígitos")
        String telefono,

        @NotBlank(message = "El rol es obligatorio")
        @Pattern(regexp = "ADMIN|COACH|USUARIO", message = "El rol debe ser ADMIN, COACH o USUARIO")
        String rol,

        @NotNull(message = "Indica si el usuario está activo")
        Boolean activo,

        Integer coachId) {
}
