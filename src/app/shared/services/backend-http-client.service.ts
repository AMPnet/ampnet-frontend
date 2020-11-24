import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BackendHttpClient {
    constructor(public http: HttpClient) {
    }

    get<T>(path: string, params?: object, publicRoute = false): Observable<T> {
        const httpOptions = this.authHttpOptions(publicRoute);

        if (params !== undefined) {
            httpOptions['params'] = params;
        }

        return this.http.get<T>(path, httpOptions);
    }

    post<T>(path: string, body: any, publicRoute = false): Observable<T> {
        return this.http.post<T>(path, body, this.authHttpOptions(publicRoute));
    }

    put<T>(path: string, body: object): Observable<T> {
        return this.http.put<T>(path, body, this.authHttpOptions());
    }

    delete<T>(path: string, params?: object): Observable<T> {
        const httpOptions = this.authHttpOptions();
        if (params !== undefined) {
            httpOptions['params'] = params;
        }

        return this.http.delete<T>(path, httpOptions);
    }

    public authHttpOptions(publicRoute = false) {
        const httpOptions = {
            headers: new HttpHeaders()
        };
        httpOptions.headers.append('Connection', 'Keep-Alive');

        const accessToken = localStorage.getItem('access_token');
        if (accessToken !== null && !publicRoute) {
            httpOptions.headers = httpOptions
                .headers.append('Authorization', `Bearer ${accessToken}`);
        }

        return httpOptions;
    }
}
