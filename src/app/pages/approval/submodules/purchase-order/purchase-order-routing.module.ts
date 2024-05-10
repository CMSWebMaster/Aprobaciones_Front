import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from './index/index.component';

const routes: Routes = [{ path: '', component: PurchaseOrderComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
