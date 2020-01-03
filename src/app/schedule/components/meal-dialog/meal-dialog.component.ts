import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrForm, ClrLoadingState } from '@clr/angular';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { finalize, map, withLatestFrom } from 'rxjs/operators';
import { Recipe } from 'src/app/shared/models';
import { CreateRecipe, EnsureLoadAllRecipes, RecipeState } from 'src/app/shared/state/recipe';

import { Meal } from '../../models/schedule.model';

@Component({
    selector: 'fc-meal-dialog',
    templateUrl: './meal-dialog.component.html'
})
export class MealDialogComponent implements OnInit {
    @ViewChild(ClrForm) clarityForm: ClrForm;
    @Select(RecipeState.getAllRecipes) allRecipes$: Observable<Recipe[]>;
    @Select(RecipeState.loading) allRecipesLoading$: Observable<boolean>;

    loading$: Observable<boolean>;

    isOpen = false;
    isNew = false;

    readonly form = new FormGroup({
        _id: new FormControl(0, Validators.required),
        date: new FormControl(null, Validators.required),
        type: new FormControl(null, Validators.required),
        recipe: new FormControl(null, Validators.required),
        notes: new FormControl()
    });

    submitState: ClrLoadingState;

    private submitHandler: (meal: Meal) => Observable<void>;
    private createRecipeLoadingSubject = new BehaviorSubject(false);

    constructor(private store: Store) {
        this.loading$ = combineLatest([this.allRecipesLoading$, this.createRecipeLoadingSubject]).pipe(
            map(([allRecipesLoading, createRecipeLoading]) => allRecipesLoading || createRecipeLoading)
        );
    }

    ngOnInit() {
        this.store.dispatch(new EnsureLoadAllRecipes());
    }

    open(meal: Meal, submitHandler: (meal: Meal) => Observable<void>) {
        this.form.reset();
        this.isNew = meal._id === undefined;
        this.submitHandler = submitHandler;
        this.form.patchValue(meal);
        if (this.isNew) {
            this.form.patchValue({ _id: 0 });
        }
        this.isOpen = true;
    }

    onCreateRecipe = (recipeName: string) => {
        this.createRecipeLoadingSubject.next(true);
        return this.store
            .dispatch(new CreateRecipe({ name: recipeName }))
            .pipe(
                withLatestFrom(this.allRecipes$),
                map(([_, allRecipes]) => allRecipes[allRecipes.length - 1]),
                finalize(() => this.createRecipeLoadingSubject.next(false))
            )
            .toPromise();
    };

    onSubmit() {
        if (this.form.invalid) {
            this.clarityForm.markAsTouched();
            return;
        }

        this.submitState = ClrLoadingState.LOADING;
        this.submitHandler({ ...this.form.value })
            .pipe(finalize(() => (this.submitState = ClrLoadingState.DEFAULT)))
            .subscribe(_ => {
                this.isOpen = false;
            });
    }
}
