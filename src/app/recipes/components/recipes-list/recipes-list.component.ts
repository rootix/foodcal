import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Recipe } from '../../models/recipes.model';

@Component({
    selector: 'fc-recipes-list',
    templateUrl: './recipes-list.component.html',
    styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent {
    @Input() recipes: Recipe[];
    @Output() addRecipe = new EventEmitter();
    @Output() editRecipe = new EventEmitter<Recipe>();
    @Output() deleteRecipe = new EventEmitter<Recipe>();
}
