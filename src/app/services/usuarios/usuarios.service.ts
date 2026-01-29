import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private API_URL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getUsuarios(page: number, search: string): Observable<any> {
    return this.http.get(`${this.API_URL}/getUsuarios?page=${page}&search=${search}`);
  }

  addUsuario(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/addUsuario`, data);
  }

  editUsuario(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/updateUsuario`, data);
  }
  deleteUsuario(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/deleteUsuario`, data);
  }
}
