package com.example.demo.controller;

import java.util.List;
import com.example.demo.model.Tripulacion;
import com.example.demo.service.BitacoraService;
import com.example.demo.service.TripulacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/tripulacion")
@CrossOrigin(origins = "*")
public class TripulacionController {

    @Autowired private TripulacionService tripulacionService;
    @Autowired private BitacoraService bitacoraService;

    @GetMapping("/personal")
    public ResponseEntity<?> getPersonal() {
        Map<String, Object> response = new HashMap<>();
        response.put("pilotos", tripulacionService.getPilotos());
        response.put("copilotos", tripulacionService.getCopilotos());
        response.put("ingenieros", tripulacionService.getIngenieros());
        response.put("cabina", tripulacionService.getCabina());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/guardar")
    public ResponseEntity<?> guardar(@RequestBody Tripulacion tripulacion) {
        if (tripulacion.getPiloto() == null || tripulacion.getCopiloto() == null ||
                tripulacion.getIngeniero() == null || tripulacion.getCabina1() == null ||
                tripulacion.getCabina2() == null || tripulacion.getCabina3() == null) {
            return ResponseEntity.badRequest().body("Debe ingresar los campos obligatorios");
        }

        java.util.Set<Long> ids = new java.util.HashSet<>();
        if (!ids.add(tripulacion.getPiloto().getId())) return ResponseEntity.badRequest().body("No puede repetir personas en la tripulacion");
        if (!ids.add(tripulacion.getCopiloto().getId())) return ResponseEntity.badRequest().body("No puede repetir personas en la tripulacion");
        if (!ids.add(tripulacion.getIngeniero().getId())) return ResponseEntity.badRequest().body("No puede repetir personas en la tripulacion");
        if (!ids.add(tripulacion.getCabina1().getId())) return ResponseEntity.badRequest().body("No puede repetir personas en la tripulacion");
        if (!ids.add(tripulacion.getCabina2().getId())) return ResponseEntity.badRequest().body("No puede repetir personas en la tripulacion");
        if (!ids.add(tripulacion.getCabina3().getId())) return ResponseEntity.badRequest().body("No puede repetir personas en la tripulacion");

        List<Long> asignados = tripulacionService.getPersonalAsignado();
        for (Long id : ids) {
            if (asignados.contains(id)) {
                return ResponseEntity.badRequest().body("Una o mas personas ya estan asignadas a otra tripulacion");
            }
        }

        tripulacionService.guardar(tripulacion);
        bitacoraService.registrar("SISTEMA", "CREAR_TRIPULACION", "Se creo una nueva tripulacion");
        return ResponseEntity.ok("Se creo con exito la tripulacion");
    }
}