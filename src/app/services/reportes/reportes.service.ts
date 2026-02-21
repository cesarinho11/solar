import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

   private API_URL = environment.apiUrl;
     constructor(private http: HttpClient) { }

       reporteProductos(data:any): Observable<any> {
         return this.http.post(`${this.API_URL}/productosVendidosReporte`, data);
       }
       reporteVentas(data:any): Observable<any> {
         return this.http.post(`${this.API_URL}/totalVentas`, data);
       }
}
