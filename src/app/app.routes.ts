import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { NotAuthenticatedComponent } from './components/not-authenticated/not-authenticated.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'pokemons',
        pathMatch: 'full',
      },
      {
        path: 'pokemons',
        canLoad: [AuthenticatedGuard],
        loadChildren: () =>
          import('./pokemons/pokemons.route').then((m) => m.PokemonsRoute),
      },
    ],
  },
  {
    path: 'not-auth',
    component: NotAuthenticatedComponent,
  },
];
