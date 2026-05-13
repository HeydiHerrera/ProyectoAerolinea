package com.example.demo.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vuelo")
public class Vuelo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numeroVuelo;

    @ManyToOne
    @JoinColumn(name = "aeropuerto_salida_id")
    private Aeropuerto aeropuertoSalida;

    @ManyToOne
    @JoinColumn(name = "aeropuerto_llegada_id")
    private Aeropuerto aeropuertoLlegada;

    private LocalDateTime fechaHoraSalida;
    private LocalDateTime fechaHoraLlegada;

    @ManyToOne
    @JoinColumn(name = "avion_id")
    private Avion avion;

    @ManyToOne
    @JoinColumn(name = "tripulacion_id")
    private Tripulacion tripulacion;

    private Double precioEconomica;
    private Double precioEjecutiva;
    private String estado;

    public Long getId() { return id; }
    public String getNumeroVuelo() { return numeroVuelo; }
    public void setNumeroVuelo(String n) { this.numeroVuelo = n; }
    public Aeropuerto getAeropuertoSalida() { return aeropuertoSalida; }
    public void setAeropuertoSalida(Aeropuerto a) { this.aeropuertoSalida = a; }
    public Aeropuerto getAeropuertoLlegada() { return aeropuertoLlegada; }
    public void setAeropuertoLlegada(Aeropuerto a) { this.aeropuertoLlegada = a; }
    public LocalDateTime getFechaHoraSalida() { return fechaHoraSalida; }
    public void setFechaHoraSalida(LocalDateTime f) { this.fechaHoraSalida = f; }
    public LocalDateTime getFechaHoraLlegada() { return fechaHoraLlegada; }
    public void setFechaHoraLlegada(LocalDateTime f) { this.fechaHoraLlegada = f; }
    public Avion getAvion() { return avion; }
    public void setAvion(Avion avion) { this.avion = avion; }
    public Tripulacion getTripulacion() { return tripulacion; }
    public void setTripulacion(Tripulacion t) { this.tripulacion = t; }
    public Double getPrecioEconomica() { return precioEconomica; }
    public void setPrecioEconomica(Double p) { this.precioEconomica = p; }
    public Double getPrecioEjecutiva() { return precioEjecutiva; }
    public void setPrecioEjecutiva(Double p) { this.precioEjecutiva = p; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}