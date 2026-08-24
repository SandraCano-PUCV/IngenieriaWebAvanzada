# NestJS — Introducción y guía práctica

## 1. ¿Qué es NestJS?

**NestJS** es un framework para construir aplicaciones backend con **Node.js** y **TypeScript**.

Está orientado a aplicaciones modulares y utiliza conceptos como:

- módulos;
- controladores;
- servicios o providers;
- inyección de dependencias;
- DTO;
- validación;
- guards;
- interceptores;
- filtros de excepciones;
- configuración por ambientes;
- pruebas automatizadas.

Una arquitectura básica puede representarse así:

```text
Frontend Angular
      |
      | HTTP / JSON
      v
Controller
      |
      v
Service
      |
      v
Repository / ORM
      |
      v
PostgreSQL
```

---

# 2. Requisitos

Verificar Node.js y npm:

```bash
node --version
npm --version
```

---

# 3. Instalar Nest CLI

Instalación global:

```bash
npm install -g @nestjs/cli
```

Verificar:

```bash
nest --version
```

También puede ejecutarse Nest CLI mediante `npx`.

---

# 4. Crear un proyecto NestJS

```bash
nest new backend
```

Ingresar al proyecto:

```bash
cd backend
```

Instalar dependencias si fuese necesario:

```bash
npm install
```

Ejecutar el servidor:

```bash
npm run start:dev
```

Por defecto suele ejecutarse en:

```text
http://localhost:3000
```

---

# 5. Estructura inicial

Una estructura simplificada puede ser:

```text
src/
├── app.controller.ts
├── app.controller.spec.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

En un proyecto más organizado:

```text
src/
├── auth/
├── users/
├── products/
│   ├── dto/
│   ├── entities/
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── common/
├── config/
├── app.module.ts
└── main.ts
```

---

# 6. Arquitectura básica de NestJS

## Module

Un módulo agrupa funcionalidades relacionadas.

```typescript
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
```

---

## Controller

El **Controller** recibe solicitudes HTTP y retorna respuestas.

```typescript
import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService
  ) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
```

El endpoint sería:

```text
GET /products
```

---

## Service

El **Service** contiene lógica de aplicación reutilizable.

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {

  findAll() {
    return [
      {
        id: 1,
        nombre: 'Notebook',
        price: 699990
      }
    ];
  }
}
```

---

# 7. Inyección de dependencias

NestJS utiliza **Dependency Injection** para administrar dependencias.

Ejemplo:

```typescript
constructor(
  private readonly productsService: ProductsService
) {}
```

Conceptualmente:

```text
ProductsController
        |
        | necesita
        v
ProductsService
        |
        | NestJS lo proporciona
        v
Dependency Injection
```

El controlador no necesita crear manualmente el servicio con:

```typescript
new ProductsService()
```

NestJS administra esa dependencia.

---

# 8. Generar componentes con Nest CLI

## Módulo

```bash
nest generate module products
```

Forma abreviada:

```bash
nest g mo products
```

## Controller

```bash
nest generate controller products
```

Forma abreviada:

```bash
nest g co products
```

## Service

```bash
nest generate service products
```

Forma abreviada:

```bash
nest g s products
```

## Resource

Nest CLI puede generar varios elementos relacionados:

```bash
nest generate resource products
```

Forma abreviada:

```bash
nest g resource products
```

---

# 9. API REST básica

Ejemplo de endpoints:

```text
GET    /products
GET    /products/:id
POST   /products
PATCH  /products/:id
DELETE /products/:id
```

Controller:

```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';

@Controller('products')
export class ProductsController {

  @Get()
  findAll() {
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }

  @Post()
  create(@Body() body: unknown) {
    return body;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: unknown
  ) {
    return { id, body };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { id };
  }
}
```

---

# 10. DTO — Data Transfer Object

Un **DTO** representa la estructura esperada de los datos que entran o salen de una operación.

Ejemplo:

```typescript
export class CreateProductDto {
  nombre: string;
  description: string;
  price: number;
  stock: number;
}
```

Uso:

```typescript
@Post()
create(
  @Body() createProductDto: CreateProductDto
) {
  return this.productsService.create(createProductDto);
}
```

---

# 11. Validación de DTO

Instalar:

```bash
npm install class-validator class-transformer
```

DTO:

```typescript
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min
} from 'class-validator';

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}
```

Activar validación global en `main.ts`:

```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  await app.listen(3000);
}

bootstrap();
```

---

# 12. Códigos HTTP

Algunos códigos frecuentes:

| Código | Significado |
|---|---|
| `200` | Operación exitosa |
| `201` | Recurso creado |
| `400` | Solicitud inválida |
| `401` | No autenticado |
| `403` | Sin autorización |
| `404` | Recurso no encontrado |
| `409` | Conflicto |
| `500` | Error interno |

Ejemplo:

```typescript
import { NotFoundException } from '@nestjs/common';

throw new NotFoundException('Producto no encontrado');
```

---

# 13. Parámetros de ruta

```typescript
@Get(':id')
findOne(
  @Param('id') id: string
) {
  return this.productsService.findOne(id);
}
```

Ejemplo:

```text
GET /products/25
```

---

# 14. Query Parameters

```typescript
@Get()
findAll(
  @Query('category') category?: string
) {
  return this.productsService.findAll(category);
}
```

Ejemplo:

```text
GET /products?category=notebooks
```

---

# 15. Comunicación con Angular

Angular puede consumir la API mediante `HttpClient`.

Flujo:

```text
ProductComponent
      ↓
ProductService Angular
      ↓
HttpClient
      ↓
GET /api/products
      ↓
ProductsController NestJS
      ↓
ProductsService NestJS
```

Ejemplo Angular:

```typescript
getProducts() {
  return this.http.get<Product[]>(
    'http://localhost:3000/products'
  );
}
```

---

# 16. CORS

Si Angular y NestJS se ejecutan en puertos diferentes durante desarrollo, puede ser necesario habilitar CORS.

Ejemplo en `main.ts`:

```typescript
const app = await NestFactory.create(AppModule);

app.enableCors({
  origin: 'http://localhost:4200'
});
```

---

# 17. Variables de entorno

Instalar/configurar:

```bash
npm install @nestjs/config
```

En `app.module.ts`:

```typescript
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
  ]
})
export class AppModule {}
```

Archivo local:

```text
.env
```

Ejemplo:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/app
JWT_SECRET=example
```

> Los secretos reales no deben almacenarse en el repositorio.

Crear:

```text
.env.example
```

con valores ficticios o nombres de variables.

---

# 18. Conexión con PostgreSQL

NestJS puede utilizar un ORM como:

- Prisma;
- TypeORM.

Ejemplo conceptual:

```text
Controller
   ↓
Service
   ↓
Prisma / TypeORM
   ↓
PostgreSQL
```

---

# 19. Guards

Los **Guards** permiten decidir si una solicitud puede acceder a una ruta.

Generar:

```bash
nest g guard auth
```

Ejemplo conceptual:

```text
Solicitud
   ↓
Guard
   ↓
¿Autorizado?
  /      \
Sí        No
↓         ↓
Controller 403
```

---

# 20. Interceptors

Los interceptores permiten ejecutar lógica antes o después de una operación.

Posibles usos:

- logging;
- medición de tiempo;
- transformación de respuestas;
- manejo de metadatos.

Generar:

```bash
nest g interceptor common/logging
```

---

# 21. Exception Filters

Los filtros de excepciones permiten controlar cómo se procesan errores.

Generar:

```bash
nest g filter common/http-exception
```

Pueden utilizarse para generar respuestas de error consistentes.

---

# 22. Pipes

Los **Pipes** permiten transformar o validar datos.

Ejemplo incorporado:

```typescript
@Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number
) {
  return this.productsService.findOne(id);
}
```

Si:

```text
GET /products/abc
```

Angular/NestJS puede rechazar la solicitud porque `abc` no puede transformarse en un número válido.

---

# 23. Swagger / OpenAPI

Instalar:

```bash
npm install @nestjs/swagger
```

Configuración básica en `main.ts`:

```typescript
import {
  DocumentBuilder,
  SwaggerModule
} from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('API Productos')
  .setDescription('API del proyecto')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(
  app,
  config
);

SwaggerModule.setup(
  'api/docs',
  app,
  document
);
```

Luego:

```text
http://localhost:3000/api/docs
```

---

# 24. Pruebas

NestJS utiliza habitualmente archivos:

```text
*.spec.ts
```

Ejemplo:

```typescript
describe('ProductsService', () => {

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
```

Ejecutar:

```bash
npm test
```

---

# 25. Build

Construir:

```bash
npm run build
```

o:

```bash
nest build
```

La salida se almacena normalmente en:

```text
dist/
```

---

# 26. Ejecutar en desarrollo

```bash
npm run start:dev
```

Este modo observa cambios y reinicia automáticamente la aplicación cuando corresponde.

---

# 27. Ejecutar versión construida

Después de:

```bash
npm run build
```

se puede ejecutar la aplicación compilada según los scripts configurados en `package.json`.

Habitualmente:

```bash
npm run start:prod
```

---

# 28. Scripts frecuentes

Revisar:

```text
package.json
```

Ejemplo:

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build",
    "test": "jest"
  }
}
```

---

# 29. NestJS en Integración Continua

Pipeline básico:

```text
Push / Pull Request
       ↓
npm ci
       ↓
npm test
       ↓
npm run build
       ↓
CI PASS / FAIL
```

Ejemplo GitHub Actions:

```yaml
backend:
  runs-on: ubuntu-latest

  defaults:
    run:
      working-directory: backend

  steps:
    - uses: actions/checkout@v6

    - uses: actions/setup-node@v7
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json

    - run: npm ci
    - run: npm test
    - run: npm run build
```

---

# 30. Estructura sugerida por funcionalidad

```text
src/
├── products/
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
│
├── users/
├── auth/
├── common/
├── config/
├── app.module.ts
└── main.ts
```

Cada módulo representa una funcionalidad o dominio relacionado.

---

# 31. Flujo de una solicitud

```text
Angular
   ↓
GET /products
   ↓
NestJS Router
   ↓
ProductsController
   ↓
ProductsService
   ↓
PostgreSQL
   ↓
ProductsService
   ↓
ProductsController
   ↓
JSON
   ↓
Angular
```

---

# 32. Idea clave

Una separación típica es:

```text
Controller
    ↓
recibe solicitud

Service
    ↓
ejecuta lógica

Repository / ORM
    ↓
accede a datos
```

El Controller no debería concentrar toda la lógica del negocio.

---

# 33. Comandos útiles

| Comando | Función |
|---|---|
| `nest new backend` | Crear proyecto |
| `nest g mo products` | Crear módulo |
| `nest g co products` | Crear controller |
| `nest g s products` | Crear service |
| `nest g resource products` | Crear recurso |
| `nest g guard auth` | Crear guard |
| `npm run start:dev` | Ejecutar en desarrollo |
| `npm test` | Ejecutar pruebas |
| `npm run build` | Construir aplicación |
| `nest --version` | Mostrar versión |

---

# 34. Resumen

```text
NestJS
  │
  ├── Modules
  │
  ├── Controllers
  │
  ├── Services / Providers
  │
  ├── DTO + Validation
  │
  ├── Guards
  │
  ├── Interceptors
  │
  ├── Pipes
  │
  └── Exception Filters
```

NestJS ayuda a construir backends organizados, modulares, probables y mantenibles utilizando TypeScript y patrones de inyección de dependencias.
