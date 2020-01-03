import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrForm, ClrLoadingState } from '@clr/angular';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Recipe } from 'src/app/shared/models';

@Component({
    selector: 'fc-recipe-dialog',
    templateUrl: './recipe-dialog.component.html'
})
export class RecipeDialogComponent {
    @ViewChild(ClrForm) clarityForm: ClrForm;

    isOpen = false;
    isNew = false;

    readonly form = new FormGroup({
        _id: new FormControl(null, Validators.required),
        name: new FormControl(null, Validators.required),
        url: new FormControl(),
        note: new FormControl()
    });

    submitState: ClrLoadingState;
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
        if (this.form.invalid) {
            console.log(this.form.value);
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
