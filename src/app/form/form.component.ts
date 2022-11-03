import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SheetService } from '../service/sheet.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  inscrito = new Inscrito();
  error: boolean = false;
  carregando: boolean = false;
  errorMessage: any;
  nome?: String;
  pagamentos: any;
  celulas: any;
  idInscrito: number = 0;
  enviado: boolean = false;

  constructor(private sheetService: SheetService) {}

  ngOnInit(): void {
    this.pagamentos = ['Dinheiro', 'Cartão (1x) + taxa de 3,00', 'Cartão (2x) + taxa de 3,00', 'Pix'];
    this.celulas = [
      'Dimas',
      'Hesed',
      'Klêtos',
      'Servos do Rei',
      'Siga-me',
      'Yous',
      'Ekballo',
      'Farol',
      'Emaús',
      'Refúgio',
      'Ágape',
      'Chadah',
      'Dunamis',
      'Havilah',
      'Ide',
      'Siza',
      'Uzi',
      'Vita',
      'Shekinah',
    ];
  }

  salvarItem() {
    if (this.inscrito.nome?.length == 0 || this.inscrito.nome == null) {
      this.errorMessage = 'O nome não pode ficar em branco!';
      this.error = true;
      return;
    }

    if (this.inscrito.idade?.length == 0 || this.inscrito.idade == null) {
      this.errorMessage = 'Idade não pode ficar em branco!';
      this.error = true;
      return;
    }

    if (this.inscrito.telefone?.length == 0 || this.inscrito.telefone == null) {
      this.errorMessage = 'Telefone não pode ficar em branco!';
      this.error = true;
      return;
    }

    if (this.inscrito.celula?.length == 0 || this.inscrito.celula == null) {
      this.errorMessage = 'É necessário escolher a célula!';
      this.error = true;
      return;
    }

    if (this.inscrito.carro?.length == 0 || this.inscrito.carro == null) {
      this.errorMessage = 'É necessário informar se possui carro!';
      this.error = true;
      return;
    }

    if (this.inscrito.rede?.length == 0 || this.inscrito.rede == null) {
      this.errorMessage = 'É necessário informar se possui rede!';
      this.error = true;
      return;
    }

    if (this.inscrito.horarioIda?.length == 0 || this.inscrito.horarioIda == null) {
      this.errorMessage = 'É necessário informar o horário de ida!';
      this.error = true;
      return;
    }

    if (this.inscrito.alergiaDoenca?.length == 0 || this.inscrito.alergiaDoenca == null) {
      this.errorMessage = 'É necessário informar se tem alguma alergia ou doença!';
      this.error = true;
      return;
    }

    if (this.inscrito.formaPagamento?.length == 0 || this.inscrito.formaPagamento == null) {
      this.errorMessage = 'É necessário escolher uma forma de pagamento!';
      this.error = true;
      return;
    }

    let dataAtual = new Date().toLocaleDateString('pt-br');
    this.inscrito.dataInscricao = dataAtual.substring(0, 5);

    this.carregando = true;
    console.log(this.inscrito);

    this.sheetService.getInscritoByNome(this.inscrito.nome).subscribe({
      next: (response) => {
        let existeInscrito = (response.length > 0);

        if (!existeInscrito){
          this.sheetService.getUltimoId().subscribe({
            next: (response) => {
              this.idInscrito = response[0].id;

              if (this.idInscrito != 0) {
                this.sheetService.saveItem(this.idInscrito, this.inscrito).subscribe({
                  next: () => {
                    this.inscrito = new Inscrito();
                    this.enviado = true;
                    this.carregando = false;
                  },
                  error: (error: HttpErrorResponse) => {
                    this.error = true;
                    this.errorMessage = 'Erro: ' + error.message;
                    this.carregando = false;
                  },
                });
              }
            },
            error: (error: HttpErrorResponse) => {
              this.error = true;
              this.errorMessage = 'Erro: ' + error.message;
              this.carregando = false;
            },
          });
        } else {
          this.error = true;
          this.errorMessage = 'Já existe uma inscrição com este nome!';
          this.carregando = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.error = true;
        this.errorMessage = 'Erro: ' + error.message;
        this.carregando = false;
      },
    });
  }
}

export class Inscrito {
  id?: number;
  nome?: String;
  celula?: String;
  idade?: String;
  telefone?: String;
  carro?: String;
  horarioIda?: String;
  alergiaDoenca?: String;
  rede?: String;
  formaPagamento?: String;
  dataInscricao?: String;
}
