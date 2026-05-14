package com.example.demo;

import com.example.demo.repository.VueloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class VueloScheduler {

    @Autowired private VueloRepository vueloRepo;

    @Scheduled(fixedRate = 60000)
    public void actualizarEstadoVuelos() {
        LocalDateTime ahora = LocalDateTime.now();

        // Vuelos que ya salieron pero aún no llegan → EN VUELO
        var pendientes = vueloRepo.findByEstado("PENDIENTE ABORDAR");
        for (var vuelo : pendientes) {
            if (vuelo.getFechaHoraSalida().isBefore(ahora)) {
                vuelo.setEstado("EN VUELO");
                vueloRepo.save(vuelo);
            }
        }

        // Vuelos que ya llegaron → ABORDADO
        var enVuelo = vueloRepo.findByEstado("EN VUELO");
        for (var vuelo : enVuelo) {
            if (vuelo.getFechaHoraLlegada().isBefore(ahora)) {
                vuelo.setEstado("ABORDADO");
                vueloRepo.save(vuelo);
            }
        }
    }
}