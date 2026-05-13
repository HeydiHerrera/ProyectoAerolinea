package com.example.demo.controller;

import com.example.demo.service.AbordajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/abordaje")
@CrossOrigin(origins = "*")
public class AbordajeController {

    @Autowired private AbordajeService abordajeService;

    @GetMapping("/vuelos")
    public ResponseEntity<?> getVuelos() {
        return ResponseEntity.ok(abordajeService.getVuelosPendientes());
    }

    @PostMapping("/abordar")
    public ResponseEntity<?> abordar(@RequestBody Map<String, Object> body) {
        Long vueloId = Long.valueOf(body.get("vueloId").toString());
        String pasaporte = body.get("pasaporte").toString();
        Integer maletas = Integer.valueOf(body.get("maletas").toString());

        if (pasaporte.isEmpty()) {
            return ResponseEntity.badRequest().body("Debe ingresar los campos obligatorios");
        }

        String resultado = abordajeService.abordarPasajero(vueloId, pasaporte, maletas);

        if (resultado.equals("OK")) {
            return ResponseEntity.ok("Pasajero abordado exitosamente");
        } else if (resultado.startsWith("RECARGO:")) {
            double recargo = Double.parseDouble(resultado.split(":")[1]);
            return ResponseEntity.ok("Se agrego " + recargo + "$ por recargo de equipaje");
        } else {
            return ResponseEntity.badRequest().body(resultado);
        }
    }

    @PostMapping("/finalizar/{vueloId}")
    public ResponseEntity<?> finalizar(@PathVariable Long vueloId) {
        return ResponseEntity.ok(abordajeService.finalizarAbordaje(vueloId));
    }
}