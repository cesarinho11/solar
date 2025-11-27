import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private API_URL = environment.apiUrl;
    constructor(private http: HttpClient) { }
  
    getProductos(page: number, search: string): Observable<any> {
      return this.http.get(`${this.API_URL}/getProductos?page=${page}&search=${search}`);
    }
    getProductosList(search: string): Observable<any> {
      return this.http.get(`${this.API_URL}/getProductosList?search=${search}`);
    }

     addProducto(data:any): Observable<any> {
    return this.http.post(`${this.API_URL}/addProducto`, data);
  }

  editProducto(data:any): Observable<any> {
    return this.http.post(`${this.API_URL}/updateProducto`, data);
  }

    deleteProducto(data:any): Observable<any> {
    return this.http.post(`${this.API_URL}/deleteProducto`, data);
  }
  
}
