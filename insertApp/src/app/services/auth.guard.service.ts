import {CanActivate} from '@angular/router';
import {TokenStorageService} from './token-storage.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate {
    isLoggedIn = false;

    constructor(private tokenStorageService: TokenStorageService) {
        this.isLoggedIn = !!this.tokenStorageService.getToken();

    }

    canActivate() {
        if (!!this.tokenStorageService.getToken()
        ) {
            return true;
        } else {
            return false;
        }
    }
}
