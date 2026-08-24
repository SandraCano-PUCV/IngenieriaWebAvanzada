"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
let ProductosService = class ProductosService {
    ListaProductos = [
        {
            id: 1,
            nombre: 'Notebook',
            descripcion: 'Notebook de 14 pulgadas',
            images: ["https://http2.mlstatic.com/D_NQ_NP_2X_868120-MLA74481817746_022024-F.webp",
                "https://http2.mlstatic.com/D_NQ_NP_2X_699343-CBT114399698559_072026-F.webp"
            ],
            precio: 699990,
            stock: 5
        },
        {
            id: 2,
            nombre: 'Mouse',
            descripcion: 'Mouse inalámbrico',
            images: ["https://http2.mlstatic.com/D_NQ_NP_2X_834487-MLA84842409513_052025-F.webp"],
            precio: 19990,
            stock: 10
        }
    ];
    obtenerProductos() {
        return this.ListaProductos;
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)()
], ProductosService);
//# sourceMappingURL=productos.service.js.map