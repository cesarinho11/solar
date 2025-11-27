import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesServiceService {

  private API_URL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getClientes(page: number, search: string): Observable<any> {
    return this.http.get(`${this.API_URL}/getClientes?page=${page}&search=${search}`);
  }
  obtenerClientes(): Observable<any> {
    return this.http.get(`${this.API_URL}/obtenerClientes`);
  }

       addCliente(data:any): Observable<any> {
    return this.http.post(`${this.API_URL}/addCliente`, data);
  }

  editCliente(data:any): Observable<any> {
    return this.http.post(`${this.API_URL}/editUpdate`, data);
  }

  deleteCliente(data:any): Observable<any> {
    return this.http.post(`${this.API_URL}/deleteCliente`, data);
  }

}
