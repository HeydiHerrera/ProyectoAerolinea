package com.example.demo;

import com.example.demo.repository.VueloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class VueloScheduler {

    @Autowired private VueloRepository vueloRepo;

    @Scheduled(fixedRate = 60000) // Cada 60 segundos
    public void actualizarVuelosVencidos() {
        var vuelos = vueloRepo.findByEstado("PENDIENTE ABORDAR");
        for (var vuelo : vuelos) {
            if (vuelo.getFechaHoraSalida().isBefore(LocalDateTime.now())) {
                vuelo.setEstado("ABORDADO");
                vueloRepo.save(vuelo);
            }
        }
    }
}