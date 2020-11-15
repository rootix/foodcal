import { Component, Input } from '@angular/core';
import { isToday } from 'date-fns';

@Component({
    selector: 'fc-day-container',
    templateUrl: './day-container.component.html',
    styleUrls: ['./day-container.component.scss'],
})
export class DayContainerComponent {
    @Input() date: Date;

    get isToday() {
        return this.date && isToday(this.date);
    }
}
