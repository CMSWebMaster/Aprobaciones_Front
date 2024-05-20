import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IFilesRequirement } from 'src/app/pages/approval/models/IFilesRequirement';

@Component({
	selector: 'app-requirements-files',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './requirements-files.component.html',
	styleUrl: './requirements-files.component.scss'
})
export class RequirementsFilesComponent {

	@Input() filesRequirement: IFilesRequirement[];

	ngOnChanges(changes: any) {
		console.log(changes);
	}
}
