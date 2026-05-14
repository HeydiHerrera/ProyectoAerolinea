package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora")
public class Bitacora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fechaHora;
    private String usuario;
    private String accion;

    @Column(columnDefinition = "TEXT")
    private String detalle;

    public Bitacora() {}

    public Bitacora(String usuario, String accion, String detalle) {
        this.fechaHora = LocalDateTime.now(java.time.ZoneId.of("America/Guatemala"));
        this.usuario = usuario;
        this.accion = accion;
        this.detalle = detalle;
    }

    public Long getId() { return id; }
    public LocalDateTime getFechaHora() { return fechaHora; }
    public String getUsuario() { return usuario; }
    public String getAccion() { return accion; }
    public String getDetalle() { return detalle; }
    public void setId(Long id) { this.id = id; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public void setAccion(String accion) { this.accion = accion; }
    public void setDetalle(String detalle) { this.detalle = detalle; }
}