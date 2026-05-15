package com.example.demo.service;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

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
        if (boleto.getEstado().equals("ABORDADO")) {
            return "El pasajero ya ha abordado el vuelo";
        }
        boleto.setEstado("ABORDADO");
        boleto.setCantidadMaletas(maletas);

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
        Vuelo vuelo = vueloRepo.findById(vueloId).orElse(null);
        if (vuelo == null) {
            return "Vuelo no encontrado";
        }
        if (vuelo.getFechaHoraSalida().isAfter(LocalDateTime.now(java.time.ZoneId.of("America/Guatemala")))) {
            return "No se puede finalizar el abordaje antes de la hora de salida";
        }
        List<Boleto> boletos = boletoRepo.findByVueloId(vueloId);
        for (Boleto b : boletos) {
            if (b.getEstado().equals("PENDIENTE ABORDAR")) {
                b.setEstado("CANCELADO");
                boletoRepo.save(b);
            }
        }
        vuelo.setEstado("EN VUELO");
        vueloRepo.save(vuelo);
        return "Se completo el abordaje";
    }
}