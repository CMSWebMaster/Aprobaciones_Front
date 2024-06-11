import { environment } from 'src/environments/environment';

export class WorkerPermissionConstants {
	public static readonly BASE_URL: string = environment.api_url + '/Permission';
	public static readonly LIST_WORKER_PERMISSION: string = 'ListWorkerPermission';
	public static readonly ADD_WORKER_PERMISSION: string = 'AddWorkerPermission';
	public static readonly EXECUTE_APPROVE_PERMISSION: string = 'ExecuteApprovePermission';
	public static readonly EXECUTE_REJECT_PERMISSION: string = 'ExecuteRejectPermission';
	public static readonly LIST_APPROVERS: string = 'ListApprovers';
	public static readonly SEARCH_PERSON: string = 'SearchPersons';
	public static readonly MASTER_TABLE_LIST: string = 'MasterTableList';
}
