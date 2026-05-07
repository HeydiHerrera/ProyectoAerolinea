package com.example.demo.service;

import com.example.demo.model.Asiento;
import com.example.demo.model.Avion;
import com.example.demo.repository.AsientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class AsientoService {

    @Autowired
    private AsientoRepository asientoRepo;

    private int[] calcularFilasColumnas(int totalAsientos) {
        int columnas = (int) Math.round(Math.sqrt(totalAsientos));
        // Ajustar columnas para que sean maximo 10 (limite fisico avion)
        if (columnas > 10) columnas = 10;
        // Ajustar columnas minimo 2
        if (columnas < 2) columnas = 2;
        int filas = (int) Math.ceil((double) totalAsientos / columnas);
        return new int[]{filas, columnas};
    }

    private String[] generarLetrasColumnas(int numColumnas) {
        String[] letras = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"};
        String[] resultado = new String[numColumnas];
        for (int i = 0; i < numColumnas; i++) {
            resultado[i] = letras[i];
        }
        return resultado;
    }

    public void generarAsientos(Avion avion) {
        List<Asiento> asientos = new ArrayList<>();

        int totalCapacidad = avion.getCapacidad();
        int totalEjecutiva = (int) Math.ceil(totalCapacidad * 0.20);
        int totalEconomica = totalCapacidad - totalEjecutiva;

        // Calcular filas y columnas equitativamente para cada clase
        int[] dimEjecutiva = calcularFilasColumnas(totalEjecutiva);
        int[] dimEconomica = calcularFilasColumnas(totalEconomica);

        int filasEjecutiva = dimEjecutiva[0];
        int columnasEjecutiva = dimEjecutiva[1];
        int filasEconomica = dimEconomica[0];
        int columnasEconomica = dimEconomica[1];

        String[] letrasEjecutiva = generarLetrasColumnas(columnasEjecutiva);
        String[] letrasEconomica = generarLetrasColumnas(columnasEconomica);

        // Generar asientos Ejecutiva
        int fila = 1;
        int count = 0;
        for (int f = 0; f < filasEjecutiva; f++) {
            for (String col : letrasEjecutiva) {
                if (count >= totalEjecutiva) break;
                Asiento a = new Asiento();
                a.setNumero((fila + f) + col);
                a.setClase("EJECUTIVA");
                a.setEstado("DISPONIBLE");
                a.setAvion(avion);
                asientos.add(a);
                count++;
            }
        }

        // Generar asientos Economica continuando numeracion
        int filaInicio = filasEjecutiva + 1;
        count = 0;
        for (int f = 0; f < filasEconomica; f++) {
            for (String col : letrasEconomica) {
                if (count >= totalEconomica) break;
                Asiento a = new Asiento();
                a.setNumero((filaInicio + f) + col);
                a.setClase("ECONOMICA");
                a.setEstado("DISPONIBLE");
                a.setAvion(avion);
                asientos.add(a);
                count++;
            }
        }

        asientoRepo.saveAll(asientos);
    }
}