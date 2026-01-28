import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagosServiceService {

  private API_URL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getPagosByCotizacion(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/getPagosByCotizacion`, data);
  }

  addPago(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/addPago`, data);
  }
}
