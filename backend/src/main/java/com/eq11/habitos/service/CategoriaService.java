package com.eq11.habitos.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.eq11.habitos.dto.CategoriaRequest;
import com.eq11.habitos.dto.CategoriaResponse;
import com.eq11.habitos.dto.Mapper;
import com.eq11.habitos.exception.NoEncontradoException;
import com.eq11.habitos.exception.ReglaNegocioException;
import com.eq11.habitos.models.Categoria;
import com.eq11.habitos.repository.CategoriaRepository;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepo;

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar() {
        return categoriaRepo.findAllByOrderByNombre().stream().map(Mapper::categoria).toList();
    }

    @Transactional
    public CategoriaResponse crear(CategoriaRequest request) {
        if (categoriaRepo.existsByNombre(request.nombre())) {
            throw new ReglaNegocioException(HttpStatus.BAD_REQUEST, "nombre", "Ya existe una categoría con ese nombre");
        }
        Categoria categoria = new Categoria();
        categoria.setNombre(request.nombre());
        categoria.setColor(request.color());
        return Mapper.categoria(categoriaRepo.save(categoria));
    }

    @Transactional
    public CategoriaResponse actualizar(Integer id, CategoriaRequest request) {
        Categoria categoria = buscar(id);
        categoria.setNombre(request.nombre());
        categoria.setColor(request.color());
        return Mapper.categoria(categoria);
    }

    @Transactional
    public void eliminar(Integer id) {
        categoriaRepo.delete(buscar(id));
    }

    private Categoria buscar(Integer id) {
        return categoriaRepo.findById(id)
                .orElseThrow(() -> new NoEncontradoException("No existe la categoría con id " + id));
    }
}
