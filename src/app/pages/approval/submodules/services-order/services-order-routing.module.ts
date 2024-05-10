import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesOrderComponent } from './index/index.component';

const routes: Routes = [{ path: '', component: ServicesOrderComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ServicesOrderRoutingModule { }
