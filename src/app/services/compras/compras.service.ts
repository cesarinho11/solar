import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private API_URL = environment.apiUrl;
      constructor(private http: HttpClient) { }
    
      getCompras(page: number, search: string): Observable<any> {
        return this.http.get(`${this.API_URL}/getCompras?page=${page}&search=${search}`);
      }
}
