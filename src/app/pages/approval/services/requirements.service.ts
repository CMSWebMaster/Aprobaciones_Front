import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApprovalRequeriments } from '../models/IApprovalRequeriments';
import { Observable, catchError, of } from 'rxjs';
import { RequirementsConstants } from '../common/constants/requirements.contants';
import { IRequirementDetail } from '../models/IRequierementDetail';
import { IExecuteRequirements } from '../models/IExecuteRequirements';
import { IFilesRequirement } from '../models/IFilesRequirement';

@Injectable({
	providedIn: 'root'
})
export class RequirementsService {

	constructor(private http: HttpClient) { }

	listApprovalRequirements(codUser: string): Observable<IApprovalRequeriments[]> {
		return this.http
			.get<IApprovalRequeriments[]>(`${RequirementsConstants.BASE_URL}/${RequirementsConstants.LIST_APPROVAL_REQUIREMENTS}/${codUser}`)
			.pipe(catchError((err) => of(err)));
	}
	getRequierementDetail(codRequirement: string): Observable<IRequirementDetail[]> {
		return this.http
			.get<IRequirementDetail[]>(`${RequirementsConstants.BASE_URL}/${RequirementsConstants.GET_REQUIREMENT_DETAIL}/${codRequirement}`)
			.pipe(catchError((err) => of(err)));
	}
	executeApproveRequirement(request: IExecuteRequirements): Observable<boolean> {
		return this.http.post<boolean>(`${RequirementsConstants.BASE_URL}/${RequirementsConstants.EXECUTE_APPROVE_REQUIREMENT}`, request);
	}
	executeRejectRequirement(request: IExecuteRequirements): Observable<boolean> {
		return this.http.post<boolean>(`${RequirementsConstants.BASE_URL}/${RequirementsConstants.EXECUTE_REJECT_REQUIREMENT}`, request);
	}
	getFilesRequirement(codRequirement: string): Observable<IFilesRequirement[]> {
		return this.http
			.get<IFilesRequirement[]>(`${RequirementsConstants.BASE_URL}/${RequirementsConstants.GET_FILES_REQUIREMENT}/${codRequirement}`)
			.pipe(catchError((err) => of(err)));
	}
}
