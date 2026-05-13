package com.example.demo.repository;
import com.example.demo.model.Personal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PersonalRepository extends JpaRepository<Personal, Long> {
    List<Personal> findByCargo(String cargo);
}