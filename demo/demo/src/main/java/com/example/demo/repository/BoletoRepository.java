package com.example.demo.repository;
import com.example.demo.model.Boleto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BoletoRepository extends JpaRepository<Boleto, Long> {
    List<Boleto> findByVueloId(Long vueloId);
    Optional<Boleto> findByVueloIdAndPasajeroPasaporte(Long vueloId, String pasaporte);
    List<Boleto> findByPasajeroPasaporte(String pasaporte);
}