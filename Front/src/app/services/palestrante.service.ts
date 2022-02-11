import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Palestrante } from '@app/models/Palestrante';
import { map, take } from 'rxjs/operators';
import { PaginatedResult } from '@app/models/Pagination';

@Injectable()

export class PalestranteService {

  public baseURL = environment.api + 'api/palestrante';

constructor(private http: HttpClient) { }

public getPalestrante(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Palestrante[]>> {
  const paginatedResult: PaginatedResult<Palestrante[]> = new PaginatedResult<Palestrante[]>();

  let params = new HttpParams();

  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page.toString());
    params = params.append('pageSize', itemsPerPage.toString());
  }

  if (term != null && term != '')    
    params = params.append('term', term);

  return this.http
    .get<Palestrante[]>(`${this.baseURL}/all`, {observe: 'response', params})
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

public getPalestranteToken(): Observable<Palestrante> {
  return this.http
    .get<Palestrante>(this.baseURL)
    .pipe(take(1));
}

public postPalestrante(): Observable<Palestrante> {
  return this.http
    .post<Palestrante>(this.baseURL, {} as Palestrante)
    .pipe(take(1));
}

public putPalestrante(palestrante: Palestrante): Observable<Palestrante> {
  return this.http
    .put<Palestrante>(`${this.baseURL}`, palestrante)
    .pipe(take(1));
}

}
