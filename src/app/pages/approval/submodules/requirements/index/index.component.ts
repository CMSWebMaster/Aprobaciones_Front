import { Component, OnInit } from '@angular/core';
import { RequirementsTableComponent } from '../components/requirements-table/requirements-table.component';
import { RequirementsService } from '../../../services/requirements.service';
import { IRequirementDetail } from '../../../models/IRequierementDetail';
import { RequirementsSummaryComponent } from '../components/requirements-summary/requirements-summary.component';
import { IApprovalRequeriments } from '../../../models/IApprovalRequeriments';
import { IFilesRequirement } from '../../../models/IFilesRequirement';

@Component({
	selector: 'app-index',
	standalone: true,
	imports: [RequirementsTableComponent, RequirementsSummaryComponent],
	templateUrl: './index.component.html',
	styleUrl: './index.component.scss'
})
export class RequirementsComponent implements OnInit {

	rows: any = [];
	rowsSummary: IRequirementDetail[] = [];
	rowSelected: IApprovalRequeriments;
	showDetail: boolean = false;
	persona: string = '';
	filesRequirement: IFilesRequirement[] = [];

	constructor(private requirementsService: RequirementsService) {
		this.persona = localStorage.getItem('CodigoUsuario');
	}

	ngOnInit(): void {
		this.listApprovalRequirements();
	}

	listApprovalRequirements() {
		this.requirementsService.listApprovalRequirements(this.persona).subscribe({
			next: (response) => {
				console.log(response);
				this.rows = response;
			},
			error: (error) => {
				console.log(error);
				this.rows = [];
			}
		});
	}

	getRequirementsDetails(e: any) {
		this.rowsSummary = e.details;
		this.rowSelected = e.rowSelected;
		this.filesRequirement = e.files;
		this.showDetail = true;
	}

	backToRequirementTable() {
		this.listApprovalRequirements();
		this.showDetail = false;
	}
}
