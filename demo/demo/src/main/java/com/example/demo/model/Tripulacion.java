package com.example.demo.model;
import jakarta.persistence.*;

@Entity
@Table(name = "tripulacion")
public class Tripulacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "piloto_id")
    private Personal piloto;

    @ManyToOne
    @JoinColumn(name = "copiloto_id")
    private Personal copiloto;

    @ManyToOne
    @JoinColumn(name = "ingeniero_id")
    private Personal ingeniero;

    @ManyToOne
    @JoinColumn(name = "cabina1_id")
    private Personal cabina1;

    @ManyToOne
    @JoinColumn(name = "cabina2_id")
    private Personal cabina2;

    @ManyToOne
    @JoinColumn(name = "cabina3_id")
    private Personal cabina3;

    public Long getId() { return id; }
    public Personal getPiloto() { return piloto; }
    public void setPiloto(Personal p) { this.piloto = p; }
    public Personal getCopiloto() { return copiloto; }
    public void setCopiloto(Personal p) { this.copiloto = p; }
    public Personal getIngeniero() { return ingeniero; }
    public void setIngeniero(Personal p) { this.ingeniero = p; }
    public Personal getCabina1() { return cabina1; }
    public void setCabina1(Personal p) { this.cabina1 = p; }
    public Personal getCabina2() { return cabina2; }
    public void setCabina2(Personal p) { this.cabina2 = p; }
    public Personal getCabina3() { return cabina3; }
    public void setCabina3(Personal p) { this.cabina3 = p; }
}