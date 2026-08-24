import { Injectable } from '@nestjs/common';
import {Product} from '../productos/interfaces/product.interface';

@Injectable()
export class ProductosService {
   private ListaProductos:Product[]=[
    {
      id: 1,
      nombre: 'Notebook',
      descripcion: 'Notebook de 14 pulgadas',
      images:
      ["https://http2.mlstatic.com/D_NQ_NP_2X_868120-MLA74481817746_022024-F.webp",
       "https://http2.mlstatic.com/D_NQ_NP_2X_699343-CBT114399698559_072026-F.webp"    
      ],
      precio: 699990,
      stock: 5
    },
    {
      id: 2,
      nombre: 'Mouse',
      descripcion: 'Mouse inalámbrico',
      images:["https://http2.mlstatic.com/D_NQ_NP_2X_834487-MLA84842409513_052025-F.webp"],
      precio: 19990,
      stock: 10
    }
   ];

   obtenerProductos(): Product[] {
    return this.ListaProductos;
  }
}
