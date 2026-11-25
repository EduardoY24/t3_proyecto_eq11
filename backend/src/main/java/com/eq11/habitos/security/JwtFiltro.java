package com.eq11.habitos.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import com.eq11.habitos.repository.TokenInvalidadoRepository;
import com.eq11.habitos.repository.UsuarioRepository;

@Component
@RequiredArgsConstructor
public class JwtFiltro extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepo;
    private final TokenInvalidadoRepository tokenInvalidadoRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String email = jwtService.leer(token).getSubject();
                if (!tokenInvalidadoRepo.existsByToken(token)) {
                    usuarioRepo.findByEmail(email)
                            .filter(u -> Boolean.TRUE.equals(u.getActivo()))
                            .ifPresent(u -> {
                                var autoridad = new SimpleGrantedAuthority("ROLE_" + u.getRol().getNombre());
                                var auth = new UsernamePasswordAuthenticationToken(u, token, List.of(autoridad));
                                SecurityContextHolder.getContext().setAuthentication(auth);
                            });
                }
            } catch (JwtException | IllegalArgumentException e) {
                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(request, response);
    }
}
