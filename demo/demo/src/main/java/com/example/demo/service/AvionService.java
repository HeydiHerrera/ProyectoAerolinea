package com.example.demo.service;

import com.example.demo.model.Avion;
import com.example.demo.repository.AvionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AvionService {
    @Autowired private AvionRepository avionRepo;
    @Autowired private AsientoService asientoService;

    public Avion guardar(Avion avion) {
        Avion nuevo = avionRepo.save(avion);
        asientoService.generarAsientos(nuevo);
        return nuevo;
    }
}
