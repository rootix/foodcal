import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Recipe } from 'src/app/shared/models';
import { RecipeState } from 'src/app/shared/state/recipe';

@Component({
    selector: 'fc-recipe-dialog',
    templateUrl: './recipe-dialog.component.html',
})
export class RecipeDialogComponent {
    @Select(RecipeState.getTags) tags$: Observable<string[]>;

    isOpen = false;
    isNew = false;

    readonly form = new FormGroup({
        _id: new FormControl(null, Validators.required),
        name: new FormControl(null, Validators.required),
        url: new FormControl(),
        tags: new FormControl(),
        note: new FormControl(),
    });

    loading: boolean;
    private submitHandler: (recipe: Recipe) => Observable<void>;

    open(recipe: Recipe, submitHandler: (recipe: Recipe) => Observable<void>) {
        this.form.reset();
        this.isNew = recipe._id === undefined;
        this.submitHandler = submitHandler;
        this.form.patchValue({ _id: 0 });
        if (!this.isNew) {
            this.form.patchValue(recipe);
        }

        this.isOpen = true;
    }

    onSubmit() {
        for (const i in this.form.controls) {
            if (this.form.controls.hasOwnProperty(i)) {
                this.form.controls[i].markAsDirty();
                this.form.controls[i].updateValueAndValidity();
            }
        }

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.submitHandler({ ...this.form.value })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(_ => {
                this.isOpen = false;
            });
    }
}
