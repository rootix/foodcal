import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ClrDatagrid, ClrDatagridSortOrder } from '@clr/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recipe } from 'src/app/shared/models';

@Component({
    selector: 'fc-recipes-list',
    templateUrl: './recipes-list.component.html',
    styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements AfterViewInit, OnDestroy {
    @Input() recipes: Recipe[];
    @Input() loading: boolean;
    @Output() createRecipe = new EventEmitter();
    @Output() editRecipe = new EventEmitter<Recipe>();
    @Output() deleteRecipe = new EventEmitter<Recipe>();

    @ViewChild(ClrDatagrid) grid: ClrDatagrid;

    ascSort = ClrDatagridSortOrder.ASC;

    private destroySubject = new Subject();

    ngAfterViewInit() {
        // This is a hack because Clarity does not delete removed rows
        this.grid.rows.changes.pipe(takeUntil(this.destroySubject)).subscribe(_ => this.grid.resize());
    }

    ngOnDestroy() {
        this.destroySubject.next();
    }

    trackById(_: number, item: Recipe) {
        return item && item._id;
    }
}
