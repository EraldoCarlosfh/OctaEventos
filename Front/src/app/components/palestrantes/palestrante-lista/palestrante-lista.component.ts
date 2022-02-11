import { Component, OnInit } from '@angular/core';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit {

  public palestrantes: Palestrante[] = [];
  public palestranteId!: number;
  public imagemURL = 'assets/img/perfil.png';
  termSearchChanged: Subject<string> = new Subject<string>();
  public pagination = {} as Pagination;

  constructor(private toastr: ToastrService,
              private palestranteService: PalestranteService,
              private spinner: NgxSpinnerService,) { }

  ngOnInit() {
    this.pagination = { currentPage: 1, itemsPerPage: 3, totalItems: 1 } as Pagination;
    this.GetAllPalestrantes();
  }

  public GetAllPalestrantes(): void {
    this.spinner.show();
    this.palestranteService.getPalestrante(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
      (paginatedResult: PaginatedResult<Palestrante[]>) => {
        this.palestrantes = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      },
      (error: any) => {
        this.toastr.error('Erro ao carregar os palestrantes', 'Erro!');
        
      },
    ).add(() => this.spinner.hide());

  }

  public getImagemURL(imagemName: string): string {
    if (imagemName)
    return `${environment.api}resources/perfil/${imagemName}`;
    else
    return this.imagemURL;
  }

  public filterPalestrantes(evt: any): void {
    if (this.termSearchChanged.observers.length == 0) {
      this.termSearchChanged.pipe(debounceTime(1000)).subscribe(
        filterBy => {
          this.spinner.show();
          this.palestranteService.getPalestrante(this.pagination.currentPage, this.pagination.itemsPerPage, filterBy).subscribe(
            (paginatedResult: PaginatedResult<Palestrante[]>) => {
              this.palestrantes = paginatedResult.result;
              this.pagination = paginatedResult.pagination;
            },
            (error: any) => {
              this.toastr.error('Erro ao filtrar os palestrantes', 'Erro!');
              
            },
          ).add(() => this.spinner.hide());
        }
      );
    }
    this.termSearchChanged.next(evt.value);
  }

  public pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.GetAllPalestrantes();
  }
}
