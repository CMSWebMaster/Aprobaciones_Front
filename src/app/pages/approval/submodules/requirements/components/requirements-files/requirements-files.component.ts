import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileViewerComponent } from 'src/app/commom/shared-components/file-viewer/file-viewer.component';
import { IFilesRequirement } from 'src/app/pages/approval/models/IFilesRequirement';

@Component({
	selector: 'app-requirements-files',
	standalone: true,
	imports: [CommonModule, FileViewerComponent],
	templateUrl: './requirements-files.component.html',
	styleUrl: './requirements-files.component.scss'
})
export class RequirementsFilesComponent {

	@Input() filesRequirement: IFilesRequirement[];
	@ViewChild('viewDocument', { static: true }) viewDocument: TemplateRef<any>;
	fileUrl: string;
	fileType: string = 'ppt';
	fileName: string = '';
	private modalRef: any;

	constructor(private modalService: NgbModal) { }

	openDetailsFile(item: IFilesRequirement) {
		this.fileUrl = item.Archivo;
		this.fileName = item.Archivo;
		this.modalRef = this.modalService.open(this.viewDocument, {
			centered: true,
			backdrop: 'static',
			size: 'md'
		});

		this.modalRef.result.then(
			(result) => {
				console.log('Modal cerrado con resultado:', result);
				this.fileUrl = '';
			},
			(reason) => {
				console.log('Modal descartado con motivo:', reason);
				this.fileUrl = '';
			}
		);

		this.modalRef.shown.subscribe(() => {
			console.log('Modal se ha abierto');
			// this.onModalOpen();
			this.fileName = item.Archivo;
		});
	}

	closeModal() {
		this.modalRef.close();
	}
}
