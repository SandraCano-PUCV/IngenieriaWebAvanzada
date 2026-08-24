import { Injectable } from "@angular/core";
import {products} from '../models/products';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Products {
  private url = 'http://localhost:3000/productos';
  constructor(
    private http: HttpClient
  ) {}
  obtenerProductos():Observable<products[]>{
      return this.http.get<products[]>(this.url);
  }
  
}