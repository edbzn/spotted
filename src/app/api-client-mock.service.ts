import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiMockClient {
  constructor(private http: HttpClient) {}

  public get(query: string): Observable<any> {
    return this.http.get(this.buildUrl(query));
  }

  private buildUrl(query: string): string {
    return '/assets/spots.json';
  }
}
