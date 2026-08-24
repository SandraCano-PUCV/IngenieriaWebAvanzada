# Angular CLI

## ¿Qué es Angular CLI?

**Angular CLI (Command Line Interface)** es la herramienta de línea de comandos utilizada para crear, ejecutar, construir, probar y mantener proyectos Angular.

Permite automatizar tareas como:

- crear proyectos;
- generar componentes;
- generar servicios;
- generar interfaces;
- ejecutar la aplicación;
- ejecutar pruebas;
- construir la aplicación;
- actualizar Angular.

---

## Requisitos

Verificar Node.js y npm:

```bash
node --version
npm --version
```

---

## Instalar Angular CLI

```bash
npm install -g @angular/cli
```

Verificar:

```bash
ng version
```

También puede utilizarse una versión específica:

```bash
npx @angular/cli@20 new mi-proyecto
```

---

## Crear un proyecto

```bash
ng new mi-proyecto
```

Ingresar:

```bash
cd mi-proyecto
```

Ejecutar:

```bash
ng serve
```

Abrir automáticamente el navegador:

```bash
ng serve --open
```

La aplicación normalmente queda disponible en:

```text
http://localhost:4200
```

---

## Generar un componente

```bash
ng generate component productos
```

Forma abreviada:

```bash
ng g c productos
```

Ejemplo:

```bash
ng g c components/header
```

Puede generarse:

```text
src/app/components/header/
├── header.ts
├── header.html
├── header.css
└── header.spec.ts
```

---

## Generar un servicio

```bash
ng generate service services/productos
```

Forma abreviada:

```bash
ng g s services/productos
```

Los servicios pueden utilizarse para:

- comunicación con APIs;
- autenticación;
- lógica reutilizable;
- manejo de datos;
- estado compartido.

---

## Generar una interfaz

```bash
ng generate interface models/product
```

Forma abreviada:

```bash
ng g i models/product
```

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

---

## Generar un guard

```bash
ng generate guard guards/auth
```

Forma abreviada:

```bash
ng g g guards/auth
```

Los guards permiten proteger rutas.

---

## Generar un interceptor

```bash
ng generate interceptor interceptors/auth
```

Los interceptores pueden utilizarse para:

- agregar tokens;
- modificar solicitudes;
- manejar errores;
- registrar tráfico HTTP.

---

## Ejecutar pruebas

```bash
ng test
```

También puede utilizarse:

```bash
npm test
```

si el script `test` está definido en `package.json`.

---

## Construir la aplicación

```bash
ng build
```

También:

```bash
npm run build
```

El resultado se almacena normalmente en:

```text
dist/
```

---

## Instalar dependencias

Durante desarrollo:

```bash
npm install
```

En Integración Continua:

```bash
npm ci
```

`npm ci` utiliza las versiones definidas en `package-lock.json`.

---

## Ver ayuda

```bash
ng help
```

Ayuda específica:

```bash
ng generate component --help
```

---

## Actualizar Angular

```bash
ng update
```

Actualizar Angular y Angular CLI:

```bash
ng update @angular/core @angular/cli
```

---

## Comandos frecuentes

| Comando | Función |
|---|---|
| `ng new proyecto` | Crear proyecto |
| `ng serve` | Ejecutar servidor de desarrollo |
| `ng serve -o` | Ejecutar y abrir navegador |
| `ng g c nombre` | Generar componente |
| `ng g s nombre` | Generar servicio |
| `ng g i nombre` | Generar interfaz |
| `ng g g nombre` | Generar guard |
| `ng test` | Ejecutar pruebas |
| `ng build` | Construir aplicación |
| `ng update` | Actualizar Angular |
| `ng version` | Mostrar versiones |
| `ng help` | Mostrar ayuda |

---

## Angular CLI y componentes standalone

En Angular moderno, los componentes pueden trabajar con el enfoque **standalone**.

Ejemplo:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-productos',
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos {}
```

Un componente standalone puede importar directamente otros componentes, directivas y pipes mediante:

```typescript
imports: []
```

---

## Ejemplo de flujo de trabajo

```text
ng new tienda
     ↓
cd tienda
     ↓
ng g c components/header
     ↓
ng g c pages/productos
     ↓
ng g s services/productos
     ↓
ng g i models/product
     ↓
ng serve
     ↓
ng test
     ↓
ng build
```

---

## Idea principal

Angular CLI automatiza tareas repetitivas del desarrollo:

```text
Crear
  ↓
Generar
  ↓
Ejecutar
  ↓
Probar
  ↓
Construir
  ↓
Actualizar
```

Esto ayuda a mantener una estructura consistente y reproducible en los proyectos Angular.

## Directivas 


## 1. ¿Qué es una directiva?

Una **directiva** es una clase de Angular que permite asociar comportamiento a elementos del DOM, componentes o fragmentos de un template.

Las directivas permiten extender las capacidades del HTML para:

- modificar estilos o clases;
- reaccionar a eventos;
- controlar navegación;
- crear comportamientos reutilizables;
- crear o eliminar fragmentos del template;
- repetir contenido;
- encapsular lógica asociada a la interfaz.

Angular distingue conceptualmente tres grandes grupos:

```text
Directivas
│
├── Componentes
│
├── Directivas de atributo
│
└── Directivas estructurales
```

> En Angular actual, para condiciones y repeticiones comunes se recomienda utilizar los bloques de control de flujo `@if`, `@for` y `@switch`.

---

# 2. Los componentes también son directivas

Un **componente** es una directiva especializada que posee un **template propio**.

Ejemplo:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos {
}
```

El componente puede utilizarse mediante su selector:

```html
<app-productos></app-productos>
```

Conceptualmente:

```text
@Component
    ↓
selector
    ↓
<app-productos>
    ↓
template + lógica + estilos
```

---

# 3. Directivas de atributo

Las **directivas de atributo** modifican la apariencia o el comportamiento de un elemento que ya existe.

No crean ni eliminan el elemento del DOM.

Ejemplos frecuentes:

```text
RouterLink
NgClass
NgStyle
```

También pueden crearse directivas propias.

---

# 4. `RouterLink`

`RouterLink` es una directiva proporcionada por Angular Router.

Permite navegar entre rutas internas sin recargar completamente la aplicación.

Ejemplo:

```html
<a routerLink="/productos">
  Productos
</a>
```

Para utilizarla en un componente standalone:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html'
})
export class Header {
}
```

Ejemplo de menú:

```html
<nav>
  <ul>
    <li>
      <a routerLink="/">Inicio</a>
    </li>

    <li>
      <a routerLink="/productos">Productos</a>
    </li>
  </ul>
</nav>
```

---

## RouterLink dinámico

También puede utilizarse con **property binding**:

```html
<a [routerLink]="['/productos', producto.id]">
  Ver producto
</a>
```

Si:

```typescript
producto.id = 25;
```

Angular navegará conceptualmente a:

```text
/productos/25
```

---

# 5. `NgClass`

`NgClass` permite agregar o quitar clases CSS dinámicamente.

Importación:

```typescript
import { NgClass } from '@angular/common';

@Component({
  imports: [NgClass]
})
```

Ejemplo:

```html
<p
  [ngClass]="{
    'text-green-600': producto.stock > 0,
    'text-red-600': producto.stock === 0
  }"
>
  Stock: {{ producto.stock }}
</p>
```

Interpretación:

```text
stock > 0
   ↓
text-green-600

stock = 0
   ↓
text-red-600
```

---

# 6. `NgStyle`

`NgStyle` permite modificar estilos en línea dinámicamente.

Importación:

```typescript
import { NgStyle } from '@angular/common';

@Component({
  imports: [NgStyle]
})
```

Ejemplo:

```html
<p
  [ngStyle]="{
    'font-weight': producto.stock > 0 ? 'bold' : 'normal',
    'opacity': producto.stock === 0 ? 0.5 : 1
  }"
>
  {{ producto.nombre }}
</p>
```

---

# 7. Property Binding no es lo mismo que una directiva

Angular permite asignar propiedades mediante:

```html
[propiedad]="expresion"
```

Ejemplo:

```html
<img [src]="producto.images[0]">
```

Aquí:

```text
[src]
```

es **property binding** sobre la propiedad `src` del elemento.

En cambio:

```html
[ngClass]
```

utiliza una **directiva Angular**.

Comparación:

| Sintaxis | Tipo |
|---|---|
| `[src]` | Property binding |
| `[disabled]` | Property binding |
| `[ngClass]` | Directiva de atributo |
| `[ngStyle]` | Directiva de atributo |
| `routerLink` | Directiva |

---

# 8. Directivas estructurales

Las **directivas estructurales** modifican la estructura del DOM.

Pueden:

- crear fragmentos;
- eliminar fragmentos;
- repetir fragmentos;
- renderizar contenido según una condición.

La sintaxis tradicional de Angular utilizaba:

```text
*ngIf
*ngFor
```

Ejemplo histórico:

```html
<p *ngIf="producto.stock > 0">
  Disponible
</p>
```

y:

```html
<ul>
  <li *ngFor="let producto of productos">
    {{ producto.nombre }}
  </li>
</ul>
```

El carácter:

```text
*
```

es una sintaxis abreviada asociada a directivas estructurales.

---

# 9. ¿Qué ocurre internamente con una directiva estructural?

Por ejemplo:

```html
<p *ngIf="mostrar">
  Contenido
</p>
```

conceptualmente se transforma en algo equivalente a:

```html
<ng-template [ngIf]="mostrar">
  <p>
    Contenido
  </p>
</ng-template>
```

`ng-template` representa un fragmento de template que Angular puede crear o no crear.

---

# 10. Control de flujo en Angular actual

Para las operaciones habituales de condición y repetición, Angular actual incorpora:

```text
@if
@for
@switch
```

Estos son **bloques de control de flujo del template**, no directivas que deban importarse desde `CommonModule`.

---

# 11. `@if`

Permite renderizar contenido dependiendo de una condición.

Ejemplo:

```html
@if (producto.stock > 0) {

  <p>
    Producto disponible
  </p>

}
```

Con alternativa:

```html
@if (producto.stock > 0) {

  <p>Disponible</p>

} @else {

  <p>Sin stock</p>

}
```

---

## `@else if`

```html
@if (producto.stock > 10) {

  <p>Stock alto</p>

} @else if (producto.stock > 0) {

  <p>Stock bajo</p>

} @else {

  <p>Sin stock</p>

}
```

---

# 12. `@for`

Permite recorrer una colección.

Supongamos:

```typescript
productos: Product[] = [
  {
    id: 1,
    nombre: 'Notebook',
    description: 'Notebook de 14 pulgadas',
    images: ['notebook.jpg'],
    price: 699990,
    stock: 5
  },
  {
    id: 2,
    nombre: 'Mouse',
    description: 'Mouse inalámbrico',
    images: ['mouse.jpg'],
    price: 29990,
    stock: 0
  }
];
```

Template:

```html
<ul>

  @for (producto of productos; track producto.id) {

    <li>
      {{ producto.nombre }}
    </li>

  }

</ul>
```

---

# 13. ¿Qué significa `track`?

En:

```html
@for (producto of productos; track producto.id)
```

`track` permite que Angular identifique de forma estable cada elemento de la colección.

Ejemplo:

```text
Producto 1 → id = 1
Producto 2 → id = 2
Producto 3 → id = 3
```

Angular puede relacionar cada objeto con su representación en el DOM.

Una propiedad única como:

```typescript
producto.id
```

es normalmente una buena opción.

---

# 14. Variables disponibles dentro de `@for`

Angular dispone de variables contextuales.

Ejemplo:

```html
@for (producto of productos; track producto.id; let i = $index) {

  <p>
    {{ i }} - {{ producto.nombre }}
  </p>

}
```

Algunas variables disponibles son:

```text
$index
$count
$first
$last
$even
$odd
```

Ejemplo:

```html
@for (producto of productos; track producto.id; let primero = $first) {

  @if (primero) {
    <strong>Primer producto</strong>
  }

  <p>{{ producto.nombre }}</p>

}
```

---

# 15. `@empty`

`@for` puede incorporar un bloque `@empty`.

```html
<ul>

  @for (producto of productos; track producto.id) {

    <li>
      {{ producto.nombre }}
    </li>

  } @empty {

    <li>
      No existen productos disponibles.
    </li>

  }

</ul>
```

Esto evita tener que escribir una condición separada para una colección vacía.

---

# 16. `@switch`

Permite seleccionar contenido según el valor de una expresión.

```html
@switch (estado) {

  @case ('disponible') {
    <p>Producto disponible</p>
  }

  @case ('agotado') {
    <p>Producto agotado</p>
  }

  @default {
    <p>Estado desconocido</p>
  }

}
```

---

# 17. Combinar `@for` y `@if`

Ejemplo:

```html
<ul>

  @for (producto of productos; track producto.id) {

    <li>

      <strong>
        {{ producto.nombre }}
      </strong>

      @if (producto.stock > 0) {

        <span>
          Disponible
        </span>

      } @else {

        <span>
          Sin stock
        </span>

      }

    </li>

  }

</ul>
```

---

# 18. Combinar directivas y control de flujo

```html
<ul>

  @for (producto of productos; track producto.id) {

    <li
      [ngClass]="{
        'opacity-50': producto.stock === 0
      }"
    >

      <a
        [routerLink]="['/productos', producto.id]"
      >
        {{ producto.nombre }}
      </a>

      @if (producto.stock > 0) {

        <span>
          Stock: {{ producto.stock }}
        </span>

      } @else {

        <span>
          Sin stock
        </span>

      }

    </li>

  }

</ul>
```

En este ejemplo:

| Elemento | Tipo |
|---|---|
| `@for` | Control de flujo |
| `@if` | Control de flujo |
| `NgClass` | Directiva de atributo |
| `RouterLink` | Directiva |
| `{{ producto.nombre }}` | Interpolación |
| `[routerLink]` | Binding hacia una directiva |

---

# 19. Crear una directiva personalizada

Angular permite crear nuestras propias directivas.

Angular CLI:

```bash
ng generate directive directives/highlight
```

Forma abreviada:

```bash
ng g d directives/highlight
```

Puede generarse un archivo similar a:

```text
src/app/directives/highlight.ts
```

---

# 20. Ejemplo: directiva `Highlight`

```typescript
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class Highlight {

  constructor(private element: ElementRef) {

    this.element.nativeElement.style.backgroundColor = 'yellow';

  }

}
```

Utilización:

```html
<p appHighlight>
  Producto destacado
</p>
```

Conceptualmente:

```text
<p>
 +
appHighlight
    ↓
Angular aplica comportamiento
    ↓
<p con fondo amarillo>
```

---

# 21. Reaccionar a eventos en una directiva

Podemos hacer que la directiva responda al mouse.

```typescript
import {
  Directive,
  ElementRef,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class Highlight {

  constructor(private element: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.element.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.element.nativeElement.style.backgroundColor = '';
  }

}
```

HTML:

```html
<p appHighlight>
  Pase el mouse sobre este texto.
</p>
```

---

# 22. Directiva con parámetro

Una directiva también puede recibir valores.

```typescript
import {
  Directive,
  ElementRef,
  Input,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class Highlight {

  @Input() appHighlight = 'yellow';

  constructor(private element: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.element.nativeElement.style.backgroundColor =
      this.appHighlight;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.element.nativeElement.style.backgroundColor = '';
  }
}
```

Uso:

```html
<p [appHighlight]="'lightblue'">
  Producto destacado
</p>
```

---

# 23. Importar una directiva propia en un componente standalone

```typescript
import { Component } from '@angular/core';
import { Highlight } from '../../directives/highlight';

@Component({
  selector: 'app-productos',

  imports: [
    Highlight
  ],

  templateUrl: './productos.html'
})
export class Productos {
}
```

---

# 24. Directivas estructurales personalizadas

También es posible crear directivas estructurales propias.

Estas son útiles cuando necesitamos **comportamiento reutilizable de renderizado** que no queda cubierto adecuadamente por:

```text
@if
@for
@switch
```

Ejemplos posibles:

```text
*appHasRole
*appPermission
*appFeatureEnabled
*appLoadData
```

Ejemplo conceptual:

```html
<button *appHasRole="'admin'">
  Eliminar usuario
</button>
```

La directiva decide si el fragmento debe renderizarse.

> Este tipo de directivas es más avanzado y normalmente requiere trabajar con `TemplateRef` y `ViewContainerRef`.

---

# 25. `ng-container`

`ng-container` permite agrupar contenido Angular sin crear un elemento HTML adicional en el DOM.

Ejemplo:

```html
<ng-container>

  <p>Producto</p>

  <p>Precio</p>

</ng-container>
```

Es útil cuando se necesita agrupar lógica de template sin agregar un `<div>` adicional.

---

# 26. `ng-template`

`ng-template` define un fragmento de contenido que no se renderiza directamente.

Ejemplo:

```html
<ng-template #sinProductos>

  <p>
    No existen productos.
  </p>

</ng-template>
```

Históricamente ha sido fundamental para comprender cómo funcionan las directivas estructurales.

---

# 27. Directivas en componentes standalone

En un componente standalone se deben importar las directivas que se utilizarán cuando corresponda.

Ejemplo:

```typescript
import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-productos',

  imports: [
    NgClass,
    RouterLink
  ],

  templateUrl: './productos.html'
})
export class Productos {
}
```

Pero los bloques:

```text
@if
@for
@switch
```

son parte de la sintaxis actual del template y no necesitan incorporarse en `imports`.

---

# 28. Sintaxis antigua vs Angular actual

## Sintaxis tradicional

```html
<div *ngIf="mostrar">
  Contenido
</div>
```

```html
<li *ngFor="let producto of productos">
  {{ producto.nombre }}
</li>
```

## Angular actual

```html
@if (mostrar) {
  <div>
    Contenido
  </div>
}
```

```html
@for (producto of productos; track producto.id) {
  <li>
    {{ producto.nombre }}
  </li>
}
```

Para código nuevo es preferible utilizar el control de flujo actual.

---

# 29. Resumen de mecanismos

| Mecanismo | Qué hace | Ejemplos |
|---|---|---|
| Componente | Define una unidad de interfaz con template | `@Component` |
| Directiva de atributo | Modifica elemento existente | `NgClass`, `NgStyle`, `RouterLink` |
| Directiva estructural | Controla renderizado reutilizable | directivas propias sobre `ng-template` |
| Control de flujo | Condiciones y repeticiones del template | `@if`, `@for`, `@switch` |
| Interpolación | Muestra valores como texto | `{{ nombre }}` |
| Property binding | Asigna una propiedad | `[src]`, `[disabled]` |
| Event binding | Escucha un evento | `(click)` |

---

# 30. Ejemplo integrado con productos

## TypeScript

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

```typescript
productos: Product[] = [
  {
    id: 1,
    nombre: 'Notebook',
    description: 'Notebook 14 pulgadas',
    images: ['notebook.jpg'],
    price: 699990,
    stock: 4
  },

  {
    id: 2,
    nombre: 'Mouse',
    description: 'Mouse inalámbrico',
    images: ['mouse.jpg'],
    price: 29990,
    stock: 0
  }
];
```

## Template

```html
<ul>

  @for (producto of productos; track producto.id) {

    <li
      [ngClass]="{
        'opacity-50': producto.stock === 0
      }"
    >

      <img
        [src]="producto.images[0]"
        [alt]="producto.nombre"
        width="100"
      >

      <a
        [routerLink]="['/productos', producto.id]"
      >
        {{ producto.nombre }}
      </a>

      <p>
        {{ producto.description }}
      </p>

      <p>
        Precio: ${{ producto.price }}
      </p>

      @if (producto.stock > 0) {

        <span>
          Disponible: {{ producto.stock }}
        </span>

      } @else {

        <span>
          Sin stock
        </span>

      }

    </li>

  } @empty {

    <li>
      No existen productos registrados.
    </li>

  }

</ul>
```

---

# 31. Errores frecuentes

## Confundir `@for` con una directiva

Incorrecto conceptualmente:

```text
@for = directiva
```

Más preciso:

```text
@for = bloque de control de flujo
```

---

## Olvidar importar una directiva

Si utilizamos:

```html
<div [ngClass]="...">
```

debemos disponer de `NgClass` en los imports del componente standalone.

---

## Utilizar `*ngFor` y `@for` como si fueran lo mismo

Resuelven un problema similar, pero pertenecen a mecanismos diferentes:

```text
*ngFor
→ directiva estructural tradicional

@for
→ control de flujo actual
```

---

## Usar una directiva para lógica de negocio

Las directivas deben concentrarse principalmente en comportamiento asociado a la interfaz.

La lógica principal del negocio debería mantenerse en servicios, casos de uso o backend según corresponda.

---

# 32. Idea final

```text
Angular Template
      │
      ├── Componentes
      │
      ├── Directivas de atributo
      │      ├── RouterLink
      │      ├── NgClass
      │      └── NgStyle
      │
      ├── Directivas estructurales personalizadas
      │
      └── Control Flow
             ├── @if
             ├── @for
             └── @switch
```

Una forma sencilla de recordarlo:

> **Las directivas agregan comportamiento reutilizable al template; las directivas de atributo modifican elementos existentes, las estructurales controlan fragmentos renderizados y Angular actual utiliza `@if`, `@for` y `@switch` para el control de flujo cotidiano.**
