import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Week } from '../../models/schedule.model';

@Component({
    selector: 'fc-week-selector',
    templateUrl: './week-selector.component.html',
    styleUrls: ['./week-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekSelectorComponent {
    @Input() week: Week;
    @Output() switchToNextWeek = new EventEmitter();
    @Output() switchToPreviousWeek = new EventEmitter();
}
