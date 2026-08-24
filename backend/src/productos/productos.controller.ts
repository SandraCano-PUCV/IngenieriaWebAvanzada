import { Controller, Get } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { Product } from './interfaces/product.interface';

@Controller('productos')
export class ProductosController {
   constructor(
    private readonly productosService: ProductosService
  ) {}

    @Get()
    obtenerProductos(): Product[] {
     return this.productosService.obtenerProductos();
    }
}
