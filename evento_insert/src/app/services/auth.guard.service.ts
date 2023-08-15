
import {TokenStorageService} from './token-storage.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthGuardService  {
    isLoggedIn = false;

    constructor(private tokenStorageService: TokenStorageService) {
        this.isLoggedIn = !!this.tokenStorageService.getToken();

    }

    canActivate() {
        return !!this.tokenStorageService.getToken();
    }
}
