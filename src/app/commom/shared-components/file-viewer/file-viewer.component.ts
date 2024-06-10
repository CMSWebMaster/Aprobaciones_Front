import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@Component({
	selector: 'app-file-viewer',
	standalone: true,
	imports: [PdfViewerModule, NgxDocViewerModule],
	templateUrl: './file-viewer.component.html',
	styleUrl: './file-viewer.component.scss'
})
export class FileViewerComponent {
	@Input() fileUrl: string;
	@Input() fileType: string;
	safeUrl: SafeResourceUrl;

	constructor(private sanitizer: DomSanitizer) { }

	ngOnChanges(changes: any) {
		if (changes.fileUrl && this.fileUrl && changes.fileType && this.fileType) {
			console.log(this.fileUrl);
			this.fileUrl = 'https://filesamples.com/samples/document/ppt/sample2.ppt';
			this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl());
		}
	}

	getEmbedUrl(): string {
		if (this.fileType === 'doc' || this.fileType === 'docx' || this.fileType === 'ppt' || this.fileType === 'pptx' || this.fileType === 'xls' || this.fileType === 'xlsx' || this.fileType === 'txt') {
			return `https://docs.google.com/gview?url=${this.fileUrl}&embedded=true`;
		}
		return this.fileUrl;
	}
}
