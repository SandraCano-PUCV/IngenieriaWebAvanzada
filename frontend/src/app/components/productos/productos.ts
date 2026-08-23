import { Component } from '@angular/core';
import {products} from "../../interfaces/products";
@Component({
  selector: 'app-productos',
  imports: [],
  standalone:true,
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})

export class Productos {
   Listaproducts: products[] = [
  {
    id: 1,
    nombre: 'Notebook Lenovo',
    description: 'Notebook de 14 pulgadas',
    images: ['notebook1.jpg'],
    price: 699990,
    stock: 12
  },
  {
    id: 2,
    nombre: 'Mouse Logitech',
    description: 'Mouse inalámbrico',
    images: ['mouse.jpg'],
    price: 29990,
    stock: 20
  }
];



}
