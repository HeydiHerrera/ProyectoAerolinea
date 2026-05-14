package com.example.demo.repository;
import com.example.demo.model.Tripulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface TripulacionRepository extends JpaRepository<Tripulacion, Long> {

    @Query("SELECT t.piloto.id FROM Tripulacion t")
    List<Long> findPilotosAsignados();

    @Query("SELECT t.copiloto.id FROM Tripulacion t")
    List<Long> findCopilotosAsignados();

    @Query("SELECT t.ingeniero.id FROM Tripulacion t")
    List<Long> findIngenieroAsignados();

    @Query("SELECT t.cabina1.id FROM Tripulacion t UNION SELECT t.cabina2.id FROM Tripulacion t UNION SELECT t.cabina3.id FROM Tripulacion t")
    List<Long> findCabinaAsignados();
}