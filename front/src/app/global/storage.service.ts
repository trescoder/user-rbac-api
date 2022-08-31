import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * String appended at the start of all keys
   */
  prefix = environment.production ? 'gtesc_prod' : 'gtesc_dev';

  /**
   * Saves a string to local storage
   * @param key Key
   * @param value String to save
   */
  saveString(key: string, value: string) {
    localStorage.setItem(this.getKey(key), value);
  }

  /**
   * Serializes an object or array and
   * saves it to local storage as a
   * string
   * @param key Key
   * @param value Object to be saved
   */
  saveJSON(key: string, value: any) {
    localStorage.setItem(this.getKey(key), JSON.stringify(value));
  }

  /**
   * Retrieves a string from local storage
   * @param key Key
   * @returns String or null
   */
  getString(key: string): string | null {
    return localStorage.getItem(this.getKey(key));
  }

  /**
   * Retrieves a string from local storage
   * @param key Key
   * @returns String or null
   */
  getInt(key: string): number | null {
    const val = localStorage.getItem(this.getKey(key));
    if (!val) return null;
    return parseInt(val, 10);
  }

  /**
   * Retrieves a string from local storage
   * and deserializes it into an object
   * or array using JSON.parse
   * @param key Key
   * @returns Object, array or null
   */
  getJSON(key: string): any | null {
    const value = localStorage.getItem(this.getKey(key));

    if (!value) return null;

    return JSON.parse(value);
  }

  /**
   * Removes a key from local storage
   * @param key Key to remove
   */
  remove(key: string) {
    localStorage.removeItem(this.getKey(key));
  }

  /**
   * Adds the prefix to a key
   * @param key Key
   * @returns Key with prefix
   */
  private getKey(key: string) {
    return `${this.prefix}_${key}`;
  }
}
