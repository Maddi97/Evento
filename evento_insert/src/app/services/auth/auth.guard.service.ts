
import { Injectable } from '@angular/core';
import { TokenStorageService } from '../sessionStorage/token-storage.service';

@Injectable()
export class AuthGuardService {
    isLoggedIn = false;

    constructor(private tokenStorageService: TokenStorageService) {
        this.isLoggedIn = !!this.tokenStorageService.getToken();

    }

    canActivate() {
        return !!this.tokenStorageService.getToken();
    }
}
