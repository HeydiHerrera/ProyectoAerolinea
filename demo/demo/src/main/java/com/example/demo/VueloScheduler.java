package com.example.demo;

import com.example.demo.model.Boleto;
import com.example.demo.repository.BoletoRepository;
import com.example.demo.repository.VueloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class VueloScheduler {

    @Autowired private VueloRepository vueloRepo;
    @Autowired private BoletoRepository boletoRepo;

    @Scheduled(fixedRate = 60000)
    public void actualizarEstadoVuelos() {
        LocalDateTime ahora = LocalDateTime.now();

        // Vuelos que ya salieron → EN VUELO y cancelar boletos pendientes
        var pendientes = vueloRepo.findByEstado("PENDIENTE ABORDAR");
        for (var vuelo : pendientes) {
            if (vuelo.getFechaHoraSalida().isBefore(ahora)) {
                List<Boleto> boletos = boletoRepo.findByVueloId(vuelo.getId());
                for (Boleto b : boletos) {
                    if (b.getEstado().equals("PENDIENTE ABORDAR")) {
                        b.setEstado("CANCELADO");
                        boletoRepo.save(b);
                    }
                }
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