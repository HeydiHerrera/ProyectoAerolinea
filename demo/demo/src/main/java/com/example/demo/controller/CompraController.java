package com.example.demo.controller;
import com.example.demo.service.BitacoraService;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/compra")
@CrossOrigin(origins = "*")
public class CompraController {

    @Autowired private VueloRepository vueloRepo;
    @Autowired private PasajeroRepository pasajeroRepo;
    @Autowired private AsientoRepository asientoRepo;
    @Autowired private BoletoRepository boletoRepo;
    @Autowired private BitacoraService bitacoraService;
    @GetMapping("/vuelos-disponibles")
    public ResponseEntity<?> getVuelosDisponibles() {
        var vuelos = vueloRepo.findByEstado("PENDIENTE ABORDAR");
        if (vuelos.isEmpty()) {
            return ResponseEntity.status(404).body("No hay vuelos disponibles");
        }
        List<Map<String, Object>> resultado = new java.util.ArrayList<>();
        for (var vuelo : vuelos) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", vuelo.getId());
            item.put("numeroVuelo", vuelo.getNumeroVuelo());
            item.put("origen", vuelo.getAeropuertoSalida().getNombre());
            item.put("destino", vuelo.getAeropuertoLlegada().getNombre());
            item.put("fechaSalida", vuelo.getFechaHoraSalida());
            item.put("fechaLlegada", vuelo.getFechaHoraLlegada());
            item.put("precioEconomica", vuelo.getPrecioEconomica());
            item.put("precioEjecutiva", vuelo.getPrecioEjecutiva());
            item.put("modelo", vuelo.getAvion().getModelo());
            resultado.add(item);
        }

        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/comprar")
    public ResponseEntity<?> comprar(@RequestBody Map<String, Object> body) {
        try {
            String numeroVuelo = body.get("numeroVuelo").toString();
            String pasaporte = body.get("pasaporte").toString();
            Long asientoId = Long.valueOf(body.get("asientoId").toString());
            String metodoPago = body.get("metodoPago").toString();

            var vuelo = vueloRepo.findByNumeroVuelo(numeroVuelo);
            if (vuelo == null) {
                return ResponseEntity.badRequest().body("Vuelo no encontrado");
            }

            var pasajeroOpt = pasajeroRepo.findByPasaporte(pasaporte);
            if (pasajeroOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Pasajero no encontrado");
            }

            var asientoOpt = asientoRepo.findByIdAndEstado(asientoId, "DISPONIBLE");
            if (asientoOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("El asiento ya se encuentra ocupado");
            }

            var existeBoleto = boletoRepo.findByVueloIdAndPasajeroPasaporte(vuelo.getId(), pasaporte);
            if (existeBoleto.isPresent()) {
                return ResponseEntity.badRequest().body("Ya tiene un boleto para este vuelo");
            }

            Asiento asiento = asientoOpt.get();
            Pasajero pasajero = pasajeroOpt.get();

            double precio = asiento.getClase().equals("EJECUTIVA") ? vuelo.getPrecioEjecutiva() : vuelo.getPrecioEconomica();

            Boleto boleto = new Boleto();
            boleto.setVuelo(vuelo);
            boleto.setPasajero(pasajero);
            boleto.setAsiento(asiento);
            boleto.setClase(asiento.getClase());
            boleto.setPrecio(precio);
            boleto.setEstado("PENDIENTE ABORDAR");
            boleto.setCantidadMaletas(0);
            boleto.setRecargo(0.0);
            boletoRepo.save(boleto);

            asiento.setEstado("OCUPADO");
            asientoRepo.save(asiento);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Boleto comprado exitosamente");
            respuesta.put("numeroVuelo", vuelo.getNumeroVuelo());
            respuesta.put("asiento", asiento.getNumero());
            respuesta.put("clase", asiento.getClase());
            respuesta.put("precio", precio);
            respuesta.put("metodoPago", metodoPago);
            bitacoraService.registrar(pasaporte, "COMPRA_BOLETO", "Compro boleto para vuelo " + vuelo.getNumeroVuelo() + " asiento " + asiento.getNumero() + " clase " + asiento.getClase());
            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar la compra");
        }
    }
}