package com.example.demo.model;
import jakarta.persistence.*;

@Entity
@Table(name = "boleto")
public class Boleto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vuelo_id")
    private Vuelo vuelo;

    @ManyToOne
    @JoinColumn(name = "pasajero_id")
    private Pasajero pasajero;

    @ManyToOne
    @JoinColumn(name = "asiento_id")
    private Asiento asiento;

    private String clase;
    private Double precio;
    private String estado;
    private Integer cantidadMaletas;
    private Double recargo;

    public Long getId() { return id; }
    public Vuelo getVuelo() { return vuelo; }
    public void setVuelo(Vuelo vuelo) { this.vuelo = vuelo; }
    public Pasajero getPasajero() { return pasajero; }
    public void setPasajero(Pasajero pasajero) { this.pasajero = pasajero; }
    public Asiento getAsiento() { return asiento; }
    public void setAsiento(Asiento asiento) { this.asiento = asiento; }
    public String getClase() { return clase; }
    public void setClase(String clase) { this.clase = clase; }
    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Integer getCantidadMaletas() { return cantidadMaletas; }
    public void setCantidadMaletas(Integer cantidadMaletas) { this.cantidadMaletas = cantidadMaletas; }
    public Double getRecargo() { return recargo; }
    public void setRecargo(Double recargo) { this.recargo = recargo; }
}