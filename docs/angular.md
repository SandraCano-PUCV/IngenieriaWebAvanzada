# Proyecto Angular

Aplicación frontend desarrollada con **Angular** y **TypeScript**.

Este proyecto utiliza una arquitectura basada en componentes y el enfoque **standalone** de Angular.

---

## 1. Requisitos

Antes de comenzar, verificar que se encuentren instalados:

```bash
node --version
npm --version
```

Opcionalmente, verificar Angular CLI:

```bash
ng version
```

Si Angular CLI no está instalado globalmente:

```bash
npm install -g @angular/cli
```

---

## 2. Crear un proyecto Angular

```bash
ng new mi-aplicacion
```

Ingresar al proyecto:

```bash
cd mi-aplicacion
```

Ejecutar el servidor de desarrollo:

```bash
ng serve
```

Abrir en el navegador:

```text
http://localhost:4200
```

También puede ejecutarse:

```bash
ng serve --open
```

---

## 3. Instalar dependencias de un proyecto existente

Si el proyecto ya existe y fue descargado desde Git:

```bash
npm install
```

En entornos de Integración Continua se recomienda:

```bash
npm ci
```

`npm ci` instala las dependencias utilizando las versiones registradas en `package-lock.json`.

---

## 4. Estructura básica

Una posible organización del proyecto es:

```text
src/
└── app/
    ├── components/
    │   ├── header/
    │   └── footer/
    │
    ├── pages/
    │   ├── inicio/
    │   ├── productos/
    │   └── not-found/
    │
    ├── models/
    │   └── product.ts
    │
    ├── services/
    │   └── product.ts
    │
    ├── app.ts
    ├── app.html
    ├── app.css
    └── app.routes.ts
```

---

## 5. Arquitectura basada en componentes

Angular divide la interfaz en componentes reutilizables.

Ejemplo:

```text
App
│
├── Header
│
├── RouterOutlet
│   ├── Inicio
│   ├── Productos
│   └── NotFound
│
└── Footer
```

Cada componente puede contener:

- una clase TypeScript;
- un template HTML;
- estilos CSS;
- pruebas automatizadas.

---

## 6. Componentes standalone

En Angular actual se pueden utilizar componentes **standalone**.

Un componente standalone puede importar directamente otros componentes, directivas o pipes sin necesidad de declararlos en un `NgModule`.

Ejemplo:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {}
```

---

## 7. Crear un componente

Comando completo:

```bash
ng generate component components/header
```

Forma abreviada:

```bash
ng g c components/header
```

Para utilizarlo en `app.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
```

En `app.html`:

```html
<app-header></app-header>

<router-outlet></router-outlet>
```

---

## 8. Interfaces y modelos

Las interfaces permiten definir la estructura de los datos.

Ejemplo:

```typescript
export interface Product {
  id: number;
  nombre: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
}
```

Una colección de productos puede definirse como:

```typescript
productos: Product[] = [];
```

---

## 9. Mostrar una lista de productos

Angular actual permite utilizar `@for` para recorrer colecciones.

```html
<ul>
  @for (producto of productos; track producto.id) {
    <li>
      <strong>{{ producto.nombre }}</strong>
      <p>{{ producto.description }}</p>
      <p>Precio: ${{ producto.price }}</p>
      <p>Stock: {{ producto.stock }}</p>
    </li>
  }
</ul>
```

La expresión:

```html
{{ producto.nombre }}
```

corresponde a **interpolación**.

---

## 10. Control de flujo en templates

### `@if`

```html
@if (producto.stock > 0) {
  <span>Disponible</span>
} @else {
  <span>Sin stock</span>
}
```

### `@for`

```html
@for (producto of productos; track producto.id) {
  <p>{{ producto.nombre }}</p>
}
```

### `@switch`

```html
@switch (estado) {
  @case ('activo') {
    <p>Activo</p>
  }
  @case ('inactivo') {
    <p>Inactivo</p>
  }
  @default {
    <p>Estado desconocido</p>
  }
}
```

---

## 11. Angular Router

Las rutas se definen normalmente en:

```text
src/app/app.routes.ts
```

Ejemplo:

```typescript
import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Productos } from './pages/productos/productos';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Inicio
  },
  {
    path: 'productos',
    component: Productos
  },
  {
    path: '**',
    component: NotFound
  }
];
```

La ruta:

```typescript
path: ''
```

representa la página inicial.

La ruta:

```typescript
path: '**'
```

captura URLs no reconocidas y puede utilizarse como página **404**.

---

## 12. RouterLink

`RouterLink` permite navegar entre rutas internas de Angular.

Ejemplo:

```html
<nav>
  <ul class="flex gap-6">
    <li>
      <a routerLink="/">Inicio</a>
    </li>

    <li>
      <a routerLink="/productos">Productos</a>
    </li>
  </ul>
</nav>
```

Si el componente es standalone:

```typescript
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink]
})
```

---

## 13. RouterOutlet

`router-outlet` indica dónde se debe mostrar el componente asociado a la ruta activa.

```html
<app-header></app-header>

<main>
  <router-outlet></router-outlet>
</main>
```

Flujo:

```text
routerLink
    ↓
Angular Router
    ↓
app.routes.ts
    ↓
Componente
    ↓
router-outlet
```

---

## 14. Crear un servicio

```bash
ng generate service services/product
```

Forma abreviada:

```bash
ng g s services/product
```

Un servicio puede encargarse de:

- acceso a una API;
- lógica compartida;
- autenticación;
- manejo de estado;
- procesamiento de datos.

Ejemplo conceptual:

```text
ProductComponent
       ↓
ProductService
       ↓
HttpClient
       ↓
API REST
```

---

## 15. Ejecutar pruebas

```bash
npm test
```

El comando ejecuta el script `test` definido en `package.json`.

Las pruebas pueden utilizarse para validar:

- componentes;
- servicios;
- formularios;
- navegación;
- comportamiento de la aplicación.

---

## 16. Construir la aplicación

```bash
npm run build
```

o:

```bash
ng build
```

El proceso genera una versión preparada para distribución.

Los archivos generados se almacenan normalmente en:

```text
dist/
```

---
## 17. Tailwind CSS
Si el proyecto utiliza Tailwind CSS, las clases pueden aplicarse directamente en los templates.

Ejemplo:

```html
<ul class="list-none flex gap-6">
  <li>
    <a
      routerLink="/"
      class="hover:text-blue-600"
    >
      Inicio
    </a>
  </li>

  <li>
    <a
      routerLink="/productos"
      class="hover:text-blue-600"
    >
      Productos
    </a>
  </li>
</ul>
```

---

## 18. Flujo de trabajo con Git

Crear una rama:

```bash
git checkout -b feature/productos
```

Agregar cambios:

```bash
git add .
```

Crear un commit:

```bash
git commit -m "feat: agrega listado de productos"
```

Enviar la rama:

```bash
git push origin feature/productos
```

Luego puede crearse un **Pull Request** para integrar los cambios.

---

## 19. Integración Continua

Un proyecto Angular puede validarse mediante GitHub Actions.

Ejemplo de pasos típicos:

```text
Push / Pull Request
        ↓
npm ci
        ↓
npm test
        ↓
npm run build
        ↓
CI exitoso
```

Los workflows se almacenan en:

```text
.github/workflows/
```

---

## 20. Comandos útiles

| Comando | Función |
|---|---|
| `ng serve` | Ejecutar servidor de desarrollo |
| `ng g c nombre` | Crear componente |
| `ng g s nombre` | Crear servicio |
| `npm install` | Instalar dependencias |
| `npm ci` | Instalación reproducible para CI |
| `npm test` | Ejecutar pruebas |
| `npm run build` | Construir la aplicación |
| `ng version` | Mostrar versiones del entorno Angular |

---

## 21. Objetivo del proyecto

La aplicación debe mantener una separación clara entre:

```text
Componentes
    ↓
Servicios
    ↓
HTTP / API
    ↓
Backend
```

Los componentes se concentran principalmente en la interfaz y la interacción, mientras que los servicios encapsulan funcionalidad reutilizable y comunicación con el backend.
