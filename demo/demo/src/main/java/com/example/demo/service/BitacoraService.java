package com.example.demo.service;

import com.example.demo.model.Bitacora;
import com.example.demo.repository.BitacoraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BitacoraService {

    @Autowired private BitacoraRepository bitacoraRepo;

    public void registrar(String usuario, String accion, String detalle) {
        bitacoraRepo.save(new Bitacora(usuario, accion, detalle));
    }

    public java.util.List<Bitacora> obtenerTodo() {
        return bitacoraRepo.findAllByOrderByFechaHoraDesc();
    }
}