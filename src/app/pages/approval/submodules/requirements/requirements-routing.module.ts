import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequirementsComponent } from './index/index.component';

const routes: Routes = [{ path: '', component: RequirementsComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RequirementsRoutingModule { }
