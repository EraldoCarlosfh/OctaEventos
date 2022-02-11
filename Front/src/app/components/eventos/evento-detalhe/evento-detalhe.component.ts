import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { Lote } from '@app/models/Lote';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '@environments/environment';
import { RedeSocial } from '@app/models/RedeSocial';
import { RedeSocialService } from '@app/services/redeSocial.service';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  modalRef!: BsModalRef;
  eventoId!: number;
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar = 'postEvento';
  loteAtual = { id: 0, nome: '', indice: 0 };
  redeSocialAtual = {id: 0, nome: '', indice: 0};
  imagemURL = 'assets/img/upload.png';
  file!: File;
  nome!: string;


  get f(): any {
    return this.form.controls;
  }

  get bsConfigEvento(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
    };
  }

  get bsConfigLote(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      containerClass: 'theme-blue',
      showWeekNumbers: false,
    };
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get redesSociais(): FormArray {
    return this.form.get('redesSociais') as FormArray;
  }
  
  get modoEditar(): boolean {
    return this.estadoSalvar === 'putEvento';
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private modalService: BsModalService,
    private loteService: LoteService,
    private redeSocialService: RedeSocialService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id')!;

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'putEvento';

      this.eventoService
        .getEventoById(this.eventoId)
        .subscribe(
          (evento: Evento) => {
            this.evento = { ...evento };
            this.form.patchValue(this.evento);

            if (this.evento.imagemURL !== '') {
              this.imagemURL =
                `${environment.api}resources/images/` + this.evento.imagemURL;
            }

            this.evento.lotes.forEach(lote => {
              this.lotes.push(this.criarLote(lote)); // carregando lotes com somente uma chama ao banco
            });

            this.evento.redesSociais.forEach(redeSocial => {
             this.redesSociais.push(this.criarRedeSocial(redeSocial));
            });
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar carregar Evento.', 'Erro!');          
          }
        )
        .add(() => this.spinner.hide());
    }
  } 

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(40),
        ],
      ],
      id: [{ value: '', disabled: true }],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(12000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: [''],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([])
    });
  }


  adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [
        lote.nome,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  adicionarRedeSocial(): void {
    this.redesSociais.push(this.criarRedeSocial({ id: 0 } as RedeSocial));
  }

  criarRedeSocial(redeSocial: RedeSocial): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required],
    });
  }


  public mudarValorData(value: Date, indice: number, campo: string): void {
    this.lotes.value[indice][campo] = value;
  }

  public retornaTituloLote(nome: string): string {
    return nome === null || nome === '' ? 'Nome do Lote' : nome;
  }

  public retornaTituloRedeSocial(nome: string): string {
    return nome === null || nome === '' ? 'Nome da Rede Social' : nome.replace('fab fa-', '');
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }
  
  salvarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {
      if (this.estadoSalvar === 'postEvento') {
        this.evento = { ...this.form.value };
        this.eventoService
          .postEvento(this.evento)
          .subscribe(
            () => {
              this.toastr.success(`Evento: ${this.evento.tema} salvo com sucesso.`, 'Sucesso!');             
              this.router.navigate([`eventos/lista`]);             
            },
            (error: any) => {
              this.toastr.error(`Evento: ${this.evento.tema} não foi salvo`, 'Erro!');            
            }
          )
          .add(() => this.spinner.hide());
      } else {
        this.evento = { id: this.evento.id, ...this.form.value };
        this.eventoService
          .putEvento(this.evento)
          .subscribe(
            () =>
              this.toastr.success(`Evento: ${this.evento.tema} atualizado com sucesso.`, 'Sucesso!'),
            (error: any) => {
              this.toastr.error(`Evento: ${this.evento.tema} não foi salvo`, 'Erro!');        
            }
          )
          .add(() => this.spinner.hide());
      }
    }
  }

  salvarLotes(): void {
    if (this.form.controls.lotes.valid) {
      this.spinner.show();
      this.loteService
        .SaveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success(`Lotes salvos com sucesso.`, 'Sucesso!');
            window.location.reload();
          },
          (error: any) => {
            this.toastr.error(`Erro ao tentar salvar lotes ${error}`, 'Erro!');           
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  salvarRedesSociais(): void {
    let origem = 'evento';

    if (this.eventoId == 0) origem = 'palestrante';

    if (this.form.controls.redesSociais.valid) {
      this.spinner.show();
      this.redeSocialService
        .saveRedesSociais(origem, this.eventoId, this.form.value.redesSociais)
        .subscribe(
          () => {
            this.toastr.success(`redes sociais salvas com sucesso.`, 'Sucesso!');
            window.location.reload();
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar salvar redes sociais', 'Erro!');           
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
  }

  public resetForm(): void {
    this.form.reset();
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id')!.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')!.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public removerRedeSocial(template: TemplateRef<any>, indice: number): void {
    this.redeSocialAtual.id = this.redesSociais.get(indice + '.id')!.value;
    this.redeSocialAtual.nome = this.redesSociais.get(indice + '.nome')!.value;
    this.redeSocialAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService
      .deleteLote(this.eventoId, this.loteAtual.id)
      .subscribe(
        () => {
          this.toastr.success(`Lote: ${this.loteAtual.nome} excluído com sucesso.`, 'Sucesso!');
          this.lotes.removeAt(this.loteAtual.id);
          window.location.reload();
        },
        (error: any) => {
          this.toastr.error(
            `Erro ao tentar excluir Lote: ${this.loteAtual.nome}`,
            'Erro!'
          );         
        }
      )
      .add(() => this.spinner.hide());
  }

  confirmDeleteRedeSocial(): void {
    let origem = 'evento';
    this.modalRef.hide();
    this.spinner.show();

    if (this.eventoId == 0) origem = 'palestrante';

    this.redeSocialService
      .deleteRedeSocial(origem, this.eventoId, this.redeSocialAtual.id)
      .subscribe(
        () => {
          this.toastr.success(`Rede Social: ${this.redeSocialAtual.nome} excluída com sucesso.`, 'Sucesso!');
          this.redesSociais.removeAt(this.redeSocialAtual.id);
          window.location.reload();
        },
        (error: any) => {
          this.toastr.error(
            `Erro ao tentar excluir Rede Social: ${this.redeSocialAtual.nome}`,
            'Erro!'
          );         
        }
      )
      .add(() => this.spinner.hide());
  }

  declineDelete(): void {
    this.modalRef.hide();
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = ev.target.files[0];
    reader.readAsDataURL(this.file);

    this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success('Imagem atualizada com sucesso.', 'Sucesso!');
        window.location.reload();
      },
      (error: any) => {
        this.toastr.error(`Erro ao fazer upload de imagem`, 'Erro!');       
      }
    ).add(() => this.spinner.hide());
  }

}
