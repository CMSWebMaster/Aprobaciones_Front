import { environment } from 'src/environments/environment';

export class ApprovalConstants {
	public static readonly BASE_URL: string = environment.api_url + '/Approval';
	public static readonly GET_USERS_APPROVERS: string = 'GetUsersApprovers';
}
