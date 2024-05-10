import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: 'purcharse-order', loadChildren: () => import('./submodules/purchase-order/purchase-order.module').then((m) => m.PurchaseOrderModule) },
	{ path: 'services-order', loadChildren: () => import('./submodules/services-order/services-order.module').then((m) => m.ServicesOrderModule) }
];


@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ApprovalRoutingModule { }
