import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'fc-day-container',
    templateUrl: './day-container.component.html',
    styleUrls: ['./day-container.component.scss']
})
export class DayContainerComponent implements OnInit {
    @Input() date: Date;

    constructor() {}

    ngOnInit() {}
}
