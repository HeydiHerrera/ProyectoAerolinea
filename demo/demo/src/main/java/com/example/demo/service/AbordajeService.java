public String abordarPasajero(Long vueloId, String pasaporte, Integer maletas) {
    Optional<Boleto> boletoOpt = boletoRepo.findByVueloIdAndPasajeroPasaporte(vueloId, pasaporte);
    if (boletoOpt.isEmpty()) {
        return "El pasajero no se encuentra registrado en el vuelo";
    }
    Boleto boleto = boletoOpt.get();
    if (boleto.getEstado().equals("ABORDADO")) {
        return "El pasajero ya ha abordado el vuelo";
    }
    boleto.setEstado("ABORDADO");
    boleto.setCantidadMaletas(maletas);

    int maletasPermitidas = boleto.getClase().equals("EJECUTIVA") ? 2 : 1;
    if (maletas > maletasPermitidas) {
        double recargo = (maletas - maletasPermitidas) * 50.0;
        boleto.setRecargo(recargo);
        boletoRepo.save(boleto);
        return "RECARGO:" + recargo;
    }
    boleto.setRecargo(0.0);
    boletoRepo.save(boleto);
    return "OK";
}
