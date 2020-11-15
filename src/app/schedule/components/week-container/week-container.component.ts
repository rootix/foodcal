import { Component, HostBinding, Input, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { DialogService } from 'src/app/shared/dialog/dialog.service';

import { Meal, MealsPerDay } from '../../models/schedule.model';
import { CreateMeal, DeleteMeal, UpdateMeal } from '../../state/schedule.actions';
import { MealDialogComponent } from '../meal-dialog/meal-dialog.component';

@Component({
    selector: 'fc-week-container',
    templateUrl: './week-container.component.html',
    styleUrls: ['./week-container.component.scss'],
})
export class WeekContainerComponent {
    @Input() mealsOfWeek: MealsPerDay[];
    @ViewChild(MealDialogComponent) dialog: MealDialogComponent;
    @HostBinding('class.loading') @Input() loading: boolean;

    constructor(private store: Store, private dialogService: DialogService) {}

    onCreateMeal(meal: Meal) {
        this.dialog.open(meal, m => this.store.dispatch(new CreateMeal(m)));
    }

    onEditMeal(meal: Meal) {
        this.dialog.open(meal, m => this.store.dispatch(new UpdateMeal(m)));
    }

    onDeleteMeal(meal: Meal) {
        this.dialogService
            .confirm(
                'Bestätigen',
                'Soll das Menu wirklich gelöscht werden?',
                () => this.store.dispatch(new DeleteMeal(meal._id)),
                'Löschen',
                'btn-danger'
            )
            .subscribe();
    }
}
