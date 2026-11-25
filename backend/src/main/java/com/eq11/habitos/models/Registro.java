package com.eq11.habitos.models;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "registros")
@Getter
@Setter
@NoArgsConstructor
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate fecha;

    private Boolean cumplido;

    private String nota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habito_id")
    private Habito habito;
}
