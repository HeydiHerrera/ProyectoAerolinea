package com.example.demo.repository;

import com.example.demo.model.Bitacora;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BitacoraRepository extends JpaRepository<Bitacora, Long> {
    List<Bitacora> findAllByOrderByFechaHoraDesc();
}