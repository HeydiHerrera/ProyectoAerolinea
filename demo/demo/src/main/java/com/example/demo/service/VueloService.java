package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VueloService {

    @Autowired private AeropuertoRepository aeropuertoRepo;
    @Autowired private AvionRepository avionRepo;
    @Autowired private TripulacionRepository tripulacionRepo;
    @Autowired private VueloRepository vueloRepo;

    public List<Aeropuerto> getAeropuertos() {
        return aeropuertoRepo.findAll();
    }

    public List<Avion> getAvionesActivos() {
        return avionRepo.findByEstado("Activo");
    }

    public List<Tripulacion> getTripulaciones() {
        return tripulacionRepo.findAll();
    }

    public String guardarVuelo(Vuelo vuelo) {
        if (vuelo.getFechaHoraSalida().isBefore(LocalDateTime.now().plusHours(5))) {
            return "Tiempo minimo para la preparacion 5 horas a partir de la hora actual.";
        }
        if (vuelo.getAeropuertoSalida().getId().equals(vuelo.getAeropuertoLlegada().getId())) {
            return "No se puede seleccionar el mismo aeropuerto de salida y llegada.";
        }
        if (!vuelo.getFechaHoraLlegada().isAfter(vuelo.getFechaHoraSalida())) {
            return "La fecha y hora de llegada debe ser mayor a la fecha y hora de salida.";
        }
        vuelo.setEstado("PENDIENTE");
        vueloRepo.save(vuelo);
        return "OK";
    }
}