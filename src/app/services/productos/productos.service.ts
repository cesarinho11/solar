import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private API_URL = environment.apiUrl;
  private productosFaltantesSubject = new BehaviorSubject<number>(0);
  productosFaltantes$ = this.productosFaltantesSubject.asObservable();

    constructor(private http: HttpClient) { }
  
    getProductos(page: number, search: string, per_page:number): Observable<any> {
      return this.http.get(`${this.API_URL}/getProductos?page=${page}&search=${search}&per_page=${per_page}`);
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
  
  categoriasProducto(){
     return this.http.get(`${this.API_URL}/categoriasProducto`);
  }

  alertaStock(){
     return this.http.get(`${this.API_URL}/alertaStock`);
  }

  verificarStock() {
    this.alertaStock().subscribe((res: any) => {
      this.productosFaltantesSubject.next(res.length);
    });
  }

  //herramientas 
      getHerramientas(page: number, search: string): Observable<any> {
      return this.http.get(`${this.API_URL}/getHerramientas?page=${page}&search=${search}`);
    }
}
