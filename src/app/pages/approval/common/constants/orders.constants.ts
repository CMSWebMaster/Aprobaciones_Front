import { environment } from 'src/environments/environment';

export class OrdersConstants {
	public static readonly BASE_URL: string = environment.api_url + '/Approval';
	public static readonly LIST_APPROVAL_SERVICES_ORDER: string = 'ListApprovalServicesOrder';
	public static readonly GET_SERVICE_ORDER_DETAILS: string = 'GetServiceOrderDetails';
	public static readonly EXECUTE_APPROVAL_SERVICE_ORDER: string = 'ExecuteApprovalServiceOrder';
	public static readonly LIST_APPROVAL_PURCHASE_ORDER: string = 'ListApprovalPurchaseOrder';
	public static readonly GET_PURCHASE_ORDER_DETAILS: string = 'GetPurchaseOrderDetails';
	public static readonly EXECUTE_APPROVAL_PURCHASE_ORDER: string = 'ExecuteApprovalPurchaseOrder';
	public static readonly GET_USERS_APPROVERS: string = 'GetUsersApprovers';
}
