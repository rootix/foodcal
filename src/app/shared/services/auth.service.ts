import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}
    login(username: string, password: string) {
        return this.httpClient.post<string>('/.netlify/functions/login', JSON.stringify({ username, password }));
    }
}
