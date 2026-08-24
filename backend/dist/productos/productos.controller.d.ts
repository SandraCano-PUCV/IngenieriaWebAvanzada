import { ProductosService } from './productos.service';
import { Product } from './interfaces/product.interface';
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    obtenerProductos(): Product[];
}
