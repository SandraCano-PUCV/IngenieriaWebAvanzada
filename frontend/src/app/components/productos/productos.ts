import { Component } from '@angular/core';
import {products} from "../../models/products";
import {Products} from "../../services/products";

@Component({
  selector: 'app-productos',
  imports: [],
  standalone:true,
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})

export class Productos {
   Listaproducts: products[]=[];
   constructor(
    private productosService: Products
  ) {}
   
 ngOnInit(): void {
  this.productosService.obtenerProductos()
  .subscribe((datos)=>{
      this.Listaproducts = datos;
   });
  }
}