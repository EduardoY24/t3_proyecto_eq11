package com.eq11.habitos.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class ReglaNegocioException extends RuntimeException {

    private final HttpStatus estado;
    private final String campo;

    public ReglaNegocioException(HttpStatus estado, String campo, String mensaje) {
        super(mensaje);
        this.estado = estado;
        this.campo = campo;
    }

    public ReglaNegocioException(HttpStatus estado, String mensaje) {
        this(estado, null, mensaje);
    }
}
