package com.eq11.habitos.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.eq11.habitos.dto.HabitoRequest;
import com.eq11.habitos.dto.HabitoResponse;
import com.eq11.habitos.dto.Mapper;
import com.eq11.habitos.exception.NoEncontradoException;
import com.eq11.habitos.models.Habito;
import com.eq11.habitos.models.Usuario;
import com.eq11.habitos.repository.CategoriaRepository;
import com.eq11.habitos.repository.HabitoRepository;

@Service
@RequiredArgsConstructor
public class HabitoService {

    private final HabitoRepository habitoRepo;
    private final CategoriaRepository categoriaRepo;
    private final MensajeriaService mensajeriaService;

    @Transactional(readOnly = true)
    public Page<HabitoResponse> listar(Usuario actual, String busqueda, Integer categoriaId, Boolean activo, Pageable pageable) {
        Integer usuarioId = esAdmin(actual) ? null : actual.getId();
        return habitoRepo.buscar(usuarioId, limpiar(busqueda), activo, categoriaId, pageable).map(Mapper::habito);
    }

    @Transactional(readOnly = true)
    public Page<HabitoResponse> listarDeUsuario(Integer usuarioId, Pageable pageable) {
        return habitoRepo.buscar(usuarioId, null, null, null, pageable).map(Mapper::habito);
    }

    @Transactional(readOnly = true)
    public HabitoResponse obtener(Integer id, Usuario actual) {
        Habito habito = buscar(id);
        verificarAcceso(habito, actual);
        return Mapper.habito(habito);
    }

    @Transactional
    public HabitoResponse crear(HabitoRequest request, Usuario duenio) {
        Habito habito = new Habito();
        habito.setUsuario(duenio);
        llenar(habito, request);
        return Mapper.habito(habitoRepo.save(habito));
    }

    @Transactional
    public HabitoResponse actualizar(Integer id, HabitoRequest request, Usuario actual) {
        Habito habito = buscar(id);
        verificarAcceso(habito, actual);
        llenar(habito, request);
        return Mapper.habito(habito);
    }

    @Transactional
    public void eliminar(Integer id, Usuario actual) {
        Habito habito = buscar(id);
        verificarAcceso(habito, actual);
        habitoRepo.delete(habito);
    }

    @Transactional(readOnly = true)
    public boolean enviarRecordatorioWhatsapp(Integer id, Usuario actual) {
        Habito habito = buscar(id);
        verificarAcceso(habito, actual);
        Usuario duenio = habito.getUsuario();
        return mensajeriaService.enviarWhatsapp(duenio.getTelefono(),
                "Hábitos: hola " + duenio.getNombre() + ", no olvides cumplir tu hábito \"" + habito.getNombre() + "\" hoy.");
    }

    private Habito buscar(Integer id) {
        return habitoRepo.findConDetalleById(id)
                .orElseThrow(() -> new NoEncontradoException("No existe el hábito con id " + id));
    }

    private void llenar(Habito habito, HabitoRequest request) {
        habito.setNombre(request.nombre());
        habito.setDescripcion(request.descripcion());
        habito.setFrecuencia(request.frecuencia());
        habito.setActivo(request.activo());
        List<Integer> ids = request.categoriaIds() == null ? List.of() : request.categoriaIds();
        habito.setCategorias(new HashSet<>(categoriaRepo.findAllById(ids)));
    }

    private void verificarAcceso(Habito habito, Usuario actual) {
        Usuario duenio = habito.getUsuario();
        boolean esDuenio = duenio.getId().equals(actual.getId());
        boolean esSuCoach = duenio.getCoach() != null && duenio.getCoach().getId().equals(actual.getId());
        if (!esAdmin(actual) && !esDuenio && !esSuCoach) {
            throw new AccessDeniedException("No tienes permiso sobre este hábito");
        }
    }

    private boolean esAdmin(Usuario usuario) {
        return "ADMIN".equals(usuario.getRol().getNombre());
    }

    private String limpiar(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }
}
