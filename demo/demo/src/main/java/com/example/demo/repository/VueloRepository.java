package com.example.demo.repository;
import com.example.demo.model.Vuelo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

public interface VueloRepository extends JpaRepository<Vuelo, Long> {
    List<Vuelo> findByEstado(String estado);
    Vuelo findByNumeroVuelo(String numeroVuelo);
    Long countByAvionId(Long avionId);
    List<Vuelo> findByAvionAerolineaId(Long aerolineaId);
    List<Vuelo> findByAeropuertoSalidaId(Long aeropuertoId);
    Long countByAvionAerolineaId(Long aerolineaId);
    List<Vuelo> findByFechaHoraSalidaBetween(LocalDateTime desde, LocalDateTime hasta);
    List<Vuelo> findByAvionIdAndEstadoIn(Long avionId, List<String> estados);
}