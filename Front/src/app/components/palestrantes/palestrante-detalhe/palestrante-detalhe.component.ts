import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss']
})
export class PalestranteDetalheComponent implements OnInit {

  public form!: FormGroup;
  public situacaoDoForm = '';
  public corDaDescricao = '';

  constructor(
    private fb: FormBuilder,
    public palestranteService: PalestranteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.validation();
    this.verificaForm();
    this.carregarMinicurriculo();
  }

  private validation(): void {
    this.form = this.fb.group({
      miniCurriculo: ['']
    })
  }

  private carregarMinicurriculo(): void {
    this.spinner.show();

    this.palestranteService.getPalestranteToken().subscribe( 
      (palestrante: Palestrante) => {
        this.form.patchValue(palestrante);       
      },
      (error: any) => {
        this.toastr.error('Erro ao carregar Minicurrículo', 'Erro!');       
      }
    ).add(() => this.spinner.hide());  
  }

  public get f(): any {
    return this.form.controls;
  }

  private verificaForm(): void {    
    this.form.valueChanges
    .pipe(
      map(() => {
        this.situacaoDoForm = 'Minicurrículo está sendo atualizado!';
        this.corDaDescricao = 'text-warning';
      }),
      debounceTime(1000),
      tap(() => this.spinner.show())
    ).subscribe(
      () => {
        this.palestranteService.putPalestrante({... this.form.value}).subscribe(
          () => { 
            this.situacaoDoForm = 'Minicurrículo foi atualizado!';
            this.corDaDescricao = 'text-success';

            setTimeout(() => {
              this.situacaoDoForm = 'Minicurrículo carregado!';
              this.corDaDescricao = 'text-muted';
            }, 2000);
          },
          (error: any) => {
            this.toastr.error('Erro ao atualizar Minicurrículo', 'Erro!');
            
          },
          ).add(() => this.spinner.hide());       
      });
  }

}
