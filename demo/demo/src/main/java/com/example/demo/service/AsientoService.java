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
    @Autowired private AsientoRepository asientoRepo;

    private int[] calcularFilasColumnas(int total) {
        int columnas = (int) Math.round(Math.sqrt(total));
        if (columnas > 10) columnas = 10;
        if (columnas < 2) columnas = 2;
        int filas = (int) Math.ceil((double) total / columnas);
        return new int[]{filas, columnas};
    }

    private String[] generarLetras(int n) {
        String[] letras = {"A","B","C","D","E","F","G","H","I","J"};
        String[] res = new String[n];
        for (int i = 0; i < n; i++) res[i] = letras[i];
        return res;
    }

    public void generarAsientos(Avion avion) {
        List<Asiento> asientos = new ArrayList<>();
        int total = avion.getCapacidad();
        int ejecutiva = (int) Math.ceil(total * 0.20);
        int economica = total - ejecutiva;

        int[] dimE = calcularFilasColumnas(ejecutiva);
        int[] dimEc = calcularFilasColumnas(economica);
        String[] letE = generarLetras(dimE[1]);
        String[] letEc = generarLetras(dimEc[1]);

        int count = 0;
        for (int f = 0; f < dimE[0]; f++) {
            for (String col : letE) {
                if (count >= ejecutiva) break;
                Asiento a = new Asiento();
                a.setNumero((f + 1) + col);
                a.setClase("EJECUTIVA");
                a.setEstado("DISPONIBLE");
                a.setAvion(avion);
                asientos.add(a);
                count++;
            }
        }

        int filaInicio = dimE[0] + 1;
        count = 0;
        for (int f = 0; f < dimEc[0]; f++) {
            for (String col : letEc) {
                if (count >= economica) break;
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