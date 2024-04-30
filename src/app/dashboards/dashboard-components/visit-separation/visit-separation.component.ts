import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexStroke,
  ApexPlotOptions,
  NgApexchartsModule,
} from 'ng-apexcharts';

export interface visitseparationChartOptions {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  stroke: ApexStroke | any;
  dataLabels: ApexDataLabels | any;
  legends: ApexLegend | any;
  labels: any;
  name: any;
  tooltip: ApexTooltip | any;
  colors: string[] | any;
  plotOptions: ApexPlotOptions | any;
}

@Component({
  selector: 'app-visit-separation',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './visit-separation.component.html',
  styleUrls: ['./visit-separation.component.css'],
})
export class VisitSeparationComponent implements OnInit {
  @ViewChild('chart') chart2: ChartComponent = Object.create(null);
  public visitseparationChartOptions: Partial<visitseparationChartOptions>;

  constructor() {
    this.visitseparationChartOptions = {
      series: [150, 450, 200, 20],
      chart: {
        fontFamily: 'Montserrat,sans-serif',
        type: 'donut',
        height: 240,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70px',
          },
        },
      },
      tooltip: {
        fillSeriesColor: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0,
      },
      legends: {
        show: false,
      },
      labels: ['Tablet', 'Desktop', 'Mobile', 'Other'],
      colors: [
        'rgb(116, 90, 242)',
        'rgb(30, 136, 229)',
        '#06d79c',
        'rgb(236, 239, 241)',
      ],
    };
  }

  ngOnInit(): void {}
}
