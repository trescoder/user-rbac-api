import { Injectable } from '@angular/core';
import { StorageService } from '../global/storage.service';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  /**
   * Constructor, used for DI
   */
  constructor(private storage: StorageService) {}

  /**
   * Deletes the JWT
   */
  logOut() {
    this.storage.remove('token');
  }

  /**
   * Checks whether the user is logged in
   * @returns Whether the user is logged in
   */
  isLoggedIn() {
    return !!this.storage.getString('token');
  }

  getJWT() {
    return this.storage.getString('token') || '';
  }

  saveToken(token: string) {
    this.storage.saveString('token', token);
  }
}
