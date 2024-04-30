import { Component, AfterViewInit } from '@angular/core';
import { PageAnalyzerComponent } from '../dashboard-components/page-analyzer/pa.component';
import { ActivityComponent } from '../dashboard-components/activity-timeline/activity.component';
import { TotalSalesComponent } from '../dashboard-components/total-sales/total-sales.component';
import { SalesEarningComponent } from '../dashboard-components/sales-earning/sales-earning.component';
import { ProjectComponent } from '../dashboard-components/project/project.component';

@Component({
  templateUrl: './dashboard3.component.html',
  standalone: true,
  imports: [
    PageAnalyzerComponent,
    ActivityComponent,
    TotalSalesComponent,
    SalesEarningComponent,
    ProjectComponent,
    ActivityComponent,
  ],
  styleUrls: ['./dashboard3.component.css'],
})
export class Dashboard3Component implements AfterViewInit {
  subtitle: string;

  constructor() {}

  ngAfterViewInit() {}
}
