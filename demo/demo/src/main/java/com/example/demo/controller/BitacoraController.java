package com.example.demo.controller;

import com.example.demo.service.BitacoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bitacora")
@CrossOrigin(origins = "*")
public class BitacoraController {

    @Autowired private BitacoraService bitacoraService;

    @GetMapping("/todo")
    public ResponseEntity<?> getTodo() {
        return ResponseEntity.ok(bitacoraService.obtenerTodo());
    }
}