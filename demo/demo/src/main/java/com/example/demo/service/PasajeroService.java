package com.example.demo.service;

import com.example.demo.model.Pasajero;
import com.example.demo.repository.PasajeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PasajeroService {

    @Autowired
    private PasajeroRepository repo;

    public boolean existePasaporte(String pasaporte) {
        return repo.findByPasaporte(pasaporte).isPresent();
    }

    public Pasajero guardar(Pasajero pasajero) {
        return repo.save(pasajero);
    }
    public Pasajero findByPasaporte(String pasaporte) {
        return repo.findByPasaporte(pasaporte).orElse(null);
    }
}