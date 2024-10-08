import { AuthService } from './../services/auth/auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class AuthGuard implements CanActivate {
    constructor(private adminService: AuthService,
        private router: Router) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.adminService.isLoggedIn()) {
           this.router.navigate(['login']);
        }
        return true;
    }
}