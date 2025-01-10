import { Injectable } from '@angular/core';
import { Router, UrlTree } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate():
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return true;
    }
}