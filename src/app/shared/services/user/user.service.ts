import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../../../user-status-storage';
import { BackendHttpClient } from '../backend-http-client.service';
import { tap } from 'rxjs/operators';
import { User } from './signup.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: BackendHttpClient) {
    }

    getOwnProfile() {
        return this.http.get<User>('/api/user/me')
            .pipe(tap(user => UserStatusStorage.personalData = user));
    }


    logout() {
        return this.http.post<void>(`/api/user/logout`, {})
            .pipe(tap(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }));
    }

    refreshUserToken() {
        return this.http.post<void>('/api/user/token/refresh', {
            'refresh_token': localStorage.getItem('refresh_token')
        });
    }
}
