package com.example.demo.controller;

import com.example.demo.model.Personal;
import com.example.demo.model.Tripulacion;
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

    @Autowired
    private TripulacionService tripulacionService;

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
        tripulacionService.guardar(tripulacion);
        return ResponseEntity.ok("Se creo con exito la tripulacion");
    }
}