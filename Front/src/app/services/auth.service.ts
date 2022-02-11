import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/Identity/User';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()

export class AuthService {

  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();
  public title = 'OctaEventos';

  public baseURL = environment.api + 'api/account';
  public jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public login(model: any): Observable<void> {
    return this.http.post<User>(`${this.baseURL}/login`, model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user)
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.currentUserSource.next(undefined);
    this.currentUserSource.complete();
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem('token', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  public getUser(): Observable<UserUpdate> {
    return this.http.get<UserUpdate>(`${this.baseURL}/getUser`).pipe(take(1));
  }

  public updateUser(model: UserUpdate): Observable<void> {
    return this.http.put<UserUpdate>(`${this.baseURL}/updateUser`, model).pipe(
      take(1),
      map((response: UserUpdate) => {
        const userUpdate = response;
        if (userUpdate) {
          this.setCurrentUser(userUpdate)
        }
      })
    );
  }

  public register(model: any): Observable<void> {
    return this.http.post<User>(`${this.baseURL}/register`, model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user)
        }
      })
    );
  }

  public postUpload(file: File): Observable<UserUpdate> {
    const fileToUpload = file as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http
      .post<UserUpdate>(`${this.baseURL}/upload-image`, formData)
      .pipe(take(1));
  }
}
