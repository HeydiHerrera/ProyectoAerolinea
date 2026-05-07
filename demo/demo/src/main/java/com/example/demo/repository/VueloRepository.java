// VueloRepository.java
package com.example.demo.repository;
import com.example.demo.model.Vuelo;
import org.springframework.data.jpa.repository.JpaRepository;
public interface VueloRepository extends JpaRepository<Vuelo, Long> {}