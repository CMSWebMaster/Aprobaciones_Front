import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ProjectCounterComponent } from '../dashboard-components/project-counter/project-counter.component';
import { MonthlyIncomeComponent } from '../dashboard-components/monthly-income/monthly-income.component';
import { VisitSeparationComponent } from '../dashboard-components/visit-separation/visit-separation.component';
import { EarningComponent } from '../dashboard-components/earning-report/earning-report.component';
import { RecentcommentComponent } from '../dashboard-components/recent-comment/recent-comment.component';
import { SocialSliderComponent } from '../dashboard-components/social-slider/social-slider.component';
import { ActivityComponent } from '../dashboard-components/activity-timeline/activity.component';
import { ProfileComponent } from '../dashboard-components/profile/profile.component';

@Component({
  templateUrl: './dashboard1.component.html',
  standalone: true,
  imports: [
    ProjectCounterComponent,
    MonthlyIncomeComponent,
    VisitSeparationComponent,
    EarningComponent,
    RecentcommentComponent,
    SocialSliderComponent,
    ActivityComponent,
    ProfileComponent,
  ],
  styleUrls: ['./dashboard1.component.css'],
})
export class Dashboard1Component implements AfterViewInit {
  subtitle: string;
  constructor() {
    this.subtitle = 'This is some text within a card block.';
  }

  ngAfterViewInit() {}
}
