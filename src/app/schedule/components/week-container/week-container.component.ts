import { Component, HostBinding, Input } from '@angular/core';

import { MealsPerDay } from '../../models/schedule.model';

@Component({
    selector: 'fc-week-container',
    templateUrl: './week-container.component.html',
    styleUrls: ['./week-container.component.scss']
})
export class WeekContainerComponent {
    @Input() mealsOfWeek: MealsPerDay[];
    @HostBinding('class.loading') @Input() loading: boolean;
}
