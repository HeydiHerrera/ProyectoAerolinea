import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pase-abordar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pase-abordar.component.html',
  styleUrls: ['./pase-abordar.component.scss']
})
export class PaseAbordarComponent implements OnInit {

  boleto: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.boleto = nav.extras.state['boleto'];
    }
    if (!this.boleto) {
      const state = history.state;
      if (state?.boleto) {
        this.boleto = state.boleto;
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}