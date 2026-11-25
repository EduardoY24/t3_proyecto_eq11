package com.eq11.habitos.dto;

public record AuthResponse(String token, Integer id, String nombre, String email, String rol, String avatarUrl) {
}
