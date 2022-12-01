import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Acampamento - Tribo & Soma';
  siteAtivo: boolean = true;

  constructor() {}

  ngOnInit(): void {

    this.siteAtivo = false;
  }
}

