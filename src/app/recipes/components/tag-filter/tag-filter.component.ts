import { Component } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Recipe } from 'src/app/shared/models';
import { RecipeState } from 'src/app/shared/state/recipe';

@Component({
    selector: 'fc-tag-filter',
    templateUrl: './tag-filter.component.html',
    styleUrls: ['./tag-filter.component.scss'],
})
export class TagFilterComponent implements ClrDatagridFilterInterface<Recipe> {
    @Select(RecipeState.getTags) tags$: Observable<string[]>;

    public get changes(): Observable<any> {
        return this._changes.asObservable();
    }

    private _changes = new Subject<any>();
    private selectedTags: string[] = [];

    onTagsChange(tags: string[]) {
        this.selectedTags = tags;
        this._changes.next(tags);
    }

    isActive() {
        return this.selectedTags.length > 0;
    }
    accepts(recipe: Recipe) {
        return recipe.tags?.filter(t => this.selectedTags.includes(t)).length > 0;
    }
}
