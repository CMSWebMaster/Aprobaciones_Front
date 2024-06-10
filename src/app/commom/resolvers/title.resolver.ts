import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class TitleResolver implements Resolve<string> {
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string {
		const id = route.paramMap.get('id');
		return id === '1' ? 'Órdenes de Compra' : 'Órdenes de Servicio';
	}
}
