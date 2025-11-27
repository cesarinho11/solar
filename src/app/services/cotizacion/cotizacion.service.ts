import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  private API_URL = environment.apiUrl;
    constructor(private http: HttpClient) { }
  
    getCotizaciones(page: number, search: string): Observable<any> {
      return this.http.get(`${this.API_URL}/getCotizaciones?page=${page}&search=${search}`);
    }
  
    addCotizacion(data: any): Observable<any> {
      return this.http.post(`${this.API_URL}/addCotizacion`, data);
    }

    updateCotizacion(data: any): Observable<any> {
      return this.http.post(`${this.API_URL}/updateCotizacion`, data);
    }

    getVentas(page: number, search: string, estatus: number): Observable<any> {
      return this.http.get(`${this.API_URL}/getVentas?page=${page}&search=${search}&estatus=${estatus}`);
    }

    productosCotizacion(data: any){
      return this.http.post(`${this.API_URL}/productosCotizacion`, data);
    }

     confirmarCotizacion(data: any){
      return this.http.post(`${this.API_URL}/confirmarCotizacion`, data);
    }
     marcarPagada(data: any){
      return this.http.post(`${this.API_URL}/marcarPagada`, data);
    }

     cancelarVenta(data: any){
      return this.http.post(`${this.API_URL}/cancelarVenta`, data);
    }

}
