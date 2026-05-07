package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "asiento")
public class Asiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numero;
    private String clase;
    private String estado;

    @ManyToOne
    @JoinColumn(name = "avion_id")
    private Avion avion;

    public Long getId() { return id; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getClase() { return clase; }
    public void setClase(String clase) { this.clase = clase; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Avion getAvion() { return avion; }
    public void setAvion(Avion avion) { this.avion = avion; }
}