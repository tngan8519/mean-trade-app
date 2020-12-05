import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string = environment.serverURL;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('userInfo') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  register(username: string, password: string) {
    return this.http
      .post<any>(`${this.url}/api/users/register`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('userInfo', JSON.stringify(user));
          this.currentUserSubject.next(user);

          return user;
        })
      );
  }

  signIn(username: string, password: string) {
    return this.http
      .post<any>(`${this.url}/api/users/signin`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('userInfo', JSON.stringify(user));
          this.currentUserSubject.next(user);

          return user;
        })
      );
  }

  signOut() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('userInfo');
    this.currentUserSubject.next(null as any);
  }
}
