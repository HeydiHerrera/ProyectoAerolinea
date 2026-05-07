package com.example.demo.service;

import com.example.demo.model.Personal;
import com.example.demo.model.Tripulacion;
import com.example.demo.repository.PersonalRepository;
import com.example.demo.repository.TripulacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TripulacionService {

    @Autowired
    private PersonalRepository personalRepo;

    @Autowired
    private TripulacionRepository tripulacionRepo;

    public List<Personal> getPilotos() {
        return personalRepo.findByCargo("PILOTO");
    }

    public List<Personal> getCopilotos() {
        return personalRepo.findByCargo("COPILOTO");
    }

    public List<Personal> getIngenieros() {
        return personalRepo.findByCargo("INGENIERO");
    }

    public List<Personal> getCabina() {
        return personalRepo.findByCargo("CABINA");
    }

    public Tripulacion guardar(Tripulacion tripulacion) {
        return tripulacionRepo.save(tripulacion);
    }
}