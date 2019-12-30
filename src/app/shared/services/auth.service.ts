import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    login(username: string, password: string) {
        return this.httpClient.post<string>('/.netlify/functions/login', JSON.stringify({ username, password }));
    }

    logout(token: string) {
        return this.httpClient
            .post<boolean>('/.netlify/functions/logout', JSON.stringify({ token }))
            .pipe(catchError(_ => of(false)));
    }
}
