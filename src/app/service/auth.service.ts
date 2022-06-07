import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../model/user';
import { ConfigService } from './config.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginUrl = `${this.config.apiUrl}login`;
  logoutUrl = `${this.config.apiUrl}logout`;
  storageName = 'currentUser';
  currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  lastToken: string | null = null;

  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(loginData: User): Observable<any> {
    return this.http
      .post<{ accessToken: string }>(this.loginUrl, {
        email: loginData.email,
        password: loginData.password,
      })
      .pipe(
        switchMap((response) => {
          if (response.accessToken) {
            this.lastToken = response.accessToken;
            return this.userService.query(`email=${loginData.email}`);
          }
          return of(null);
        })
      )
      .pipe(
        tap((user) => {
          if (!user) {
            localStorage.removeItem(this.storageName);
            this.currentUserSubject.next(null);
          } else {
            (user as { [key: string]: any })[0].token = this.lastToken;
            localStorage.setItem(this.storageName, JSON.stringify(user as { [key: string]: any }[0]));
            this.currentUserSubject.next(user as { [key: string]: any }[0]);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
