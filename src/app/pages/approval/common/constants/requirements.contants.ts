import { environment } from 'src/environments/environment';

export class RequirementsConstants {
	public static readonly BASE_URL: string = environment.api_url + '/Requirement';
	public static readonly LIST_APPROVAL_REQUIREMENTS: string = 'ListApprovalRequirements';
	public static readonly GET_REQUIREMENT_DETAIL: string = 'GetRequirementDetail';
	public static readonly EXECUTE_APPROVE_REQUIREMENT: string = 'ExecuteApproveRequirement';
	public static readonly EXECUTE_REJECT_REQUIREMENT: string = 'ExecuteRejectRequirement';
	public static readonly GET_FILES_REQUIREMENT: string = 'GetFilesRequirement';
}
