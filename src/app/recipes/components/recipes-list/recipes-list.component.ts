import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ClrDatagrid, ClrDatagridSortOrder } from '@clr/angular';
import { Recipe } from 'src/app/shared/models';

@Component({
    selector: 'fc-recipes-list',
    templateUrl: './recipes-list.component.html',
    styleUrls: ['./recipes-list.component.scss'],
})
export class RecipesListComponent {
    @Input() recipes: Recipe[];
    @Input() loading: boolean;
    @Output() createRecipe = new EventEmitter();
    @Output() editRecipe = new EventEmitter<Recipe>();
    @Output() deleteRecipe = new EventEmitter<Recipe>();

    @ViewChild(ClrDatagrid) grid: ClrDatagrid;

    ascSort = ClrDatagridSortOrder.ASC;
}
