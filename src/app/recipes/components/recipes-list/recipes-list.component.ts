import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Recipe } from '../../models/recipes.model';

@Component({
    selector: 'fc-recipes-list',
    templateUrl: './recipes-list.component.html',
    styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements AfterViewInit, OnDestroy {
    @Input() recipes: Recipe[];
    @Input() loading: boolean;
    @Output() addRecipe = new EventEmitter();
    @Output() editRecipe = new EventEmitter<Recipe>();
    @Output() deleteRecipe = new EventEmitter<Recipe>();

    @ViewChild(ClrDatagrid) grid: ClrDatagrid;

    private destroySubject = new Subject();

    ngAfterViewInit() {
        // This is a hack because Clarity does not delete removed rows
        this.grid.rows.changes.pipe(takeUntil(this.destroySubject)).subscribe(_ => this.grid.resize());
    }

    ngOnDestroy() {
        this.destroySubject.next();
    }

    trackById(_: number, item: Recipe) {
        return item && item.id;
    }
}