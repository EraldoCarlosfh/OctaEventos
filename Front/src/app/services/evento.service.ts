import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Evento } from '@app/models/Evento';
import { map, take } from 'rxjs/operators';
import { PaginatedResult } from '@app/models/Pagination';

@Injectable()

//@Injectable({providedIn: 'root',}) Injecação de Dependência
export class EventoService {

  baseURL = environment.api + 'api/eventos';

  constructor(private http: HttpClient) { }

  public getEvento(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Evento[]>> {
    const paginatedResult: PaginatedResult<Evento[]> = new PaginatedResult<Evento[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term != '')    
      params = params.append('term', term);
  
    return this.http
      .get<Evento[]>(this.baseURL, {observe: 'response', params})
      .pipe(
        take(1),
        map((response) => {
          paginatedResult.result = response.body!;         
          if (response.headers.has('Pagination')) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
          }
          return paginatedResult;
        }));
  }
  
  // Estavam sendo usado antes da Paginação

  // public getEvento(): Observable<Evento[]> {
  //   return this.http
  //     .get<Evento[]>(this.baseURL)
  //     .pipe(take(1));
  // }

  // public getEventosByTema(tema: string): Observable<Evento[]> {
  //   return this.http
  //     .get<Evento[]>(`${this.baseURL}/${tema}/tema`)
  //     .pipe(take(1));
  // }


  public getEventoById(id: number): Observable<Evento> {
    return this.http
      .get<Evento>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public postEvento(evento: Evento): Observable<Evento> {
    return this.http
      .post<Evento>(this.baseURL, evento)
      .pipe(take(1));
  }

  public putEvento(evento: Evento): Observable<Evento> {
    return this.http
      .put<Evento>(`${this.baseURL}/${evento.id}`, evento)
      .pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any> {
    return this.http
      .delete(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public postUpload(eventoId: number, file: File): Observable<Evento> {
    const fileToUpload = file as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http
      .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
      .pipe(take(1));
  }
}

//pipe(take(1)); Take função para chamar somente a quantidade setada após, a chamada
// ele encerra a inscrição no subscribe
