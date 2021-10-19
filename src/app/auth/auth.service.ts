import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs'
import { tap } from 'rxjs/operators';

interface SignupCredentials {
  username: string;
  password: string;
  passwordConfirmation: string;
}

interface SignupResponse {
  username: string;
}

interface SignedinResponse {
  authenticated: boolean;
  username: string;
}

interface SigninCredentials {
  username: string;
  password: string;
}

interface SigninResponse {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signedin$ =new BehaviorSubject(null as any); 

  rootUrl = 'https://api.angular-email.com';

  username = '';

  constructor(private http: HttpClient) { }

  usernameAvailable(username: string) {
      return this.http.post<{available: boolean}>(this.rootUrl + '/auth/username', {
      username
    })
  
  }
  signup(credentials: SignupCredentials) {
      return this.http.post<SignupResponse>(this.rootUrl + '/auth/signup',
      credentials
      // , { withCredentials: true } instead of interceptors
    ).pipe(
      tap(({ username }) => {
        this.signedin$.next(true);
        this.username = username;
      })
    );
  }
  checkAuth() {
      return this.http.get<SignedinResponse>(this.rootUrl + '/auth/signedin'
      // , { withCredentials: true } instaed of interceptors
    ).pipe(
      tap(({ authenticated, username }) => {
        this.signedin$.next(authenticated);
        this.username = username;
      })
    );
  }

  signout() {
    return this.http.post(this.rootUrl + '/auth/signout', {})
    .pipe(
      tap(() => {
        this.signedin$.next(false);
      })
    )
  }

  signin(credentials: SigninCredentials) {
    return this.http.post<SigninResponse>(this.rootUrl + '/auth/signin', credentials)
    .pipe(
      tap(({ username }) => {
        this.signedin$.next(true);
        this.username = username;
      })
    )
  }
}
