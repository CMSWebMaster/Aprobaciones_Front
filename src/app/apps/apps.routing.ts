import { Routes } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { TicketsComponent } from './ticketlist/tickets.component';
import { TicketdetailsComponent } from './ticketdetails/ticketdetails.component';
import { TaskboardComponent } from './taskboard/taskboard.component';
import { FullcalendarComponent } from "./fullcalendar/fullcalendar.component";
import { TodosComponent } from './todos/todos.component';
import { NotesComponent } from './notes/notes.component';
import { ContactComponent } from './contact/contact.component';
import { ContactsComponent } from './contacts/contacts.component';
import { TasksComponent } from './tasks/tasks.component';
import { ContactListComponent } from './contact-list/contact-list.component';

import { MailboxComponent } from './mail/mailbox.component';
import { DetailComponent } from './mail/detail/detail.component';
import { ComposeComponent } from './mail/compose/compose.component';

import { ListUsersComponent } from './users/list-users/list-users.component';

import { UserRxjsComponent } from './user-rxjs/user-rxjs.component';
import { ContactRxjsComponent } from './contact-rxjs/contact-rxjs.component';
import { ContactListRxjsComponent } from './contact-list-rxjs/contact-list-rxjs.component';

import { ListInvoicesComponent } from './invoice/list-invoices/list-invoices.component';
import { AddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { ViewInvoiceComponent } from './invoice/view-invoice/view-invoice.component';
import { EditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';

import { JobsListComponent } from './jobs/jobs-list/jobs-list.component';
import { JobDetailComponent } from './jobs/job-detail/job-detail.component';
import { JobApplyComponent } from './jobs/job-apply/job-apply.component';
import { RequirementsComponent } from '../pages/approval/submodules/requirements/index/index.component';
import { OrdersComponent } from '../pages/approval/submodules/orders/index/index.component';
import { WorkerPermissionComponent } from '../pages/permissions/submodules/worker-permission/index/index.component';
import { TitleResolver } from '../commom/resolvers/title.resolver';

export const AppsRoutes: Routes = [
	{
		path: 'orders/:id',
		component: OrdersComponent,
		data: {
			title: 'Órdenes',
			urls: [
				{ title: 'Apps', url: '/dashboard' },
				{ title: 'Órdenes' },
			],
		},
		resolve: {
			title: TitleResolver,
		},
	},
	{
		path: 'workerPermission',
		component: WorkerPermissionComponent,
		data: {
			title: 'Permiso de Trabajador',
			urls: [
				{ title: 'Apps', url: '/dashboard' },
				{ title: 'Permiso de Trabajador' },
			],
		},
	},
	{
		path: 'requirements',
		component: RequirementsComponent,
		data: {
			title: 'Requerimientos',
			urls: [
				{ title: 'Apps', url: '/dashboard' },
				{ title: 'Requerimientos' },
			],
		},
	},
	{
		path: 'vacaciones',
    loadComponent: () =>
          import('../pages/approval/submodules/pagina-aprobacion-vacaciones/pagina-aprobacion-vacaciones.component')
            .then(m => m.PaginaAprobacionVacacionesComponent),
		data: {
			title: 'Vacaciones',
			urls: [
				{ title: 'Apps', url: '/dashboard' },
				{ title: 'Vacaciones' },
			],
		},
	},
  {
		path: 'permisos',
    loadComponent: () =>
          import('../pages/approval/submodules/pagina-aprobacion-permisos/pagina-aprobacion-permisos.component')
            .then(m => m.PaginaAprobacionPermisosComponent),
		data: {
			title: 'Permisos RRHH',
			urls: [
				{ title: 'Apps', url: '/dashboard' },
				{ title: 'Permisos RRHH' },
			],
		},
	},
  {
		path: 'permisos-seguridad',
    loadComponent: () =>
          import('../pages/approval/submodules/pagina-aprobacion-permisos-seguridad/pagina-aprobacion-permisos-seguridad.component')
            .then(m => m.PaginaAprobacionPermisosSeguridadComponent),
		data: {
			title: 'Permisos Personal de Seguridad',
			urls: [
				{ title: 'Apps', url: '/dashboard' },
				{ title: 'Permisos Personal de Seguridad' },
			],
		},
	},
  {
		path: 'aprobacion-servicios',
    loadComponent: () =>
          import('../pages/approval/submodules/pagina-aprobacion-servicios/pagina-aprobacion-servicios.component')
            .then(m => m.PaginaAprobacionServiciosComponent),
		data: {
			title: 'Aprobación de servicios',
			urls: [
				{ title: 'Apps', url: '/dashboard' },
				{ title: 'Aprobación de servicios' },
			],
		},
	},
  {
		path: 'desconformidad-servicios',
    loadComponent: () =>
          import('../pages/approval/submodules/pagina-desconformidad-servicios/pagina-desconformidad-servicios.component')
            .then(m => m.PaginaDesconformidadServiciosComponent),
		data: {
			title: 'Servicios Aprobados',
			urls: [
				{ title: 'Apps', url: '/dashboard' },
				{ title: 'Servicios Aprobados' },
			],
		},
	},
	{
		path: '',
		children: [
			{
				path: 'chat',
				component: ChatComponent,
				data: {
					title: '',
					urls: [],
				},
			},

			{
				path: 'mail/:type',
				component: MailboxComponent,
				children: [
					{ path: ':id', component: DetailComponent },
					{ path: 'compose', component: ComposeComponent },
				],
				data: {
					title: '',
					urls: [],
				},
			},

			{
				path: 'ticket/ticketlist',
				component: TicketsComponent,
				data: {
					title: 'Ticket List',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'Ticket List' },
					],
				},
			},
			{
				path: 'ticket/ticketdetails',
				component: TicketdetailsComponent,
				data: {
					title: 'Ticket Details',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'Ticket Details' },
					],
				},
			},
			{
				path: 'taskboard',
				component: TaskboardComponent,
				data: {
					title: 'Taskboard',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'Taskboard' },
					],
				},
			},
			{
				path: "fullcalendar",
				component: FullcalendarComponent,
				data: {
					title: "Full-Calendar",
					urls: [
						{ title: "Dashboard", url: "/dashboard" },
						{ title: "Full-Calendar" },
					],
				},
			},
			{
				path: 'todo',
				component: TodosComponent,
				data: {
					title: '',
					urls: [],
				},
			},
			{
				path: 'tasks',
				component: TasksComponent,
				data: {
					title: '',
					urls: [],
				},
			},
			{
				path: 'contact-list',
				component: ContactListComponent,
				data: {
					title: '',
					urls: [],
				},
			},
			{
				path: 'contact-list-rxjs',
				component: ContactListRxjsComponent,
				data: {
					title: '',
					urls: [],
				},
			},
			{
				path: 'notes',
				component: NotesComponent,
				data: {
					title: '',
					urls: [],
				},
			},
			{
				path: 'users',
				component: ListUsersComponent,
				data: {
					title: 'Users App',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'Users App' },
					],
				},
			},
			{
				path: 'usersrxjs',
				component: UserRxjsComponent,
				data: {
					title: 'Users-Rxjs App',
					urls: [
						{ title: 'Apps', url: '/dashboard' },
						{ title: 'Users-Rxjs App' },
					],
				},
			},
			{
				path: 'contact-grid',
				component: ContactComponent,
				data: {
					title: 'Contact Grid',
					urls: [
						{ title: 'Dashboard', url: '/dashboard' },
						{ title: 'Contact Grid' },
					],
				},
			},
			{
				path: 'contact',
				component: ContactsComponent,
				data: {
					title: '',
					urls: [],
				},
			},
			{
				path: 'contactrxjs',
				component: ContactRxjsComponent,
				data: {
					title: '',
					urls: [],
				},
			},
			{
				path: 'invoice',
				component: ListInvoicesComponent,
				data: {
					title: 'Invoice',
					urls: [],
				},
			},
			{
				path: 'addinvoice',
				component: AddInvoiceComponent,
				data: {
					title: 'Add Invoice',
					urls: [],
				},
			},
			{
				path: 'viewinvoice/:id',
				component: ViewInvoiceComponent,
				data: {
					title: 'View Invoice',
					urls: [],
				},
			},
			{
				path: 'editinvoice/:id',
				component: EditInvoiceComponent,
				data: {
					title: '',
					urls: [],
				},
			},
			{
				path: 'jobs',
				component: JobsListComponent,
				data: {
					title: 'Jobs',
					urls: [],
				},
			},
			{
				path: 'job-detail/:id',
				component: JobDetailComponent,
				data: {
					title: 'Jobs Details',
					urls: [],
				},
			},
			{
				path: 'apply-job',
				component: JobApplyComponent,
				data: {
					title: 'Apply Job',
					urls: [],
				},
			},
		],
	},
];
