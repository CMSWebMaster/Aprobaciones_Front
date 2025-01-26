import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import {
  PaginaPacientesProgramadosOperacionesComponent
} from "./pages/emergencia/pagina-pacientes-programados-operaciones/pagina-pacientes-programados-operaciones.component";

export const Approutes: Routes = [
	{
		path: 'approval',
		loadChildren: () =>
			import('./pages/approval/approval.module').then((m) => m.ApprovalModule),
	},
	{
		path: '',
		component: FullComponent,
		children: [
			{ path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
			{
				path: 'dashboard',
				loadChildren: () =>
					import('./dashboards/dashboard.module').then(
						(m) => m.DashboardModule
					),
			},
			{
				path: 'cards',
				loadChildren: () =>
					import('./cards/cards.module').then((m) => m.CardsModule),
			},
			{
				path: 'charts',
				loadChildren: () =>
					import('./charts/charts.module').then((m) => m.ChartModule),
			},
			{ path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule) },
			{
				path: 'ecom',
				loadChildren: () =>
					import('./ecommerce/ecom.module').then((m) => m.EcomModule),
			},
			{
				path: 'tables',
				loadChildren: () =>
					import('./table/tables.module').then((m) => m.TablesModule),
			},

			{
				path: 'timeline',
				loadChildren: () =>
					import('./timeline/timeline.module').then((m) => m.TimelineModule),
			},
			{
				path: 'extra-component',
				loadChildren: () =>
					import('./extra-component/extra-component.module').then(
						(m) => m.ExtraComponentModule
					),
			},
			{
				path: 'icons',
				loadChildren: () =>
					import('./icons/icons.module').then((m) => m.IconsModule),
			},
			{
				path: 'forms',
				loadChildren: () =>
					import('./form/forms.module').then((m) => m.FormModule),
			},
			{
				path: 'starter',
				loadChildren: () =>
					import('./starter/starter.module').then((m) => m.StarterModule),
			},
			{
				path: 'widgets',
				loadChildren: () =>
					import('./widgets/widgets.module').then((m) => m.WidgetsModule),
			},
			{
				path: 'component',
				loadChildren: () =>
					import('./component/component.module').then(
						(m) => m.ComponentsModule
					),
			},
			{
				path: 'sample-pages',
				loadChildren: () =>
					import('./sample-pages/sample-pages.module').then(
						(m) => m.SamplePagesModule
					),
			},

      {
        path: 'emergencias/pacientes',
        loadComponent: () =>
          import('./pages/emergencia/pagina-pacientes-en-emergencia/pagina-pacientes-en-emergencia.component')
            .then(m => m.PaginaPacientesEnEmergenciaComponent),
        data: {
          title: 'Pacientes en Emergencia',
          urls: [
            {
              url: '/dashboard',
              title: 'Emergencia',
            },
            {
              title: 'Pacientes en emergencia',
            }
          ]
        }
			},

      //para redigir a pacientes internados inicio
      {
        path: 'emergencias/internados',
        loadComponent: () =>
          import('./pages/emergencia/pagina-pacientes-internados/pagina-pacientes-internados.component')
            .then(m => m.PaginaPacientesInternadosComponent),
        data: {
          title: 'Pacientes Internados',
          urls: [
            {
              url: '/dashboard',
              title: 'Emergencia',
            },
            {
              title: 'Pacientes internados',
            }
          ]
        }
      },
      //para redigir a pacientes internados fin

      //para redigir a pacientes programdos inicio
      {
        path: 'emergencias/programados',
        loadComponent: () =>
          import('./pages/emergencia/pagina-pacientes-programados-operaciones/pagina-pacientes-programados-operaciones.component')
            .then(m => m.PaginaPacientesProgramadosOperacionesComponent),
        data: {
          title: 'Pacientes Programados en Sala de Operaciones',
          urls: [
            {
              url: '/dashboard',
              title: 'Emergencia',
            },
            {
              title: 'Pacientes programados',
            }
          ]
        }
      },
      //para redigir a pacientes programdos fin
      //borrar



      {
        path: 'colaborador/marcaciones',
        loadComponent: () =>
          import('./pages/colaborador/pagina-marcaciones/pagina-marcaciones.component')
            .then(m => m.PaginaMarcacionesComponent),
        data: {
          title: 'Marcaciones',
          urls: [
            {
              url: '/dashboard',
              title: 'Colaborador',
            },
            {
              title: 'Marcaciones',
            }
          ]
        }
			},

			{
				path: 'vacaciones/pendientes',
				loadComponent: () =>
					import('./pages/vacaciones/pagina-vacaciones-pendientes/pagina-vacaciones-pendientes.component'),
        data: {
          title: 'Vacaciones Pendientes',
          urls: [
            {
              url: '/dashboard',
              title: 'Vacaciones',
            },
            {
              title: 'Pendientes',
            }
          ]
        }
			},
			{
				path: 'vacaciones/tomadas',
				loadComponent: () =>
					import('./pages/vacaciones/pagina-vacaciones-tomadas/pagina-vacaciones-tomadas.component'),
        data: {
          title: 'Vacaciones Tomadas',
          urls: [
            {
              url: '/dashboard',
              title: 'Vacaciones',
            },
            {
              title: 'Tomadas',
            }
          ]
        }
			},
		],
	},
	{
		path: '',
		component: BlankComponent,
		children: [
			{
				path: 'authentication',
				loadChildren: () =>
					import('./authentication/authentication.module').then(
						(m) => m.AuthenticationModule
					),
			},
		],
	},
	{
		path: '**',
		redirectTo: '/authentication/404',
	},
];
