import { Routes } from '@angular/router';
import { Productos } from './components/productos/productos';
import { Inicio } from './components/inicio/inicio';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
    {path: '', component:Inicio},
    {path:"products", component:Productos},
    {path: '**', component: NotFound}
];