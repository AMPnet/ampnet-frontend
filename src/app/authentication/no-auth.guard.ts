import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouterService } from '../shared/services/router.service';
import { UserService } from '../shared/services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
    constructor(private userService: UserService,
                private router: RouterService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (this.userService.isLoggedIn()) {
            this.router.navigate(['/dash']);
            return false;
        }

        return true;
    }
}