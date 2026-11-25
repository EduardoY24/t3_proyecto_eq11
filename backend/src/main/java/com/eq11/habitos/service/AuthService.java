package com.eq11.habitos.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;

import com.eq11.habitos.dto.AuthResponse;
import com.eq11.habitos.dto.LoginRequest;
import com.eq11.habitos.dto.RecuperarRequest;
import com.eq11.habitos.dto.RegisterRequest;
import com.eq11.habitos.dto.RestablecerRequest;
import com.eq11.habitos.exception.ReglaNegocioException;
import com.eq11.habitos.models.TokenInvalidado;
import com.eq11.habitos.models.TokenRecuperacion;
import com.eq11.habitos.models.Usuario;
import com.eq11.habitos.repository.RolRepository;
import com.eq11.habitos.repository.TokenInvalidadoRepository;
import com.eq11.habitos.repository.TokenRecuperacionRepository;
import com.eq11.habitos.repository.UsuarioRepository;
import com.eq11.habitos.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepo;
    private final RolRepository rolRepo;
    private final TokenInvalidadoRepository tokenInvalidadoRepo;
    private final TokenRecuperacionRepository tokenRecuperacionRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CorreoService correoService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepo.findByEmail(request.email())
                .orElseThrow(() -> new ReglaNegocioException(HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new ReglaNegocioException(HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos");
        }
        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new ReglaNegocioException(HttpStatus.FORBIDDEN, "Tu cuenta está desactivada");
        }
        return respuesta(usuario);
    }

    @Transactional
    public AuthResponse registrar(RegisterRequest request) {
        if (usuarioRepo.existsByEmail(request.email())) {
            throw new ReglaNegocioException(HttpStatus.BAD_REQUEST, "email", "Ya existe una cuenta con ese email");
        }
        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setEmail(request.email());
        usuario.setTelefono(request.telefono());
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario.setRol(rolRepo.findByNombre("USUARIO").orElseThrow());
        usuarioRepo.save(usuario);

        correoService.enviar(usuario.getEmail(), "Bienvenido a Hábitos",
                "Hola " + usuario.getNombre() + ", tu cuenta en Hábitos se creó correctamente.");

        return respuesta(usuario);
    }

    @Transactional
    public void logout(String token) {
        try {
            TokenInvalidado invalidado = new TokenInvalidado();
            invalidado.setToken(token);
            invalidado.setExpira(jwtService.expiracion(token));
            tokenInvalidadoRepo.save(invalidado);
        } catch (JwtException | IllegalArgumentException e) {
            throw new ReglaNegocioException(HttpStatus.UNAUTHORIZED, "Token inválido");
        }
    }

    @Transactional
    public void recuperar(RecuperarRequest request) {
        usuarioRepo.findByEmail(request.email()).ifPresent(usuario -> {
            TokenRecuperacion recuperacion = new TokenRecuperacion();
            recuperacion.setToken(UUID.randomUUID().toString());
            recuperacion.setUsuario(usuario);
            recuperacion.setExpira(LocalDateTime.now().plusMinutes(30));
            tokenRecuperacionRepo.save(recuperacion);

            String enlace = frontendUrl + "/restablecer?token=" + recuperacion.getToken();
            correoService.enviar(usuario.getEmail(), "Recupera tu contraseña",
                    "Hola " + usuario.getNombre() + ", para crear una nueva contraseña entra a este enlace "
                    + "(vence en 30 minutos):\n\n" + enlace);
        });
    }

    @Transactional
    public void restablecer(RestablecerRequest request) {
        TokenRecuperacion recuperacion = tokenRecuperacionRepo.findByTokenAndUsadoFalse(request.token())
                .orElseThrow(() -> new ReglaNegocioException(HttpStatus.valueOf(422), "El enlace no es válido o ya se usó"));

        if (recuperacion.getExpira().isBefore(LocalDateTime.now())) {
            throw new ReglaNegocioException(HttpStatus.valueOf(422), "El enlace ya venció, solicita otro");
        }
        Usuario usuario = recuperacion.getUsuario();
        usuario.setPassword(passwordEncoder.encode(request.password()));
        recuperacion.setUsado(true);
    }

    private AuthResponse respuesta(Usuario usuario) {
        return new AuthResponse(
                jwtService.generarToken(usuario),
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol().getNombre(),
                usuario.getAvatarUrl());
    }
}
