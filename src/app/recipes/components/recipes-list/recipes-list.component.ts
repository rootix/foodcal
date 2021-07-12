import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Recipe } from 'src/app/shared/models';
import { RecipeState } from 'src/app/shared/state/recipe';

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

    @Select(RecipeState.getTags) private tagsFromStore$: Observable<string[]>;
    tags$: Observable<{ text: string; value: string }[]>;

    expandSet = new Set<number>();

    constructor() {
        this.tags$ = this.tagsFromStore$.pipe(
            map(tags => [...tags].sort()),
            map(tags =>
                tags.map(tag => {
                    return { text: tag, value: tag };
                })
            )
        );
    }

    sortByName(a: Recipe, b: Recipe) {
        return a.name.localeCompare(b.name);
    }

    sortByLastPreparation(a: Recipe, b: Recipe) {
        return a.lastPreparation > b.lastPreparation ? 1 : a.lastPreparation === b.lastPreparation ? 0 : -1;
    }

    filterByTags(tags: string[], recipe: Recipe) {
        return tags.some(tag => recipe.tags.indexOf(tag) != -1);
    }

    onExpandChange(id: number, checked: boolean): void {
        if (checked) {
            this.expandSet.add(id);
        } else {
            this.expandSet.delete(id);
        }
    }
}
