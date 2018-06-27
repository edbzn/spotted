import { Injectable, Inject } from '@angular/core';
import { WINDOW } from './window.service';

@Injectable({ providedIn: 'root' })
export class StorageService {
  static lifetimeSuffix = '_expireAt';
  static tokenLifetime = 6000; // seconds

  constructor(@Inject(WINDOW) private window: Window) {}

  public store(name: string, item: string): void {
    this.checkStorage();

    const expireAt = new Date();
    expireAt.setSeconds(expireAt.getSeconds() + StorageService.tokenLifetime);

    const relation: string = name + StorageService.lifetimeSuffix;

    this.window.localStorage.setItem(name, item);
    this.window.localStorage.setItem(relation, (+expireAt).toString());
  }

  public get(item: string): string {
    this.checkStorage();
    return this.window.localStorage.getItem(item);
  }

  public remove(item: string): void {
    this.checkStorage();
    this.window.localStorage.removeItem(item);
  }

  private checkStorage(): void {
    let index = this.window.localStorage.length - 1;
    while (index > 0) {
      index -= 1;

      const key = this.window.localStorage.key(index);
      this.checkItem(key);
    }
  }

  private checkItem(name: string): void {
    const item = this.window.localStorage.getItem(name);

    if (!item) {
      return;
    }

    const validityToken: string = this.window.localStorage.getItem(
      name + StorageService.lifetimeSuffix
    );

    const expireAt: number = parseInt(validityToken, 10);
    const tokenLifetime = +new Date(expireAt);
    const now = +new Date();

    if (now >= tokenLifetime) {
      this.window.localStorage.removeItem(name);
      this.window.localStorage.removeItem(name + StorageService.lifetimeSuffix);
    }
  }
}
