package com.example.demo.controller;

import com.example.demo.model.Avion;
import com.example.demo.model.Aerolinea;
import com.example.demo.repository.AerolineaRepository;
import com.example.demo.service.AvionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/avion")
@CrossOrigin(origins = "*")
public class AvionController {
    @Autowired private AvionService avionService;
    @Autowired private AerolineaRepository aerolineaRepo;

    @GetMapping("/aerolineas")
    public ResponseEntity<List<Aerolinea>> getAerolineas() {
        return ResponseEntity.ok(aerolineaRepo.findAll());
    }

    @PostMapping("/guardar")
    public ResponseEntity<?> guardar(@RequestBody Avion avion) {
        if (avion.getModelo() == null || avion.getMarca() == null ||
                avion.getAnio() == null || avion.getCapacidad() == null ||
                avion.getAerolinea() == null) {
            return ResponseEntity.badRequest().body("Debe ingresar los campos obligatorios");
        }
        avionService.guardar(avion);
        return ResponseEntity.ok("Se registro con exito el avion y sus asientos fueron generados automaticamente");
    }
}