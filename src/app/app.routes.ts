import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((module) => module.LandingComponent),
    title: 'Yego Pet — Veterinaria a domicilio',
  },
  {
    path: 'tienda',
    loadComponent: () => import('./pages/store/store').then((module) => module.StoreComponent),
    title: 'Tienda · Yego Pet',
  },
  { path: '**', redirectTo: '' },
];
