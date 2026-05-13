package com.example.demo.repository;

import com.example.demo.model.Pasajero;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasajeroRepository extends JpaRepository<Pasajero, Long> {
    Optional<Pasajero> findByPasaporte(String pasaporte);
}