package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AbordajeService {

    @Autowired private VueloRepository vueloRepo;
    @Autowired private BoletoRepository boletoRepo;
    @Autowired private PasajeroRepository pasajeroRepo;

    public List<Vuelo> getVuelosPendientes() {
        return vueloRepo.findByEstado("PENDIENTE ABORDAR");
    }

    public String abordarPasajero(Long vueloId, String pasaporte, Integer maletas) {
        Optional<Boleto> boletoOpt = boletoRepo.findByVueloIdAndPasajeroPasaporte(vueloId, pasaporte);
        if (boletoOpt.isEmpty()) {
            return "El pasajero no se encuentra registrado en el vuelo";
        }
        Boleto boleto = boletoOpt.get();
        boleto.setEstado("ABORDADO");
        boleto.setCantidadMaletas(maletas);

        // Calcular recargo por maletas extras segun clase
        int maletasPermitidas = boleto.getClase().equals("EJECUTIVA") ? 2 : 1;
        if (maletas > maletasPermitidas) {
            double recargo = (maletas - maletasPermitidas) * 50.0;
            boleto.setRecargo(recargo);
            boletoRepo.save(boleto);
            return "RECARGO:" + recargo;
        }
        boleto.setRecargo(0.0);
        boletoRepo.save(boleto);
        return "OK";
    }

    public String finalizarAbordaje(Long vueloId) {
        List<Boleto> boletos = boletoRepo.findByVueloId(vueloId);
        for (Boleto b : boletos) {
            if (b.getEstado().equals("PENDIENTE")) {
                b.setEstado("CANCELADO");
                boletoRepo.save(b);
            }
        }
        Vuelo vuelo = vueloRepo.findById(vueloId).orElse(null);
        if (vuelo != null) {
            vuelo.setEstado("ABORDADO");
            vueloRepo.save(vuelo);
        }
        return "Se completo el abordaje";
    }
}
