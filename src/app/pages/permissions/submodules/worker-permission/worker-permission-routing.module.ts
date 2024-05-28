import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkerPermissionComponent } from './index/index.component';

const routes: Routes = [{ path: '', component: WorkerPermissionComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class WorkerPermissionRoutingModule { }
