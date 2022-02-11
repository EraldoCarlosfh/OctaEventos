import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef!: BsModalRef;
  public eventoId!: number;
  public eventos: Evento[] = [];
  evento = {} as Evento;
  public pagination = {} as Pagination;

  public larguraImagem = 150;
  public margemImagem = 2;
  public exibirImagem = true;
  termSearchChanged: Subject<string> = new Subject<string>();
 
  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pagination = { currentPage: 1, itemsPerPage: 3, totalItems: 1 } as Pagination;
    this.GetAllEventos();
  }

  public changeImage(): void {
    this.exibirImagem = !this.exibirImagem;
  }

  public mostrarImagem(imagemURL: string): string {
    return imagemURL !== ''
      ? `${environment.api}resources/images/${imagemURL}`
      : '/assets//img/semImagem.png';
  }

  public filterEventos(evt: any): void {
    if (this.termSearchChanged.observers.length == 0) {
      this.termSearchChanged.pipe(debounceTime(1000)).subscribe(
        filterBy => {
          this.spinner.show();
          this.eventoService.getEvento(this.pagination.currentPage, this.pagination.itemsPerPage, filterBy).subscribe(
            (paginatedResult: PaginatedResult<Evento[]>) => {
              this.eventos = paginatedResult.result;
              this.pagination = paginatedResult.pagination;
            },
            (error: any) => {
              this.toastr.error('Erro ao filtrar os eventos', 'Erro!');            
            },
          ).add(() => this.spinner.hide());
        }
      );
    }
    this.termSearchChanged.next(evt.value);
  }

  public GetAllEventos(): void {
    this.spinner.show();
    this.eventoService.getEvento(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
      (paginatedResult: PaginatedResult<Evento[]>) => {
        this.eventos = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      },
      (error: any) => {
        this.toastr.error('Erro ao carregar os eventos', 'Erro!');     
      },
    ).add(() => this.spinner.hide());

  }

  openModalAdd(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    console.log(template);
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }


  confirmDeleteEvento(): void {
    this.modalRef.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        var temaEvento = '';
        this.eventos.forEach(x => {
          temaEvento = x.tema; 
        });

        if (result.message === 'Deletado') {
          this.toastr.success(`O evento ${temaEvento} foi deletado com sucesso`, 'Sucesso!');
          this.GetAllEventos();
        }
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o Evento ${this.eventoId}`, 'Erro!');     
      }
    ).add(() => this.spinner.hide());

  }

  confirmEditEvento(): void {
    this.modalRef.hide();
    this.toastr.success('Você será redirecionado.', 'Aguarde!');
  }

  confirmAddEvento(): void {
    this.modalRef.hide();
  }

  declineEvento(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`/eventos/detalhe/${id}`]);
  }

  //Pagination

  public pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.GetAllEventos();
  }

}
