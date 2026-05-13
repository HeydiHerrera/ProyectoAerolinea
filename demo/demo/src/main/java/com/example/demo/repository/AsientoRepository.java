package com.example.demo.repository;
import com.example.demo.model.Asiento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface AsientoRepository extends JpaRepository<Asiento, Long> {
    List<Asiento> findByAvionId(Long avionId);
    List<Asiento> findByAvionIdAndClase(Long avionId, String clase);
    Optional<Asiento> findByIdAndEstado(Long id, String estado);
}