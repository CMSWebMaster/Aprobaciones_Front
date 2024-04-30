import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { IncomeCounterComponent } from '../dashboard-components/income-counter/income-counter.component';
import { WebsiteVisitComponent } from '../dashboard-components/website-visit/website-visit.component';
import { SalesOverviewComponent } from '../dashboard-components/sales-overview/sales-overview.component';
import { ProjectComponent } from '../dashboard-components/project/project.component';
import { ActivityComponent } from '../dashboard-components/activity-timeline/activity.component';
import { RecentcommentComponent } from '../dashboard-components/recent-comment/recent-comment.component';
import { FeedsComponent } from '../dashboard-components/feeds/feeds.component';

@Component({
  templateUrl: './dashboard2.component.html',
  standalone: true,
  imports: [
    IncomeCounterComponent,
    WebsiteVisitComponent,
    SalesOverviewComponent,
    ProjectComponent,
    ActivityComponent,
    RecentcommentComponent,
    FeedsComponent,
  ],
  styleUrls: ['./dashboard2.component.css'],
})
export class Dashboard2Component implements AfterViewInit {
  subtitle: string;

  constructor() {
    this.subtitle = 'This is some text within a card block.';
  }

  ngAfterViewInit() {}
}
