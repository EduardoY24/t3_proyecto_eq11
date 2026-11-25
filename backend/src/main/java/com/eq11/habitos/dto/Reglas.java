package com.eq11.habitos.dto;

public final class Reglas {

    public static final String PASSWORD = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$";
    public static final String PASSWORD_OPCIONAL = "^$|^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$";
    public static final String MENSAJE_PASSWORD = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial";
    public static final String TELEFONO = "^\\+?[0-9]{10,15}$";

    private Reglas() {
    }
}
