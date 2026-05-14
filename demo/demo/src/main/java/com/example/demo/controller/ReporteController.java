package com.example.demo.controller;

import com.example.demo.repository.AerolineaRepository;
import com.example.demo.repository.AvionRepository;
import com.example.demo.repository.BoletoRepository;
import com.example.demo.repository.VueloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.example.demo.repository.AeropuertoRepository;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/reporte")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired private AerolineaRepository aerolineaRepo;
    @Autowired private AvionRepository avionRepo;
    @Autowired private VueloRepository vueloRepo;
    @Autowired private BoletoRepository boletoRepo;

    @GetMapping("/aerolineas")
    public ResponseEntity<?> getAerolineas() {
        return ResponseEntity.ok(aerolineaRepo.findAll());
    }

    @GetMapping("/aviones/{aerolineaId}")
    public ResponseEntity<?> getAviones(@PathVariable Long aerolineaId) {
        var aviones = avionRepo.findByAerolineaId(aerolineaId);
        if (aviones.isEmpty()) {
            return ResponseEntity.status(404).body("La aerolinea consultada no tiene aviones");
        }
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (var avion : aviones) {
            Map<String, Object> item = new HashMap<>();
            item.put("modelo", avion.getModelo());
            item.put("marca", avion.getMarca());
            item.put("anio", avion.getAnio());
            item.put("capacidad", avion.getCapacidad());
            item.put("cantidadVuelos", vueloRepo.countByAvionId(avion.getId()));
            resultado.add(item);
        }
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/vuelos")
    public ResponseEntity<?> getVuelos() {
        return ResponseEntity.ok(vueloRepo.findAll());
    }

    @GetMapping("/pasajeros/{numeroVuelo}")
    public ResponseEntity<?> getPasajerosPorVuelo(@PathVariable String numeroVuelo) {
        var vuelo = vueloRepo.findByNumeroVuelo(numeroVuelo);
        if (vuelo == null) {
            return ResponseEntity.status(404).body("El numero de vuelo ingresado no existe.");
        }
        var boletos = boletoRepo.findByVueloId(vuelo.getId());
        if (boletos.isEmpty()) {
            return ResponseEntity.status(404).body("El numero de vuelo ingresado no existe.");
        }
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (var boleto : boletos) {
            Map<String, Object> item = new HashMap<>();
            item.put("nombre", boleto.getPasajero().getNombre());
            item.put("pasaporte", boleto.getPasajero().getPasaporte());
            item.put("nacionalidad", boleto.getPasajero().getNacionalidad());
            item.put("telefono", boleto.getPasajero().getTelefono());
            item.put("correo", boleto.getPasajero().getCorreo());
            resultado.add(item);
        }
        return ResponseEntity.ok(resultado);
    }
    @GetMapping("/equipaje/{numeroVuelo}")
    public ResponseEntity<?> getEquipajePorVuelo(@PathVariable String numeroVuelo) {
        var vuelo = vueloRepo.findByNumeroVuelo(numeroVuelo);
        if (vuelo == null) {
            return ResponseEntity.status(404).body("El numero de vuelo ingresado no existe.");
        }
        var boletos = boletoRepo.findByVueloId(vuelo.getId());
        if (boletos.isEmpty()) {
            return ResponseEntity.status(404).body("El numero de vuelo ingresado no existe.");
        }
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (var boleto : boletos) {
            Map<String, Object> item = new HashMap<>();
            item.put("nombre", boleto.getPasajero().getNombre());
            item.put("maletas", boleto.getCantidadMaletas());
            item.put("recargo", boleto.getRecargo());
            resultado.add(item);
        }
        return ResponseEntity.ok(resultado);
    }
    @GetMapping("/destinos/{aerolineaId}")
    public ResponseEntity<?> getDestinosPorAerolinea(@PathVariable Long aerolineaId) {
        var vuelos = vueloRepo.findByAvionAerolineaId(aerolineaId);
        if (vuelos.isEmpty()) {
            return ResponseEntity.status(404).body("La aerolinea consultada no tiene destinos autorizados");
        }
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (var vuelo : vuelos) {
            Map<String, Object> item = new HashMap<>();
            item.put("aeropuerto", vuelo.getAeropuertoLlegada().getNombre());
            item.put("pais", vuelo.getAeropuertoLlegada().getPais());
            item.put("ciudad", vuelo.getAeropuertoLlegada().getCiudad());
            resultado.add(item);
        }
        return ResponseEntity.ok(resultado);
    }
    @Autowired private AeropuertoRepository aeropuertoRepo;

    @GetMapping("/aeropuertos")
    public ResponseEntity<?> getAeropuertos() {
        return ResponseEntity.ok(aeropuertoRepo.findAll());
    }

    @GetMapping("/aerolineas-por-aeropuerto/{aeropuertoId}")
    public ResponseEntity<?> getAerolineasPorAeropuerto(@PathVariable Long aeropuertoId) {
        var vuelos = vueloRepo.findByAeropuertoSalidaId(aeropuertoId);
        if (vuelos.isEmpty()) {
            return ResponseEntity.status(404).body("El aeropuerto consultado no tiene aerolineas");
        }
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (var vuelo : vuelos) {
            Map<String, Object> item = new HashMap<>();
            item.put("aerolinea", vuelo.getAvion().getAerolinea().getNombre());
            item.put("cantidadAviones", avionRepo.countByAerolineaId(vuelo.getAvion().getAerolinea().getId()));
            item.put("destinos", vueloRepo.countByAvionAerolineaId(vuelo.getAvion().getAerolinea().getId()));
            resultado.add(item);
        }
        return ResponseEntity.ok(resultado);
    }
    @GetMapping("/vuelos-por-fecha")
    public ResponseEntity<?> getVuelosPorFecha(
            @RequestParam String fechaDesde,
            @RequestParam String horaDesde,
            @RequestParam String fechaHasta,
            @RequestParam String horaHasta) {

        try {
            LocalDateTime desde = LocalDateTime.parse(fechaDesde + "T" + horaDesde);
            LocalDateTime hasta = LocalDateTime.parse(fechaHasta + "T" + horaHasta);

            if (hasta.isBefore(desde)) {
                return ResponseEntity.badRequest().body("La fecha y hora hasta debe ser mayor a la fecha y hora desde");
            }

            long dias = java.time.Duration.between(desde, hasta).toDays();
            if (dias > 30) {
                return ResponseEntity.badRequest().body("El rango maximo de consulta es de 30 dias");
            }

            var vuelos = vueloRepo.findByFechaHoraSalidaBetween(desde, hasta);
            if (vuelos.isEmpty()) {
                return ResponseEntity.status(404).body("No se encontraron vuelos en ese rango de fechas");
            }

            List<Map<String, Object>> resultado = new ArrayList<>();
            for (var vuelo : vuelos) {
                Map<String, Object> item = new HashMap<>();
                item.put("numeroVuelo", vuelo.getNumeroVuelo());
                item.put("modelo", vuelo.getAvion().getModelo());
                item.put("aerolinea", vuelo.getAvion().getAerolinea().getNombre());
                item.put("origen", vuelo.getAeropuertoSalida().getNombre());
                item.put("destino", vuelo.getAeropuertoLlegada().getNombre());
                item.put("fechaSalida", vuelo.getFechaHoraSalida());
                item.put("fechaLlegada", vuelo.getFechaHoraLlegada());
                resultado.add(item);
            }
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Formato de fecha invalido");
        }
    }
    @GetMapping("/consulta-vuelo/{numeroVuelo}")
    public ResponseEntity<?> consultarVuelo(@PathVariable String numeroVuelo) {
        var vuelo = vueloRepo.findByNumeroVuelo(numeroVuelo);
        if (vuelo == null) {
            return ResponseEntity.status(404).body("El numero de vuelo ingresado no se encontro");
        }
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("numeroVuelo", vuelo.getNumeroVuelo());
        resultado.put("modelo", vuelo.getAvion().getModelo());
        resultado.put("aerolinea", vuelo.getAvion().getAerolinea().getNombre());
        resultado.put("origen", vuelo.getAeropuertoSalida().getNombre());
        resultado.put("destino", vuelo.getAeropuertoLlegada().getNombre());
        resultado.put("fechaSalida", vuelo.getFechaHoraSalida());
        resultado.put("fechaLlegada", vuelo.getFechaHoraLlegada());
        resultado.put("estado", vuelo.getEstado());
        return ResponseEntity.ok(resultado);
    }
    @Autowired private com.example.demo.repository.AsientoRepository asientoRepo;

@GetMapping("/asientos/{numeroVuelo}")
public ResponseEntity<?> getAsientosPorVuelo(@PathVariable String numeroVuelo) {
    var vuelo = vueloRepo.findByNumeroVuelo(numeroVuelo);
    if (vuelo == null) {
        return ResponseEntity.status(404).body("El numero de vuelo ingresado no se encontro");
    }
    var asientos = asientoRepo.findByAvionId(vuelo.getAvion().getId());
    return ResponseEntity.ok(asientos);
}
}
