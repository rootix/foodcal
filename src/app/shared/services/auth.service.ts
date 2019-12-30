import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, query } from 'faunadb';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    login(username: string, password: string) {
        return this.httpClient.post<string>('/.netlify/functions/login', JSON.stringify({ username, password }));
    }

    logout(token: string): Promise<boolean> {
        const client = this.getFaunaDbClient(token);

        return client
            .query(query.Logout(false))
            .then(_ => {
                return true;
            })
            .catch(_ => {
                return false;
            });
    }

    private getFaunaDbClient(token: string) {
        return new Client({
            secret: token
        });
    }
}
