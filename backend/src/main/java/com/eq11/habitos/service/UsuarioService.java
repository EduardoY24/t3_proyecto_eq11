package com.eq11.habitos.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.eq11.habitos.dto.HabitoRequest;
import com.eq11.habitos.dto.HabitoResponse;
import com.eq11.habitos.dto.Mapper;
import com.eq11.habitos.dto.UsuarioRequest;
import com.eq11.habitos.dto.UsuarioResponse;
import com.eq11.habitos.exception.NoEncontradoException;
import com.eq11.habitos.exception.ReglaNegocioException;
import com.eq11.habitos.models.Usuario;
import com.eq11.habitos.repository.RolRepository;
import com.eq11.habitos.repository.UsuarioRepository;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepo;
    private final RolRepository rolRepo;
    private final PasswordEncoder passwordEncoder;
    private final HabitoService habitoService;
    private final MensajeriaService mensajeriaService;

    @Transactional(readOnly = true)
    public Page<UsuarioResponse> listar(String busqueda, String rol, Pageable pageable) {
        return usuarioRepo.buscar(limpiar(busqueda), limpiar(rol), pageable).map(Mapper::usuario);
    }

    @Transactional
    public UsuarioResponse crear(UsuarioRequest request) {
        if (usuarioRepo.existsByEmail(request.email())) {
            throw new ReglaNegocioException(HttpStatus.BAD_REQUEST, "email", "Ya existe una cuenta con ese email");
        }
        if (request.password() == null || request.password().isBlank()) {
            throw new ReglaNegocioException(HttpStatus.BAD_REQUEST, "password", "La contraseña es obligatoria");
        }
        Usuario usuario = new Usuario();
        llenar(usuario, request);
        usuario.setPassword(passwordEncoder.encode(request.password()));
        return Mapper.usuario(usuarioRepo.save(usuario));
    }

    @Transactional
    public UsuarioResponse actualizar(Integer id, UsuarioRequest request) {
        Usuario usuario = buscar(id);
        if (usuarioRepo.existsByEmailAndIdNot(request.email(), id)) {
            throw new ReglaNegocioException(HttpStatus.BAD_REQUEST, "email", "Ya existe una cuenta con ese email");
        }
        llenar(usuario, request);
        if (request.password() != null && !request.password().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(request.password()));
        }
        return Mapper.usuario(usuario);
    }

    @Transactional
    public void eliminar(Integer id, Usuario actual) {
        if (id.equals(actual.getId())) {
            throw new ReglaNegocioException(HttpStatus.valueOf(422), "No puedes eliminar tu propia cuenta");
        }
        usuarioRepo.delete(buscar(id));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> usuariosDeCoach(Usuario coach) {
        return usuarioRepo.findByCoachIdOrderByNombre(coach.getId()).stream().map(Mapper::usuario).toList();
    }

    @Transactional(readOnly = true)
    public Page<HabitoResponse> habitosDeUsuario(Usuario coach, Integer usuarioId, Pageable pageable) {
        verificarQueEsSuUsuario(coach, buscar(usuarioId));
        return habitoService.listarDeUsuario(usuarioId, pageable);
    }

    @Transactional
    public HabitoResponse asignarHabito(Usuario coach, Integer usuarioId, HabitoRequest request) {
        Usuario usuario = buscar(usuarioId);
        verificarQueEsSuUsuario(coach, usuario);
        HabitoResponse habito = habitoService.crear(request, usuario);
        mensajeriaService.enviarSms(usuario.getTelefono(),
                "Hábitos: tu coach " + coach.getNombre() + " te asignó el hábito \"" + habito.nombre() + "\".");
        return habito;
    }

    private void verificarQueEsSuUsuario(Usuario coach, Usuario usuario) {
        if (usuario.getCoach() == null || !usuario.getCoach().getId().equals(coach.getId())) {
            throw new AccessDeniedException("Ese usuario no está asignado a ti");
        }
    }

    private void llenar(Usuario usuario, UsuarioRequest request) {
        usuario.setNombre(request.nombre());
        usuario.setEmail(request.email());
        usuario.setTelefono(limpiar(request.telefono()));
        usuario.setActivo(request.activo());
        usuario.setRol(rolRepo.findByNombre(request.rol())
                .orElseThrow(() -> new ReglaNegocioException(HttpStatus.BAD_REQUEST, "rol", "El rol no existe")));
        if (request.coachId() == null) {
            usuario.setCoach(null);
        } else {
            Usuario coach = buscar(request.coachId());
            if (!"COACH".equals(coach.getRol().getNombre())) {
                throw new ReglaNegocioException(HttpStatus.BAD_REQUEST, "coachId", "El usuario elegido no es coach");
            }
            usuario.setCoach(coach);
        }
    }

    private Usuario buscar(Integer id) {
        return usuarioRepo.findWithRolById(id)
                .orElseThrow(() -> new NoEncontradoException("No existe el usuario con id " + id));
    }

    private String limpiar(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }
}
