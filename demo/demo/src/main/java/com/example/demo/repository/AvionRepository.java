package com.example.demo.repository;
import com.example.demo.model.Avion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AvionRepository extends JpaRepository<Avion, Long> {
    List<Avion> findByEstado(String estado);
    List<Avion> findByAerolineaId(Long aerolineaId);
    Long countByAerolineaId(Long aerolineaId);
}