import { environment } from 'src/environments/environment';

export class WorkerPermissionConstants {
	public static readonly BASE_URL: string = environment.api_url + '/Approval';
	public static readonly LIST_WORKER_PERMISSION: string = 'ListWorkerPermission';
	public static readonly ADD_WORKER_PERMISSION: string = 'AddWorkerPermission';
}
