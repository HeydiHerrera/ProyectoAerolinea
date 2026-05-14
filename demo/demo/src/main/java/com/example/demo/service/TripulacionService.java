package com.example.demo.service;

import com.example.demo.model.Personal;
import com.example.demo.model.Tripulacion;
import com.example.demo.repository.PersonalRepository;
import com.example.demo.repository.TripulacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripulacionService {
    @Autowired private PersonalRepository personalRepo;
    @Autowired private TripulacionRepository tripulacionRepo;

    public List<Personal> getPilotos() {
        List<Long> asignados = tripulacionRepo.findPilotosAsignados();
        return personalRepo.findByCargo("PILOTO").stream()
                .filter(p -> !asignados.contains(p.getId()))
                .collect(Collectors.toList());
    }

    public List<Personal> getCopilotos() {
        List<Long> asignados = tripulacionRepo.findCopilotosAsignados();
        return personalRepo.findByCargo("COPILOTO").stream()
                .filter(p -> !asignados.contains(p.getId()))
                .collect(Collectors.toList());
    }

    public List<Personal> getIngenieros() {
        List<Long> asignados = tripulacionRepo.findIngenieroAsignados();
        return personalRepo.findByCargo("INGENIERO").stream()
                .filter(p -> !asignados.contains(p.getId()))
                .collect(Collectors.toList());
    }

    public List<Personal> getCabina() {
        List<Long> asignados = tripulacionRepo.findCabinaAsignados();
        return personalRepo.findByCargo("CABINA").stream()
                .filter(p -> !asignados.contains(p.getId()))
                .collect(Collectors.toList());
    }

    public Tripulacion guardar(Tripulacion tripulacion) {
        return tripulacionRepo.save(tripulacion);
    }
}