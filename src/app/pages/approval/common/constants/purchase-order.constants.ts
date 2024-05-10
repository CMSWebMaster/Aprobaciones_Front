import { environment } from 'src/environments/environment';

export class PurchaseOrderConstants {
	public static readonly BASE_URL: string = environment.api_url + '/Approval';
	public static readonly LIST_APPROVAL_PURCHASE_ORDER: string = 'ListApprovalPurchaseOrder';
	public static readonly GET_PURCHASE_ORDER_DETAILS: string = 'GetPurchaseOrderDetails';
}
