import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  private API_URL =environment.apiUrl;
  constructor(private http: HttpClient) { }

  getContratos(page:number,search:string): Observable<any> {
    return this.http.get(`${this.API_URL}/getContratos?page=${page}&search=${search}`);
  }

  addContrato(data:any): Observable<any> {
    return this.http.post(`${this.API_URL}/addContrato`, data);
  }

  editContrato(data:any): Observable<any> {
    return this.http.post(`${this.API_URL}/editContrato`, data);
  }
  

}
