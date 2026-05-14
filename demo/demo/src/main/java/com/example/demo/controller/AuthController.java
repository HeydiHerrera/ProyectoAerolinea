package com.example.demo.controller;
import com.example.demo.service.BitacoraService;
import com.example.demo.model.Usuario;
import com.example.demo.model.Pasajero;
import com.example.demo.service.UsuarioService;
import com.example.demo.service.PasajeroService;
import com.example.demo.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasajeroService pasajeroService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BitacoraService bitacoraService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario user) {

        if (user.getUsername() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Datos incompletos");
        }

        Usuario usuario = usuarioService.findByUsername(user.getUsername());
        if (usuario != null && usuario.getPassword().equals(user.getPassword())) {
            String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRol());
            bitacoraService.registrar(usuario.getUsername(), "LOGIN", "Usuario inicio sesion con rol " + usuario.getRol());
            return ResponseEntity.ok(token);
        }

        Pasajero pasajero = pasajeroService.findByPasaporte(user.getUsername());
        if (pasajero != null && pasajero.getPassword().equals(user.getPassword())) {
            String token = jwtUtil.generateToken(pasajero.getPasaporte(), pasajero.getRol());
            bitacoraService.registrar(pasajero.getPasaporte(), "LOGIN", "Pasajero inicio sesion");
            return ResponseEntity.ok(token);
        }

        bitacoraService.registrar(user.getUsername(), "LOGIN_FALLIDO", "Intento de inicio de sesion fallido");
        return ResponseEntity.status(401).body("Credenciales incorrectas");
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Pasajero pasajero) {

        if (pasajero.getPasaporte() == null || pasajero.getNombre() == null ||
                pasajero.getCorreo() == null || pasajero.getPassword() == null) {
            return ResponseEntity.badRequest().body("Datos incompletos");
        }

        if (pasajeroService.existePasaporte(pasajero.getPasaporte())) {
            return ResponseEntity.status(409).body("El numero de pasaporte ingresado ya cuenta con usuario.");
        }

        pasajeroService.guardar(pasajero);
        bitacoraService.registrar(pasajero.getPasaporte(), "REGISTRO", "Nuevo pasajero registrado: " + pasajero.getNombre());
        return ResponseEntity.ok("Se ha creado con exito el usuario.");
    }
}

