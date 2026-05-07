package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.service.VueloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/vuelo")
@CrossOrigin(origins = "*")
public class VueloController {

    @Autowired
    private VueloService vueloService;

    @GetMapping("/datos")
    public ResponseEntity<?> getDatos() {
        Map<String, Object> response = new HashMap<>();
        response.put("aeropuertos", vueloService.getAeropuertos());
        response.put("aviones", vueloService.getAvionesActivos());
        response.put("tripulaciones", vueloService.getTripulaciones());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/guardar")
    public ResponseEntity<?> guardar(@RequestBody Vuelo vuelo) {
        if (vuelo.getAeropuertoSalida() == null || vuelo.getAeropuertoLlegada() == null ||
                vuelo.getFechaHoraSalida() == null || vuelo.getFechaHoraLlegada() == null ||
                vuelo.getAvion() == null || vuelo.getTripulacion() == null ||
                vuelo.getPrecioEconomica() == null || vuelo.getPrecioEjecutiva() == null) {
            return ResponseEntity.badRequest().body("Debe ingresar los campos obligatorios");
        }
        String resultado = vueloService.guardarVuelo(vuelo);
        if (!resultado.equals("OK")) {
            return ResponseEntity.badRequest().body(resultado);
        }
        return ResponseEntity.ok("Se creo con exito el vuelo");
    }
}
